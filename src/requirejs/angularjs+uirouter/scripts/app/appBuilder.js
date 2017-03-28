"use strict";
(function () {
    define([], function () {
        return {
            RegisterComponents: function (app) {
                app.component("home", {
                    templateUrl: templatePath("home")
                });

                app.component("componentA", {
                    templateUrl: templatePath("componentA")
                });

                app.component("componentB", {
                    templateUrl: templatePath("componentB")
                });
            },
            RegisterStates: function (stateProvider) {
                stateProvider.state({
                    name: "home",
                    url: "/",
                    component: "home"
                });

                stateProvider.state({
                    name: "componentA",
                    url: "/componentA",
                    component: "componentA"
                });

                stateProvider.state({
                    name: "componentB",
                    url: "/componentB",
                    component: "componentB"
                });
            }
        };
    });
})();