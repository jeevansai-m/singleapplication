var MainApp = angular.module("MainApp", ['ngRoute', 'ui.bootstrap', 'menuRolesTree', 'angularUtils.directives.dirPagination', 'ngFileUpload', 'toaster', 'oc.lazyLoad']);
MainApp.factory("appSettings", ['$http', function ($http) {
    var appSettings = {};
    appSettings.getAppSettings = getAppSettings;
    return appSettings;

    function getAppSettings() {
        var res;
        $.ajax({
            url: 'api/MainApp/GetAppSettings',
            method: "GET",
            headers: { "Content-Type": "application/json" },
            data: '',
            async: false,
            success: function (response) {
                res = response;
            },
            error: function (data) {
            }
        });
        return res;
    }
}]);

var $routeProviderReference;

MainApp.config(['$routeProvider', '$locationProvider', '$qProvider', '$httpProvider', '$compileProvider', function ($routeProvider, $locationProvider, $qProvider, $httpProvider, $compileProvider) {
    $locationProvider.hashPrefix('');
    $locationProvider.html5Mode(true);
    $routeProvider.caseInsensitiveMatch = true;
    $qProvider.errorOnUnhandledRejections(false);
    $routeProviderReference = $routeProvider;
    $httpProvider.interceptors.push('loadingPnlInterceptor');
    $compileProvider.debugInfoEnabled(false);
}]);

MainApp.run(['$route', '$http', '$rootScope', '$ocLazyLoad', 'appSettings', function ($route, $http, $rootScope, $ocLazyLoad, appSettings) {
    $http.get("Scripts/Routes/default.json").then(function (response) {
        var iLoop = 0, currentRoute, routeName, fpath;
        for (iLoop = 0; iLoop < response.data.AllRoutes.length; iLoop++) {
            currentRoute = response.data.AllRoutes[iLoop];
            routeName = "/" + currentRoute.KeyName;

            $routeProviderReference.when(routeName, {
                templateUrl: currentRoute.PageUrl,
                controller: currentRoute.Controller,
                controllerAs: currentRoute.controllerAs,
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', '$q', '$location', function ($ocLazyLoad, $q, $location) {
                        var deferred = $q.defer();
                        try {
                            $http.get("Scripts/Routes/default.json").then(function (response1) {
                                var resul = response1.data.AllRoutes.where({ "KeyName": $location.path().substring($location.path().lastIndexOf('/') + 1) });
                                if (resul == undefined) {
                                    fpath = "Scripts/prototypes.js";
                                }
                                else {
                                    if (resul[0].FilePath == undefined) {
                                        fpath = "Scripts/prototypes.js";
                                        $ocLazyLoad.load(fpath).then(function () {
                                            deferred.resolve();
                                        });
                                    }
                                    else {
                                        fpath = '' + resul[0].FilePath;
                                        $ocLazyLoad.load(fpath).then(function () {
                                            deferred.resolve();
                                        });
                                    }
                                }
                            });
                        } catch (ex) {
                            deferred.reject(ex);
                        }

                        return deferred.promise;
                    }]
                }
            }).otherwise({ redirectTo: '/home' });
        }
        $route.reload();
    });
}]);


