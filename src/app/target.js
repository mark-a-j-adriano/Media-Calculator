angular.module('app').controller('listTargetDataCtrl', function ($scope, services) {
    $scope.targetDatas=[];
    $scope.priorName='';
    
    services.getTargetDatas().then(function (data) {
        $scope.targetDatas = data.data;
        //console.log('data.data:' + JSON.stringify(data.data));
        for (var key in $scope.targetDatas) {
            $scope.targetDatas[key].showEdit = false;
        }
        //console.log('targetData:' + JSON.stringify($scope.targetDatas));        
    });
        
    $scope.editTarget = function (idx) {
        $scope.targetDatas[idx].showEdit = true;
        $scope.priorName = $scope.targetDatas[idx].Name;
    };
    
    $scope.resetTarget = function (idx) {
        $scope.targetDatas[idx].showEdit = false;
        $scope.targetDatas[idx].Name = $scope.priorName; 
        $scope.priorName = ''; 
    };
    
    $scope.saveTarget = function (idx) {
        if($scope.priorName==$scope.targetDatas[idx].Name){
        }else{
            if (confirm("Are you sure to update Target Data number: " + $scope.targetDatas[idx].ID) == true) {
                services.updateTargetData($scope.targetDatas[idx].ID, $scope.targetDatas[idx]);
                $scope.targetDatas[idx].showEdit = false;
                //$scope.targetDatas[idx].Name = $scope.priorName; 
                $scope.priorName = ''; 
            }
        }
    };
    
});

angular.module('app').controller('editTargetDataCtrl', function ($scope, $rootScope, $location, $routeParams, services, targetData) {
    var targetDataID = ($routeParams.targetDataID) ? parseInt($routeParams.targetDataID) : 0;
    $rootScope.title = (targetDataID > 0) ? 'Edit Target Data' : 'Add Target Data';
    $scope.buttonText = (targetDataID > 0) ? 'Update Target Data' : 'Add New Target Data';
    var original = targetData.data;
    original._id = targetDataID;
    $scope.targetData = angular.copy(original);
    $scope.targetData._id = targetDataID;
    $scope.isClean = function () {
        return angular.equals(original, $scope.targetData);
    };
    
    $scope.deleteTargetData = function (targetData) {
        $location.path('/target');
        if (confirm("Are you sure to delete Target Data number: " + $scope.targetData._id) == true) {
            services.deleteTargetData(targetData.ID);
            //console.log("Was ABLE to delete " + targetData.ID);
        } else {
            //console.log("Was NOT able to delete " + targetData.ID);
        }

    };
    
    $scope.saveTargetData = function (targetData) {
        $location.path('/target');
        if (targetDataID <= 0) {
            services.insertTargetData(targetData);
        } else {
            services.updateTargetData(targetDataID, targetData);
        }
    };
    
    $scope.editTargetData = function (targetData) {
        $location.path('/target');
        if (confirm("Are you sure to delete Target Data number: " + $scope.targetData._id) == true) {
            services.deleteTargetData(targetData.ID);
            //console.log("Was ABLE to delete " + targetData.ID);
        } else {
            //console.log("Was NOT able to delete " + targetData.ID);
        }

    };
    
});