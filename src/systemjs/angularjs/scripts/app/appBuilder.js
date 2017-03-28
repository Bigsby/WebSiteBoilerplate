module.exports = {
    RegisterComponents: function (app) {
        app.component("componentA", {
            templateUrl: templatePath("componentA")
        });

        app.component("componentB", {
            templateUrl: templatePath("componentB")
        });
    }
}