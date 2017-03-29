"use strict";
(function () {
    define([
        "codemirrorRoot/lib/codemirror",
        "data",
        "codemirrorRoot/mode/javascript/javascript.min",
        "codemirrorRoot/mode/clike/clike.min",
        "codemirrorRoot/mode/python/python.min",
        "codemirrorRoot/mode/mllike/mllike.min",
        "codemirrorRoot/mode/go/go.min",
        "codemirrorRoot/mode/ruby/ruby.min",
        "codemirrorRoot/mode/perl/perl.min",
        "codemirrorRoot/mode/php/php.min",
        "codemirrorRoot/mode/vb/vb.min",
        "app/codemirror-powershell.min"
    ], function (CodeMirror, data) {
        return {
            RegisterComponents: function (app) {

                app.directive("codeHighlight", function ($http) {
                    return {
                        restrict: "E",
                        link: function ($scope, element, attrs) {
                            var options = {
                                mode: attrs.codemirror,
                                lineNumbers: attrs.linenumbers && attrs.linenumbers != "false",
                                lineWrapping: true,
                                theme: data.codes.codeMirrorTheme,
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
        };
    });
})();