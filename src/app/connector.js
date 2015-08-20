angular.module('app').factory('services', ['$http', function ($http) {
    var serviceBase = 'services/'
    var obj = {};
    obj.getCustomers = function () {
        return $http.get(serviceBase + 'customers');
    }
    obj.getCustomer = function (customerID) {
        return $http.get(serviceBase + 'customer?id=' + customerID);
    }
    obj.insertCustomer = function (customer) {
        return $http.post(serviceBase + 'insertCustomer', customer).then(function (results) {
            return results;
        });
    };
    obj.updateCustomer = function (id, customer) {
        return $http.post(serviceBase + 'updateCustomer', {
            id: id,
            customer: customer
        }).then(function (status) {
            return status.data;
        });
    };
    obj.deleteCustomer = function (id) {
        return $http.delete(serviceBase + 'deleteCustomer?id=' + id).then(function (status) {
            return status.data;
        });
    };

    //Nielsen Data
    obj.getNielsenDatas = function () {
        return $http.get(serviceBase + 'nielsenDatas');
    }
    obj.getNielsenData = function (nielsenDataID) {
        return $http.get(serviceBase + 'nielsenData?id=' + nielsenDataID);
    }
    obj.insertNielsenData = function (nielsenData) {
        return $http.post(serviceBase + 'insertNielsenData', nielsenData).then(function (results) {
            return results;
        });
    };
    obj.updateNielsenData = function (id, nielsenData) {
        return $http.post(serviceBase + 'updateNielsenData', {
            id: id,
            nielsenData: nielsenData
        }).then(function (status) {
            return status.data;
        });
    };
    obj.deleteNielsenData = function (id) {
        return $http.delete(serviceBase + 'deleteNielsenData?id=' + id).then(function (status) {
            return status.data;
        });
    };

    //Target Data
    obj.getTargetDatas = function () {
        return $http.get(serviceBase + 'targetDatas');
    }
    obj.getTargetData = function (targetDataID) {
        return $http.get(serviceBase + 'targetData?id=' + targetDataID);
    }
    obj.insertTargetData = function (targetData) {
        return $http.post(serviceBase + 'insertTargetData', targetData).then(function (results) {
            return results;
        });
    };
    obj.updateTargetData = function (id, targetData) {
        return $http.post(serviceBase + 'updateTargetData', {
            id: id,
            targetData: targetData
        }).then(function (status) {
            return status.data;
        });
    };
    obj.deleteTargetData = function (id) {
        return $http.delete(serviceBase + 'deleteTargetData?id=' + id).then(function (status) {
            return status.data;
        });
    };

    //Data Table
    obj.getData = function (dataID, dataType) {
        return $http.get(serviceBase + 'getData?id=' + dataID + '&typ=' + dataType);
    }
    obj.getMediaTitle = function (dataID, dataType) {
        return $http.get(serviceBase + 'getMediaTitle?id=' + dataID + '&typ=' + dataType);
    }
    obj.getMediaData = function (dataID, dataType) {
        return $http.get(serviceBase + 'getMediaData?id=' + dataID + '&typ=' + dataType);
    }
    return obj;
}]);