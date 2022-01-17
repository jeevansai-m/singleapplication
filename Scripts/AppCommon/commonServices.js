
MainApp.service("commonServices", ['$rootScope', '$location', '$uibModal', 'AuthService', 'Upload', '$timeout', '$filter', 'dataServices', 'appSettings', '$http', function ($rootScope, $location, $uibModal, AuthService, Upload, $timeout, $filter, dataServices, appSettings, $http) {
    var com = this;
    this.errorCallback = function (reason) {
        $rootScope.errorMessage = reason.data;
        console.log(reason.data);
        $location.path("/error");
    }
    //jeevan

    this.SuccessMsg = function (message) {
        var modalInstance = $uibModal.open({
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'PartialViews/Shared/successMsg.html',
            controller: 'SuccessMsgController',
            fade: true,
            size: 'md',
            resolve: {
                Message: function () {
                    return message;
                }
            }
        }).result.then(function () { }, function () { });
    }
    this.ErrorMsg = function (message) {
        var modalInstance = $uibModal.open({
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'PartialViews/Shared/errorMsg.html',
            controller: 'ErrorMsgController',
            fade: true,
            size: 'md',
            resolve: {
                Message: function () {
                    return message;
                }
            }
        }).result.then(function () { }, function () { });
    }

    var Url = $location.absUrl();
    this.DomainUrl = Url.substring(0, Url.lastIndexOf("/") + 1);

    function isValidDate(d) {
        return d instanceof Date && !isNaN(d);
    }

    this.DatetoString = function (Date) {
        var result = "";
        if (isValidDate(Date)) {
            result = $filter('date')(Date, 'dd-MMM-yyyy').replace(',', '')
        }
        return result;
    }

    this.openPopUp = function (ctrl, templateurl, message, size) {
        var modalInstance = $uibModal.open({
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: templateurl,
            controller: ctrl,
            //controllerAs: '$ctrl',
            size: size,
            resolve: {
                Message: function () {
                    return message;
                }
            }
        }).result.then(function () { }, function () { });
        return modalInstance;
    }

    this.openCustomPopUp = function (ctrl, templateurl, message, size) {

        var modalInstance = $uibModal.open({
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: templateurl,
            controller: ctrl,
            backdrop: 'static',
            keyboard: false,
            //controllerAs: '$ctrl',
            size: size,
            resolve: {
                Message: function () {
                    return message;
                }
            }
        });

        return modalInstance;
    }

    this.confirmMsgbox = function (message) {
        if (message.length == 0) { message = 'You are trying to change the status. Do you want to continue?' }
        var modalInstance = $uibModal.open({
            templateUrl: 'PartialViews/Shared/confirmMsgbox.html',
            controller: 'confirmMsgboxController',
            size: 'md',
            resolve: {
                Message: function () {
                    return message;
                }
            }
        })
        return modalInstance;
    }

    this.LoggedUserInfo = function () {
        return AuthService.LoggedUserInfo();
    }

    this.updateLoggedUserInfo = function (userInfoEntity) {
        AuthService.UpdateLoggedUserInfo(userInfoEntity);
    }

    this.printTable = function (content, clientLogo, headerString, subHeaderString, GraphImage) {
        var mywindow = window.open('', 'PRINT', 'left=100,top=100,width=1000,height=1000,tollbar=0,scrollbars=1,status=0,resizable=1');
        mywindow.document.write('<html><head><title></title>');
        mywindow.document.write('</head><body >');
        mywindow.document.write("<table cellpadding='0' border='0' cellspacing='0' style='width:100%;  border-collapse: collapse; font-family:arial; background:#FFF; color: #333; float:left;'><tr><td style='text-align:left; padding:5px 0px; font-size:14px;'>" + '' + "</td><td style='padding:5px 0px; text-align:center;'></td><td style='text-align:right; padding:5px 0px; font-size:14px;'>" + $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss') + "</td></tr> <tr><td colspan='100%'>&nbsp;</td></tr><tr><td colspan='100%'><table width='100%'><tr><td style='text-align:left; padding:5px 0px; width: 156px;'><div style='text-align: center;width: 156px; padding: 10px 5px 10px 5px; height: 90px; margin: 0px 0 10px 0; background: #FFF; box-shadow: 0px 0px 5px #333;'> <img style='margin:0 4px; height:70px; width:146px' src=" + clientLogo + " /></div></td><td style='padding:5px 0px; text-align:center;'><h1 style='font-size:48px; width: 100%;'>" + headerString + "</h1></td><td style='text-align:left; padding:5px 0px; width: 156px;'></td></tr></table></td></tr>");
        if (GraphImage != undefined && GraphImage != '') {
            mywindow.document.write("<tr><td colspan='4' style='height:500px; border-top:1px solid #eee;'><div style='padding:30px 15px'>" + GraphImage + "</div></td></tr>");
        }
        mywindow.document.write("<tr><td colspan='4'>" + content + "</td></tr>");
        mywindow.document.write('<table></body></html>');
        mywindow.document.close();
        setTimeout(function () {
            mywindow.focus();
            mywindow.print();
            mywindow.close();
        }, 100)
        return true;
    }
    this.printTableOnly = function (content, clientLogo, headerString, subHeaderString, organizationLogo) {
        var mywindow = window.open('', 'PRINT', 'left=100,top=100,toolbar=0,scrollbars=1,status=0,resizable=1');
        mywindow.document.write('<html><head><title></title>');
        mywindow.document.write('</head><body >');
        mywindow.document.write("<table cellpadding='0' border='0' cellspacing='0' style='width:100%;  border-collapse: collapse; font-family:arial; background:#FFF; color: #333; float:left;'>");

        mywindow.document.write("<tr><td colspan='4'>" + content + "</td></tr>");
        mywindow.document.write('</table></body></html>');
        mywindow.document.close();
        setTimeout(function () {
            mywindow.focus();
            mywindow.print();
            mywindow.close();
        }, 100)
        return true;
    }
    this.dateFormat = 'dd-MMM-yyyy';
    this.datetimeFormat = 'dd-MMM-yyyy h:mm a';
    this.datetimeMinuteFormat = 'MMM d, y h:mm a';
    this.dateFormat_ = 'MM/dd/yyyy';
    this.uploadFiles = function (file, errFiles, sender, fromScreen, from, filePathKey) {
        sender.errorMessage = null;
        //vm.f = file;
        var errFile = errFiles && errFiles[0];
        if (errFile) {
            switch (errFile.$error) {
                case "maxSize":
                    sender.errorMessage = errFile.name + ' size ' + formatBytes(errFile.size) + ' exceeds the maximum size limit. Please upload an file below ' + errFile.$errorParam;
                    break;
                case "pattern":
                    sender.errorMessage = errFile.name + ' is not in correct format. Please upload an file';
                    break;
            }
            //commonServices.SuccessMsg(errorMessage);
        }
        if (file) {
            file.upload = Upload.upload({
                url: 'FileUploadHandler.ashx',
                headers: {
                    "fileType": file.type,
                    "fromScreen": fromScreen,
                    "imageCategory": from
                    //"savefileName": savefileName
                },
                data: {
                    file: file
                }
            });

            file.upload.then(function (response) {
                $timeout(function () {
                    file.result = response.data;
                    switch (from) {
                        case "registerUser":
                            sender[filePathKey] = 'Uploads/profilePics/' + file.name;
                            break;
                        case "checklist":
                            sender[filePathKey] = 'Uploads/CheckListDocuments/' + file.name;
                            break;
                        case "registerdriver":
                            sender[filePathKey] = 'Uploads/Driverprofilepics/' + file.name;
                            break;
                    }
                });
            }, function (response) {
                if (response.status > 0)
                    sender.errorMsg = response.status + ': ' + response.data;
            }, function (evt) {
                sender.progress = Math.min(100, parseInt(100.0 *
                    evt.loaded / evt.total));
            });
        }
    }

    function formatBytes(bytes, decimals) {
        if (bytes == 0) return '0 Bytes';
        var k = 1024,
            dm = decimals || 2,
            sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
            i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }

    this.PaginationOptions = function () {
        var Settings = {
            sortKey: "",
            reverse: false,
            sort: sort,
            pageSize: 10,
            pageSizeItems: [10, 25, 50]
        }

        function sort(keyname) {
            Settings.sortKey = keyname;   //set the sortKey to the param passed
            Settings.reverse = !Settings.reverse; //if true make it false and vice versa
        }
        return Settings;
    }
    this.mapPopup = function () {
        var modalInstance = $uibModal.open({
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'PartialViews/map.html',
            controller: 'mapController',
            size: 'lg',
            //backdrop: false,
            //animation: true,
            resolve: {
                Message: function () {
                    return '';
                }
            }
        }).result.then(function () { }, function () { });
        return modalInstance;
    }

    this.getNestedDataFromFlat = function getTree(data, primaryIdName, parentIdName) {
        if (!data || data.length == 0 || !primaryIdName || !parentIdName)
            return [];

        var tree = [],
            rootIds = [],
            item = data[0],
            primaryKey = item[primaryIdName],
            treeObjs = {},
            parentId,
            parent,
            len = data.length,
            i = 0;

        for (var j = 0; j < data.length; j++) {
            treeObjs[data[j][primaryIdName]] = data[j];
        }

        while (i < len) {
            item = data[i++];
            primaryKey = item[primaryIdName];
            parentId = item[parentIdName];
            if (parentId == 73) {
                console.log(item);
            }

            if (parentId) {
                parent = treeObjs[parentId];
                if (parent.children) {
                    parent.children.push(item);
                } else {
                    parent.children = [item];
                }
            } else {
                rootIds.push(primaryKey);
            }
        }

        for (var i = 0; i < rootIds.length; i++) {
            tree.push(treeObjs[rootIds[i]]);
        };

        return tree;
    }

    this.getAppSettings = function () {
        return appSettings.getAppSettings();
    }

    this.IsFileExists = function (src) {
        var promise = $http.get(src);
        return promise;
    }

    this.IsFileExistNew = function (url) {
        //var entity = {};
        //entity.path = url;
        //alert(url);
        var promise =
            $http({
                method: 'POST',
                url: 'api/MainApp/IsFileExists',
                headers: { "Content-Type": "application/json" },
                data: JSON.stringify(url),
            });
        return promise;
    }
    this.GetDateFormat = function () {
        var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        var cdate = new Date()
        var Dateformat = DayNum(cdate.getDate()) + "-" + months[cdate.getMonth()] + "-" + cdate.getFullYear() + " " + DayNum(cdate.getHours()) + " : " + DayNum(cdate.getMinutes()) + " : " + DayNum(cdate.getSeconds());
        return Dateformat;
    }
    function DayNum(number) {
        return (number < 10 ? '0' : '') + number
    }
    this.CheckPassword = function (password) {
        //var matchCase = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,500}$/;
        //if (password.match(matchCase)) {
        //    return true;
        //}
        //else {
        //    return false;
        //}
        var errorMsg = '';
        if (password.length < 8) {
            errorMsg = 'Password must be at least 8 characters long.';
        }
        else {
            // Create an array and push all possible values that you want in password
            var matchedCase = new Array();
            matchedCase.push("[$@$!%*#?&]"); // Special Charector
            matchedCase.push("[A-Z]");      // Uppercase Alpabates
            matchedCase.push("[0-9]");      // Numbers
            matchedCase.push("[a-z]");     // Lowercase Alphabates

            // Check the conditions
            var count = 0;
            for (var i = 0; i < matchedCase.length; i++) {
                if (new RegExp(matchedCase[i]).test(password)) {
                    count++;
                }
            }
            if (count < 3) {
                errorMsg = 'Password must have 3 of the following character types: uppercase, lowercase, number and special characters.';
            }
        }
        return errorMsg;
    }
    this.DisplayDynamicData = function (message) {
        var modalInstance = $uibModal.open({
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'PartialViews/Shared/DisplayDynamicData.html',
            controller: 'DynamicDataController',
            fade: true,
            size: 'lg',
            resolve: {
                Message: function () {
                    return message;
                }
            }
        }).result.then(function () { }, function () { });
    }
    /*Checking file exceding 1mb*/
    this.CheckFileUplodLessthen1Mb = function (uploadedFile) {
        var uploadedfile = uploadedFile[0];
        var fileSize = Math.round((uploadedfile.size / 250)); //in KBs
        if (fileSize > 1 * 250) {
            this.SuccessMsg(uploadedFile[0].name + ' file size exeeded 250 kb. Please upload another file.');
            return false;
        } else {
            return true;
        }
    }
    /*email pattern*/
    this.emailPattern = /^[a-z0-9._-]+@[a-z]+\.[a-z.]{2,50}$/;
    /*Password pattern*/
    this.passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
}]);

MainApp.service("CacheService", ['$rootScope', '$cacheFactory', function ($rootScope, $cacheFactory) {

    this.cacheObject = $cacheFactory("newCacheInstance");
    this.add = function (key, value) {
        this.cacheObject.put(key, value);
    };

    this.update = function (key, value) {
        this.cacheObject.put(key, value);
    };

    this.read = function (key) {
        return this.cacheObject.get(key);
    };

    this.remove = function (key) {
        this.cacheObject.remove(key);
    };

    this.dispose = function () {
        this.cacheObject.removeAll();
        this.cacheObject.destroy();
    };
}]);

MainApp.factory("AuthService", ['$rootScope', 'CacheService', '$window', '$location', 'dataServices', function ($rootScope, CacheService, $window, $location, dataServices) {
    var authService = {};

    authService.AppStart = AppStart;
    authService.AppEnd = AppEnd;
    authService.IsAutenticated = IsAutenticated;
    authService.showMenus = showMenus;
    authService.LoggedUserInfo = LoggedUserInfo;

    authService.UpdateLoggedUserInfo = UpdateLoggedUserInfo;
    return authService;

    function AppStart(userInfoEntity) {

        $window.sessionStorage.setItem('IsAuthorized', true);
        $window.sessionStorage.setItem('UserInfo', JSON.stringify(userInfoEntity));

        //authService.IsAuthorized = true;
        //this.LoggedUserInfo = userInfoEntity;
    }
    function AppEnd() {
        //authService.IsAuthorized = false;
        $window.sessionStorage.removeItem('IsAuthorized');
        $window.sessionStorage.removeItem('UserInfo');
        //$rootScope.logout();
        CacheService.dispose();
    }

    function IsAutenticated() {

        //authService.IsAuthorized = false;
        var IsAuthorizedUser = $window.sessionStorage.getItem('IsAuthorized');
        if (IsAuthorizedUser == undefined) {
            return false;
        } else {
            return IsAuthorizedUser;
        }
    }
    function LoggedUserInfo() {

        var userInfo = $window.sessionStorage.getItem('UserInfo');
        return JSON.parse(userInfo);
    }

    function UpdateLoggedUserInfo(userInfoEntity) {
        $window.sessionStorage.removeItem('UserInfo');
        $window.sessionStorage.setItem('UserInfo', JSON.stringify(userInfoEntity));
    }

    function showMenus() {
        var userInfo = JSON.parse($window.sessionStorage.getItem('UserInfo'));
        $rootScope.loggedinUserName = userInfo.UserName;
        $rootScope.IsServiceProviderEmployee = userInfo.IsServiceProviderEmployee;
        $rootScope.IsServiceProvider = userInfo.IsServiceProvider;
        $rootScope.ServiceProviderID = userInfo.ServiceProviderID;
        if (userInfo.Photo == '' || userInfo.Photo == null) {
            if (userInfo.Gender == 'M') {
                $rootScope.loggedinUserPic = 'Images/user-male.png';
            }
            else {
                $rootScope.loggedinUserPic = 'Images/user-female.png';
            }
        }
        else {
            $rootScope.loggedinUserPic = userInfo.PhotoPath;
        }
        $rootScope.setDashboardpath = function (menu) {

            var path = menu.Title.trim().toLowerCase() == 'dashboard' ? userInfo.homeUrl.replace("/", "") : menu.Pagepath;
            return path;
        }
        $rootScope.loggedinUserEmail = userInfo.Email;
        $rootScope.loggedinUserCell = userInfo.Cell;
        $rootScope.loggedInUserId = userInfo.UserId;
        $rootScope.loggedUserRoleName = userInfo.UserRelatedRoles[0].RoleName;
        $rootScope.loggedUserRoleAcronym = userInfo.UserRelatedRoles[0].RoleAcronym;

        $rootScope.UserRelatedRoles = userInfo.UserRelatedRoles;
        $rootScope.Menus = userInfo.Menus;

        //To get the menu permissions
        var routeValue = $location.absUrl().substring($location.absUrl().lastIndexOf('/') + 1);
        var permissions = userInfo.FlatMenusData.firstOrDefault({ Pagepath: routeValue });
        if (angular.isUndefinedOrNull(permissions) == false) {
            $rootScope.readPermission = permissions.ReadPermission;
            $rootScope.writePermission = permissions.WritePermission;
            $rootScope.modifyPermission = permissions.ModifyPermission;
            $rootScope.deletePermission = permissions.DeletePermission;
        }

        $rootScope.IflogoNot = (userInfo.FirstName.slice(0, 1) + userInfo.Surname.slice(0, 1));

        $rootScope.CurrentYear = (new Date()).getFullYear();
        $rootScope.ChangeParent = function (id) {
            if ($rootScope.Parentactive != id) {
                var userinfo = LoggedUserInfo();
                if (userinfo != null) {
                    userinfo.Parentactive = $rootScope.Parentactive = id;
                    $rootScope.ParentactiveName = 'active';
                    userinfo.ChildActiveSub = $rootScope.ChildActiveSub = id;
                    userinfo.ChildActive = $rootScope.ChildActive = id;
                    UpdateLoggedUserInfo(userinfo);
                }
            }
        }

        $rootScope.logout = function () {
            $location.path("/home")
        }

        //User to User Common and single Chat
        $rootScope.commonChatActive = false;
        $rootScope.ChatUserID = null;
        $rootScope.$emit("OnUserLoggedIn", {});
    }
}]);