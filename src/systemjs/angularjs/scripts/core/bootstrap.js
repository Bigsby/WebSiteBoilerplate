"use strict";
(function () {
    SystemJS.config({
        "baseURL": "/scripts",
        "map": {
            "json": "https://cdnjs.cloudflare.com/ajax/libs/systemjs-plugin-json/0.3.0/json.min.js",
        },
        "paths": {
            "data": "../data"
        }
    });

    SystemJS.import("core/config.json!json").then(function (coreConfig) {
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
                    data[fileName] = require("data/" + fileName + ".json!json");
                });

            SystemJS.register(["data"], function () {
                return data;
            });

            SystemJS.import("appBuilder").then(function (appBuilder) {
                const appName = "bigsbyApp";
                const app = angular.module(appName, ["ngSanitize"]);

                window.templatePath = function (name) {
                    return "templates/" + name + ".html";
                };

                appBuilder.RegisterComponents(app);

                angular.bootstrap(document, [appName]);
            });

        });
    });

})();