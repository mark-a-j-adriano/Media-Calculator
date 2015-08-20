angular.module('app').controller('listNielsenDataCtrl', function ($location, $scope, services) {
    $scope.nielsenDatas=[];
    $scope.prioData=[];
    $scope.isNewData=false;
    $scope.newData=[];
    $scope.insertData=[];
    
    services.getNielsenDatas().then(function (data) {
        $scope.nielsenDatas = data.data;        
        for (var key in $scope.nielsenDatas) {
            $scope.nielsenDatas[key].showEdit = false;
        }
    });
    
    $scope.editNielsen = function (idx) {
        $scope.nielsenDatas[idx].showEdit = true;
        $scope.prioData = $scope.nielsenDatas[idx];
    };
    
    $scope.addNielsen = function() {
        $scope.isNewData=true;
        $scope.insertData=[];
        $scope.newData=[
            {  
                'ID':null,    
                'Media':"",
                'Type':"",
                'Target1':0,
                'Target2':0,  
                'Target3':0,
                'Target4':0,
                'Target5':0,
                'Target6':0,
                'Target7':0,
                'Target8':0,
                'Target9':0,
                'Target10':0        
            }
        ];
    };
    
    $scope.resetNielsen = function (idx) {
        console.log('idx: ' + idx);
        if(idx==undefined){
            $scope.insertData=[];
            $scope.isNewData=false;            
            $scope.newData=[];
        }else{
            $scope.nielsenDatas[idx].showEdit = false;
            $scope.nielsenDatas[idx] = $scope.prioData; 
            $scope.priorName = [];     
        }
        
    };
    
    $scope.saveNielsen = function (idx) {
        if($scope.isNewData == true){
            $scope.insertData={  
                'ID':null,    
                'Media':$scope.newData[0].Media,
                'Type':$scope.newData[0].Type,
                'Target1':$scope.newData[0].Target1,
                'Target2':$scope.newData[0].Target2,
                'Target3':$scope.newData[0].Target3,
                'Target4':$scope.newData[0].Target4,
                'Target5':$scope.newData[0].Target5,
                'Target6':$scope.newData[0].Target6,
                'Target7':$scope.newData[0].Target7,
                'Target8':$scope.newData[0].Target8,
                'Target9':$scope.newData[0].Target9,
                'Target10':$scope.newData[0].Target10       
            };
            services.insertNielsenData($scope.insertData);  
            
            $scope.insertData.showEdit = false;
            $scope.nielsenDatas.push($scope.insertData);
            $scope.isNewData=false;
        }else{
            services.updateNielsenData($scope.nielsenDatas[idx].ID, $scope.nielsenDatas[idx]);
            $scope.nielsenDatas[idx].showEdit = false;        
            $scope.prioData = []; 
        }
    };
        
    $scope.deleteNielsen = function (idx) {
        if (confirm("Are you sure to delete Nielsen Data: " + $scope.nielsenDatas[idx].Media) == true) {
            //console.log("Was ABLE to delete " + nielsenData.ID);
            var index = $scope.nielsenDatas.indexOf($scope.nielsenDatas[idx]);
            var testVar = services.deleteNielsenData($scope.nielsenDatas[idx].ID);
            $scope.nielsenDatas.splice(index, 1);
        } else {
            //console.log("Was NOT able to delete " + nielsenData.ID);
        }
    };
});

angular.module('app').controller('editNielsenDataCtrl', function ($scope, $rootScope, $location, $routeParams, services, nielsenData) {
    var nielsenDataID = ($routeParams.nielsenDataID) ? parseInt($routeParams.nielsenDataID) : 0;
    $rootScope.title = (nielsenDataID > 0) ? 'Edit Nielsen Data' : 'Add Nielsen Data';
    $scope.buttonText = (nielsenDataID > 0) ? 'Update Nielsen Data' : 'Add New Nielsen Data';
    var original = nielsenData.data;
    original._id = nielsenDataID;
    $scope.nielsenData = angular.copy(original);
    $scope.nielsenData._id = nielsenDataID;

    $scope.isClean = function () {
        return angular.equals(original, $scope.nielsenData);
    }

    $scope.deleteNielsenData = function (nielsenData) {
        $location.path('/nielsen');
        if (confirm("Are you sure to delete Nielsen Data number: " + $scope.nielsenData._id) == true) {
            //console.log("Was ABLE to delete " + nielsenData.ID);
            services.deleteNielsenData(nielsenData.ID);
        } else {
            //console.log("Was NOT able to delete " + nielsenData.ID);
        }

    };
    
    $scope.saveNielsenData = function (nielsenData) {
        $location.path('/nielsen');
        if (nielsenDataID <= 0) {
            services.insertNielsenData(nielsenData);
        } else {
            services.updateNielsenData(nielsenDataID, nielsenData);
        }
    };
});