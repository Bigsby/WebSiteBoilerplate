"use strict";

function GetPath(){
    var processReg = /:\/\/\w+(?::\d+)?\/[^-]+-(.*).html/;
    var path = processReg.exec(window.location.href)[1];
    var replaces = {
        "ajs": "angularjs",
        "uir": "uirouter",
        "cm": "codemirror",
        "hl": "highlight",
        "pr": "prism"
    };
    for (var key in replaces)
        path = path.replace(key, replaces[key]);
    
    return path.split("-").join("+");
}

requirejs.config({
    baseUrl: "/scripts/requirejs/" + GetPath(),
    paths: {
        "text": "https://cdnjs.cloudflare.com/ajax/libs/require-text/2.0.12/text.min",
        "json": "https://cdnjs.cloudflare.com/ajax/libs/requirejs-plugins/1.0.3/json.min",
        "coreConfig": "../core/config.json",
        "appConfig": "app/config.json",
        "data": "./../../../data/"
    },
});

requirejs(["json!coreConfig", "json!appConfig"], function (coreConfig, appConfig) {

    var head = document.getElementsByTagName("head")[0];
    appConfig.styles.forEach(function (fileName) {
        var fileref = document.createElement("link");
        fileref.setAttribute("rel", "stylesheet");
        fileref.setAttribute("type", "text/css");
        fileref.setAttribute("href", fileName + ".css");
        head.appendChild(fileref);
    });

    requirejs.config(coreConfig.config);
    requirejs.config(appConfig.config);

    var dataRequires = [];
    var dataRequired = false;
    if (appConfig.initialData) {
        dataRequired = true;
        appConfig.initialData.forEach(function (file) {
            dataRequires.push("json!data/" + file + ".json");
        });
    }

    requirejs(dataRequires.concat(coreConfig.requires.concat(appConfig.requires)), function () {
        var data = {};
        if (dataRequired) {
            for (var dataIndex = 0; dataIndex < appConfig.initialData.length; dataIndex++) {
                data[appConfig.initialData[dataIndex]] = arguments[dataIndex];
            }
			define("data", function () { return data; });
        }

        requirejs(["appBuilder"], function (appBuilder) {

            if (appBuilder.ProcessData && typeof appBuilder.ProcessData === "function")
                appBuilder.ProcessData(data);


            var app = angular.module(coreConfig.angularAppName, coreConfig.angular.modules.concat(appConfig.angular.modules));
            app.value("data", data);

            if (appConfig.ga)
                app.run(function ($window, $transitions, $location) {
                    if ($window.ga) {
                        $window.ga("create", appConfig.ga, "auto");
                        $transitions.onSuccess({}, () => {
                            $window.ga("send", "pageview", $location.path());
                        });
                    }
                });

            window.templatePath = function (name) {
                return "templates/" + name + ".html";
            };

            if (appBuilder.RegisterComponents && typeof appBuilder.RegisterComponents === "function")
                appBuilder.RegisterComponents(app);

            app.config(coreConfig.angular.configComponents.concat(appConfig.angular.configComponents || []).concat([
                function ($httpProvider, $sceProvider, $stateProvider, $urlRouterProvider) {
                    $httpProvider.defaults.useXDomain = true;
                    $sceProvider.enabled(false);

                    if ($stateProvider &&
                        appBuilder.RegisterStates && typeof appBuilder.RegisterStates === "function")
                        appBuilder.RegisterStates($stateProvider);

                    if ($urlRouterProvider)
                        $urlRouterProvider.otherwise("/");
                }
            ]));

            angular.bootstrap(document, [coreConfig.angularAppName]);
        });
    });
});