MainApp.service("dataServices", ['$http', '$log', '$rootScope', function ($http, $log, $rootScope) {
    var requestParams = new Object();
    //get All Records
    this.getData = function (apiCtrlName) {

        requestParams.Id = 0;
        requestParams.ModeParameter = 'search';
        requestParams.DataList = []; //for clear the entity objects
        requestParams.DataList.push(new Object());
        var promise = $http({
            method: 'POST',
            url: $rootScope.ServiceControllerUrl + 'api/' + apiCtrlName,
            headers: {
                "Content-Type": "application/json"
            },
            data: JSON.stringify(requestParams)
        })
        return promise;
    };
    this.getAuthData = function (entity, apiCtrlName) {

        requestParams.Id = 0;
        requestParams.ModeParameter = 'search';
        requestParams.DataList = []; //for clear the entity objects
        requestParams.DataList.push(entity);
        var promise = $http({
            method: 'POST',
            url: $rootScope.ServiceControllerUrl + 'api/' + apiCtrlName,
            headers: {
                "Content-Type": "application/json"
            },
            data: JSON.stringify(requestParams)
        })
        return promise;
    };

    this.sendDataWithoutArrayPush = function (entity, apiCtrlName) {
        var promise = $http({
            method: 'POST',
            url: $rootScope.ServiceControllerUrl + 'api/' + apiCtrlName,
            headers: {
                "Content-Type": "application/json"
            },
            data: JSON.stringify(entity)
        })
        return promise;
    };

    //save or update entity
    this.SaveRUpdateDetails = function (ModeParameter, entity, apiCtrlName) {

        requestParams.Id = 0;
        requestParams.ModeParameter = ModeParameter;
        requestParams.DataList = []; //for clear the entity objects
        requestParams.DataList.push(entity);
        var promise = $http({
            method: 'POST',
            url: $rootScope.ServiceControllerUrl + 'api/' + apiCtrlName,
            headers: {
                "Content-Type": "application/json"
            },
            data: JSON.stringify(requestParams)
        })
        return promise;
    };
    //get entity details based on entityId
    this.edit = function (apiCtrlName, Id) {
        requestParams.Id = Id;
        requestParams.ModeParameter = 'edit';
        requestParams.DataList = []; //for clear the entity objects
        requestParams.DataList.push(new Object());
        var promise = $http({
            method: 'POST',
            url: $rootScope.ServiceControllerUrl + 'api/' + apiCtrlName,
            headers: {
                "Content-Type": "application/json"
            },
            data: JSON.stringify(requestParams)
        })
        return promise;
    };

    //change entity status based on entityId
    this.changeStatus = function (apiCtrlName, Id, entity) {
        requestParams.Id = Id;
        requestParams.ModeParameter = 'status';
        requestParams.DataList = []; //for clear the entity objects
        requestParams.DataList.push(entity);
        var promise = $http({
            method: 'POST',
            url: $rootScope.ServiceControllerUrl + 'api/' + apiCtrlName,
            headers: {
                "Content-Type": "application/json"
            },
            data: JSON.stringify(requestParams)
        })
        return promise;
    };
    //get filtered Records
    this.search = function (apiCtrlName, entity) {

        requestParams.Id = 0;
        requestParams.ModeParameter = 'search';
        requestParams.DataList = []; //for clear the entity objects
        requestParams.DataList.push(entity);
        var promise = $http({
            method: 'POST',
            url: $rootScope.ServiceControllerUrl + 'api/' + apiCtrlName,
            headers: {
                "Content-Type": "application/json"
            },
            data: JSON.stringify(requestParams)
        })
        return promise;
    };

    //delete entity details based on entityId
    this.delete = function (apiCtrlName, Id) {
        requestParams.Id = Id;
        requestParams.ModeParameter = 'delete';
        requestParams.DataList = []; //for clear the entity objects
        requestParams.DataList.push(new Object());
        var promise = $http({
            method: 'POST',
            url: $rootScope.ServiceControllerUrl + 'api/' + apiCtrlName,
            headers: {
                "Content-Type": "application/json"
            },
            data: JSON.stringify(requestParams)
        })
        return promise;
    };

    //custom function 
    this.CustomData = function (Id, ModeParameter, entity, apiCtrlName) {
        requestParams.Id = Id;
        requestParams.ModeParameter = ModeParameter;
        requestParams.DataList = []; //for clear the entity objects
        requestParams.DataList.push(entity);
        //alert(JSON.stringify(requestParams));
        var promise = $http({
            method: 'POST',
            url: $rootScope.ServiceControllerUrl + 'api/' + apiCtrlName,
            headers: {
                "Content-Type": "application/json"
            },
            data: JSON.stringify(requestParams)
        })
        return promise;
    };

    //get filtered Records
    this.logout = function () {
        requestParams.Id = 0;
        requestParams.ModeParameter = '';
        requestParams.DataList = []; //for clear the entity objects        
        var promise = $http({
            method: 'POST',
            url: $rootScope.ServiceControllerUrl + 'api/Admin/Logout',
            headers: {
                "Content-Type": "application/json"
            },
            data: JSON.stringify(requestParams)
        })
        return promise;
    };

    //custom function 
    this.DataCollectionForDdls = function (Id, DependancyMode, RequiredCollection, DependancyRequestFrom) {

        requestParams.Id = Id;
        requestParams.DependancyMode = DependancyMode;
        requestParams.RequiredCollection = RequiredCollection;
        requestParams.DependancyRequestFrom = DependancyRequestFrom;
        var promise = $http({
            method: 'POST',
            url: $rootScope.ServiceControllerUrl + 'api/Common/RDCForDdls',
            headers: {
                "Content-Type": "application/json"
            },
            data: JSON.stringify(requestParams)
        })
        return promise;
    };

    /*Using Maintence drop down */
    this.DynamicDataCollectionForDdls = function (Id, DependancyMode, RequiredCollection, DependancyRequestFrom) {

        requestParams.Id = Id;
        requestParams.DependancyMode = DependancyMode;
        requestParams.RequiredCollection = RequiredCollection;
        requestParams.DependancyRequestFrom = DependancyRequestFrom;
        var promise = $http({
            method: 'POST',
            url: $rootScope.ServiceControllerUrl + 'api/Common/DynamicRDCForDdls',
            headers: {
                "Content-Type": "application/json"
            },
            data: JSON.stringify(requestParams)
        })
        return promise;
    };

    this.SaveFile = function (files, fileType, fromScreen, savedDateTime, userid, eventId) {
        if (files.length > 0) {
            var data = new FormData();
            for (var i = 0; i < files.length; i++) {
                data.append(files[i].name, files[i]);
            }
            var uploadedcontent = $.ajax({
                url: "FileUploadHandler.ashx",
                type: "POST",
                data: data,
                contentType: false,
                processData: false,
                async: true,
                headers: {
                    "fileType": fileType,
                    "fromScreen": fromScreen,
                    "savedDateTime": savedDateTime,
                    "userid": userid,
                    "eventId": eventId
                },
                success: function (result) { },
                error: function (err) { }
            });
            return uploadedcontent;
        }
    };
    this.Request_search_with_full_DTO = function (apiCtrlName, entity) {
        var promise = $http({
            method: 'POST',
            url: $rootScope.ServiceControllerUrl + 'api/' + apiCtrlName,
            headers: {
                "Content-Type": "application/json"
            },
            data: JSON.stringify(entity)
        })
        return promise;
    };

}]);
