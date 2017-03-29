const CodeMirror = require("codemirror");
module.exports = {
    RegisterComponents: function (app) {
        app.directive("codeHighlight", function ($http) {
            return {
                restrict: "E",
                link: function ($scope, element, attrs) {
                    var options = {
                        mode: attrs.language,
                        lineNumbers: attrs.linenumbers && attrs.linenumbers != "false",
                        lineWrapping: true,
                        theme: "neo",
                        readOnly: true
                    };

                    if (attrs.src) {
                        element.html("<br/><span>Loading...</span>");

                        $http.get(attrs.src)
                            .then(function (response) {
                                element.html("");
                                options.value = response.data;
                                CodeMirror(element[0], options);
                            });

                    }
                    else {
                        options.value = attrs.code;
                        CodeMirror(element[0], options);
                    }

                }
            }
        });

        app.controller("homeController", function (data) {
            var vm = this;
            angular.extend(vm, data.codes);
        });

        app.component("home", {
            templateUrl: templatePath("home"),
            controller: "homeController"
        });
    },
    RegisterStates: function (stateProvider) {
        stateProvider.state({
            name: "home",
            url: "/",
            component: "home"
        });
    }
}