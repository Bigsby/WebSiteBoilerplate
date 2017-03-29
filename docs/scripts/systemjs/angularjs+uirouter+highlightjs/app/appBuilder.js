const hljs = require("hljs");

module.exports = {
    RegisterComponents: function (app) {
        app.directive("codeHighlight", function ($http) {
            return {
                restrict: "E",
                link: function ($scope, element, attrs) {
                    var pre = document.createElement("pre");
                    if (attrs.linenumbers && attrs.linenumbers != "false")
                        pre.className = "line-numbers";
                    var code = document.createElement("code");
                    code.className = "language-" + attrs.hljs;
                    pre.appendChild(code);


                    if (attrs.src) {
                        element.html("<br/><span>Loading...</span>");

                        $http.get(attrs.src)
                            .then(function (response) {
                                element.html("");
                                code.textContent = response.data;
                                try {
                                    hljs.highlightBlock(code);
                                } catch (error) {
                                    console.log(error);
                                }
                                element.html(pre.outerHTML);
                            });

                    }
                    else {
                        code.textContent = attrs.code;
                        hljs.highlightBlock(code);
                        element.html(pre.outerHTML);
                    }
                }
            }
        });

        app.controller("homeController", function (data) {
            var vm = this;
            angular.extend(vm, data.codes);
        });

        app.component("home", {
            templateUrl: templatePath("codes"),
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