MainApp.run(function ($rootScope, $location, AuthService, commonServices, $window) { //noti_factory
    $rootScope.$on('$routeChangeStart', function (event, next, current) {
        debugger
        if (next.$$route != undefined) {
            if (next.$$route.originalPath != undefined) {
                var topath = next.$$route.originalPath;
                if (topath != '/' && topath != '/home') {
                    var IsValidAuthUser = AuthService.IsAutenticated();
                    if (topath != '/viewgalleryimg') {
                        if (IsValidAuthUser == undefined || IsValidAuthUser == false) { //|| $location.url().indexOf("?")>0
                            //un-authorised user
                            event.preventDefault();
                            $rootScope.showLayout = false;
                            $location.path("/home");
                            $('#div_header').prop('class', 'hideHeaderNslideBar');
                            $('#div_contentFrame').prop('class', 'content-frame');
                            $('#div_layoutFooter').prop('class', 'hideHeaderNslideBar');
                            $('#leftMenuDiv').prop('class', 'hideHeaderNslideBar');
                            $('#chat_div').prop('class', 'hideHeaderNslideBar');
                        }
                        else {
                            //yes success authentication  
                            $('#div_header').prop('class', 'showHeaderNslideBar');
                            $('#div_contentFrame').prop('class', 'content-frame main-layout');
                            $('#div_layoutFooter').prop('class', 'showHeaderNslideBar');
                            $('#leftMenuDiv').prop('class', 'showHeaderNslideBar');
                            $('#chat_div').prop('class', 'showHeaderNslideBar');
                            debugger
                            AuthService.showMenus();
                            if (topath.toLowerCase() != '/home' && topath != '/') {

                                $rootScope.FromUserID = AuthService.LoggedUserInfo().UserId;

                                $rootScope.LoadSmartLogisticsHub = function () {
                                    if ($rootScope.ChatNotifyConn == undefined && $rootScope.EnableNotifications == 'Y') {
                                        $rootScope.ChatNotifyConn = $.hubConnection($rootScope.ServiceControllerUrl);
                                        if ($rootScope.ChatNotifyHub == undefined) {
                                            $rootScope.ChatNotifyHub = $rootScope.ChatNotifyConn.createHubProxy('EventManagementHub');
                                        }

                                        //When Connected to Hub
                                        $rootScope.ChatNotifyHub.on('receiveConnectedUserData', function (UserNotificationCounts) {
                                            if (UserNotificationCounts) {
                                                $rootScope.$emit("ReceiveChatData", UserNotificationCounts);
                                            }

                                        });

                                        //When Received Dynamic Chat Notifications
                                        $rootScope.ChatNotifyHub.on('receiveDependencyChatNotifications', function (chatNotificationsList) {
                                            if (chatNotificationsList.length > 0) {
                                                var chatNotifications = _.filter(chatNotificationsList, function (ndata) { return ndata.ToUserID == $rootScope.FromUserID });
                                                $rootScope.$emit("UpdateChatOnNotification", chatNotifications);
                                                if ($rootScope.ChatUserID) {
                                                    var sChatNotifications = _.filter(chatNotificationsList, function (ndata) {
                                                        return (ndata.ToUserID == $rootScope.FromUserID && ndata.FromUserID == $rootScope.ChatUserID)
                                                    });
                                                }
                                            }

                                        });

                                        //should be at last
                                        $rootScope.ChatNotifyConn.start({ withCredentials: false }).done(function () {
                                            console.log('Hub Connected, connection ID=' + $rootScope.ChatNotifyConn.id);
                                            $rootScope.ChatNotifyHub.invoke('startConnection', $rootScope.FromUserID);
                                        }).fail(function () {
                                            console.log('Could not connect to Hub');
                                        });
                                    }
                                }
                                //Load Hub after Login
                                $rootScope.LoadSmartLogisticsHub();
                            }
                            $rootScope.showLayout = true;
                        }
                    } else {
                        $('#div_header').prop('class', 'showHeaderNslideBar');
                        $('#div_contentFrame').prop('class', 'content-frame main-layout');
                        $('#div_layoutFooter').prop('class', 'showHeaderNslideBar');
                        $('#leftMenuDiv').prop('class', 'showHeaderNslideBar');
                        $rootScope.showLayout = true;
                    }
                }
                else {
                    AuthService.AppEnd();
                }
            }
        }
    });

    var lastDigestRun = new Date();
    $rootScope.$watch(function detectIdle() {
        var now = new Date();
        //date differences
        var dtDiff = (now - lastDigestRun);
        //to get the minutes of dates
        var resultInMinutes = Math.round(dtDiff / 60000);
        //to get the seconds of dates
        var rusultSeconds = ((now - lastDigestRun) / 1000);
        if (resultInMinutes >= 20 && (rusultSeconds > 60)) {
            //session timed out
            //go to loging page
            //check if route already in login page or not
            var fullUrlPath = $location.absUrl();
            if (fullUrlPath.indexOf('/home') <= 0) {
                $rootScope.invalidCredentials = true;
                $rootScope.div_invalidCredentials = "Your session has expired."
                //$location.path("/home");
                $rootScope.logout();
                $rootScope.showLayout = false;
                $('#div_header').prop('class', 'hideHeaderNslideBar');
                $('#div_contentFrame').prop('class', 'content-frame');
                $('#div_layoutFooter').prop('class', 'hideHeaderNslideBar');
                $('#leftMenuDiv').prop('class', 'hideHeaderNslideBar');
                $('#chat_div').prop('class', 'hideHeaderNslideBar');
                AuthService.AppEnd();
                lastDigestRun = now
            }
            else {
                lastDigestRun = now
            }
        } else { lastDigestRun = now }
    });
});

