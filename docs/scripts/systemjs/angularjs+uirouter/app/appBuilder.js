module.exports = {
    RegisterComponents: function (app) {
        app.component("home", {
            templateUrl: templatePath("routerHome")
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
}