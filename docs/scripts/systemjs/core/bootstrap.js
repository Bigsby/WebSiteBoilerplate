"use strict";
(function () {
    function GetPath() {
        var processReg = /:\/\/[^\/]+\/[^-]+-(.*).html/;
        var path = processReg.exec(window.location.href)[1];
        var pathReplaces = {
            "ajs": "angularjs",
            "uir": "uirouter",
            "cm": "codemirror",
            "hl": "highlightjs",
            "pr": "prism"
        };

        var titleReplaces = {
            "angularjs": "AngularJS",
            "uirouter": "UI Router",
            "codemirror": "CodeMirror",
            "highlightjs": "highlight.js",
            "prism": "PrimsJS"
        };

        for (var key in pathReplaces)
            path = path.replace(key, pathReplaces[key]);

        var title = path;
        for (var key in titleReplaces)
            title = title.replace(key, titleReplaces[key]);

        title = ("SystemJS-" + title).split("-").join(" & ");

        document.title = title + " - Bigsby";

        var titleElement = document.getElementById("title")
        titleElement.innerText = title;

        var back = document.createElement("button");
        back.innerText = "Index";
        back.onclick = function () {
            window.location = "/#demos";
        };
        titleElement.parentElement.appendChild(back);

        return path.split("-").join("+");
    }

    SystemJS.config({
        "baseURL": "/scripts/systemjs/" + GetPath(),
        "map": {
            "json": "https://cdnjs.cloudflare.com/ajax/libs/systemjs-plugin-json/0.3.0/json.min.js",
        },
        "paths": {
            "data": "../../../data"
        }
    });

    SystemJS.import("./scripts/systemjs/core/config.json!json").then(function (coreConfig) {
        SystemJS.import("app/config.json!json").then(function (appConfig) {
            SystemJS.config(coreConfig.config);
            SystemJS.config(appConfig.config);

            if (appConfig.styles)
                appConfig.styles.forEach(function (css) {
                    SystemJS.import(css);
                });

            const dataRequired = appConfig.initialData && appConfig.initialData.length;
            var data = {};

            if (appConfig.initialData)
                appConfig.initialData.forEach(function (file) {
                    SystemJS.import("data/" + file + ".json!json").then(function (dataContent) {
                        data[file] = dataContent;
                    });
                });

            SystemJS.register("data", [], function () {
                return data;
            });

            SystemJS.import("appBuilder").then(function (appBuilder) {
                const app = angular.module(coreConfig.angularAppName, coreConfig.angular.modules);
                app.value("data", data);

                if (appConfig.ga)
                    app.run(function ($window, $transitions, $location) {
                        $window.ga("create", appConfig.ga, "auto");
                        $transitions.onSuccess({}, () => {
                            $window.ga("send", "pageview", $location.path());
                        });
                    });

                window.templatePath = function (name) {
                    return "templates/" + name + ".html";
                };

                if (appBuilder.RegisterComponents && typeof appBuilder.RegisterComponents === "function")
                    appBuilder.RegisterComponents(app);

                app.config(coreConfig.angular.configComponents.concat([function ($httpProvider, $sceProvider, $stateProvider, $urlRouterProvider) {
                    $httpProvider.defaults.useXDomain = true;
                    $sceProvider.enabled(false);

                    if ($stateProvider &&
                        appBuilder.RegisterStates && typeof appBuilder.RegisterStates === "function")
                        appBuilder.RegisterStates($stateProvider);

                    if ($urlRouterProvider)
                        $urlRouterProvider.otherwise("/");
                }]));


                angular.bootstrap(document, [coreConfig.angularAppName]);
            });

        });
    });

})();