MainApp.directive('customhref', function ($route, $location, $rootScope) {
    return {
        link: function (scope, elm, attr) {
            elm.on('click', function () {
                $rootScope.IsLinkClicked = true;
                if ($location.path() === attr.customhref) {
                    $route.reload();
                }
            });
        }
    };
});

MainApp.directive('validFile', function () {
    return {
        require: 'ngModel',
        link: function (scope, el, attrs, ngModel) {
            //change event is fired when file is selected
            el.bind('change', function () {
                scope.$apply(function () {
                    ngModel.$setViewValue(el.val());
                    ngModel.$render();
                });
            });
        }
    }
});
MainApp.directive('numbersOnly', function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attr, ngModelCtrl) {
            function fromUser(text) {
                if (text) {
                    var transformedInput = text.replace(/[^0-9]/g, '');

                    if (transformedInput !== text) {
                        ngModelCtrl.$setViewValue(transformedInput);
                        ngModelCtrl.$render();
                    }
                    return transformedInput;
                }
                return null;
            }
            ngModelCtrl.$parsers.push(fromUser);
        }
    };
});
MainApp.directive('capitalize', function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attrs, modelCtrl) {
            var capitalize = function (inputValue) {
                if (inputValue == undefined) inputValue = '';
                var capitalized = inputValue.toUpperCase();
                if (capitalized !== inputValue) {
                    modelCtrl.$setViewValue(capitalized);
                    modelCtrl.$render();
                }
                return capitalized;
            }
            modelCtrl.$parsers.push(capitalize);
            capitalize(scope[attrs.ngModel]); // capitalize initial value
        }
    };
});
MainApp.directive('decimalsOnly', function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attr, ngModelCtrl) {
            function fromUser(text) {
                if (text) {
                    var transformedInput = text.replace(/[^0-9.]|\.(?=.*\.)/g, "");

                    if (transformedInput !== text) {
                        ngModelCtrl.$setViewValue(transformedInput);
                        ngModelCtrl.$render();
                    }
                    return transformedInput;
                }
                return undefined;
            }
            ngModelCtrl.$parsers.push(fromUser);
        }
    };
});
MainApp.directive('noSpaces', function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attrs, ngModel) {
            attrs.ngTrim = 'false';

            element.bind('keydown', function (e) {
                if (e.which === 32) {
                    e.preventDefault();
                    return false;
                }
            });

            ngModel.$parsers.unshift(function (value) {
                var spacelessValue = value.replace(/ /g, '');

                if (spacelessValue !== value) {
                    ngModel.$setViewValue(spacelessValue);
                    ngModel.$render();
                }

                return spacelessValue;
            });
        }
    };
});
MainApp.config(['$provide', DatepickerDecorate]);
function DatepickerDecorate($provide) {
    $provide.decorator('uibDaypickerDirective', function ($delegate) {
        var directive = $delegate[0];
        directive.templateUrl = "custom-template/datepicker/day.html";
        return $delegate;
    });
    $provide.decorator('uibMonthpickerDirective', function ($delegate) {
        var directive = $delegate[0];
        directive.templateUrl = "custom-template/datepicker/month.html";
        return $delegate;
    });
    $provide.decorator('uibYearpickerDirective', function ($delegate) {
        var directive = $delegate[0];
        directive.templateUrl = "custom-template/datepicker/year.html";
        return $delegate;
    });
};

MainApp.config(['$provide', Decorate]);
function Decorate($provide) {
    $provide.decorator('$locale', function ($delegate) {
        var value = $delegate.DATETIME_FORMATS;

        value.SHORTDAY = [
            "S",
            "M",
            "T",
            "W",
            "T",
            "F",
            "S"
        ];

        return $delegate;
    });
};
MainApp.factory('loadingPnlInterceptor', function ($q, $rootScope) {
    var activeRequests = 0;
    var started = function () {
        if (activeRequests == 0) {
            $rootScope.ProgressBar = true;
        }
        activeRequests++;
    };
    var ended = function () {
        activeRequests--;
        if (activeRequests == 0) {
            $rootScope.ProgressBar = false;
        }
    };
    return {
        request: function (config) {
            started();
            return config || $q.when(config);
        },
        response: function (response) {
            ended();
            return response || $q.when(response);
        },
        responseError: function (rejection) {
            ended();
            return $q.reject(rejection);
        }
    };
});