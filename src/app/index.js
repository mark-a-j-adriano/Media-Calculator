angular.module('app').controller('dataTablesCtrl', function ($scope, $location, services, recorder) {
    $scope.alert1 = [];
    $scope.alert2 = [];
    $scope.alert3 = [];
    overallBudget = [];
    services.getTargetDatas().then(function (data) {
        $scope.targetDatas = data.data;
    });   
    $scope.myVar = false; 
    $scope.myBtn = false;
    $scope.myGraph = false;   
    $scope.dataTotal = 0;
    $scope.colours = [
        { // grey
            fillColor: 'rgba(148,159,177,0.2)',
            strokeColor: 'rgba(148,159,177,1)',
            pointColor: 'rgba(148,159,177,1)',
            pointStrokeColor: '#fff',
            pointHighlightFill: '#fff',
            pointHighlightStroke: 'rgba(148,159,177,0.8)'
      },
        { // dark grey
            fillColor: 'rgba(77,83,96,0.2)',
            strokeColor: 'rgba(77,83,96,1)',
            pointColor: 'rgba(77,83,96,1)',
            pointStrokeColor: '#fff',
            pointHighlightFill: '#fff',
            pointHighlightStroke: 'rgba(77,83,96,1)'
      }
    ];
    $scope.randomize = function () {
        var toggle = true;  
        $scope.myVar = false;         
        var numbers = [];
        var titles = []; 
        $scope.labels = [];  
        
        if(($scope.list_budget == undefined)){
            $scope.alert1.push({ type: 'danger', msg: 'Please enter a valid campaign budget.' });             
        }else{        
            if(($scope.list_category == undefined) || ($scope.list_category == "")){
                $scope.alert1.push({ type: 'danger', msg: 'Please select target audience for the campaign.' });  
                $scope.myGraph = false;            
            }else{
                $scope.myGraph = true; 
                $scope.myBtn = true;
                services.getData($scope.list_category, "Media").then(function (data) {
                    $scope.dataTables = data.data
                    //var object = data.data;
                    //console.log(JSON.stringify(data.data));
                    $scope.dataBudgets = [];
                    for (var key in data.data) {
                        if (data.data.hasOwnProperty(key)) {
                            var obj = data.data[key];
                            for (var prop in obj) {
                                // important check that this is objects own property
                                // not from prototype prop inherited
                                if (obj.hasOwnProperty(prop)) {
                                    if (toggle) {
                                        titles.push(obj[prop]);
                                        $scope.labels.push(obj[prop]);
                                    } else {
                                        numbers.push(obj[prop]);
                                        $scope.dataTotal = $scope.dataTotal + parseInt(obj[prop]);
                                    }
                                    toggle = !toggle;
                                }
                            }
                        }
                    }
                    //console.log("$scope.labels: " + $scope.labels);
                    //console.log("$scope.dataTotal: " + $scope.dataTotal);

                    $scope.areAllMediaSelected = false;
                    for (var p in $scope.dataTables) {                
                        $scope.dataTables[p].isSelected = false;
                        $scope.dataTables[p].Recommended = 0;
                        $scope.dataTables[p].Adjusted = 0;
                        //console.log(p+': '+ JSON.stringify($scope.dataTables[p]));
                    } 
                });

                $scope.data = [numbers];
            }
        }
    };
    /* 
    angular.element(document).ready(function () {  
        $scope.list_category = 1;
        $scope.randomize();
    }); 
    */
    $scope.showLastRow = function() {  
        $scope.recommendedTotal = 0;
        $scope.adjustedTotal = 0;       
        $scope.dataTotal = 0;  
                
        if(($scope.list_budget == undefined)){
           $scope.alert2.push({ type: 'danger', msg: 'Please enter a valid campaign budget.' });            
        }else{
            if(($scope.list_category == undefined) || ($scope.list_category == "") || ($scope.list_category == 1)){
                $scope.alert2.push({ type: 'danger', msg: 'Please select target audience for the campaign.' });  
                $scope.myGraph = true;
            }else{                
                for(var i = $scope.dataTables.length - 1; i >= 0; i--){
                    if($scope.dataTables[i].isSelected == true){
                        $scope.dataBudgets.push($scope.dataTables[i])
                        $scope.dataTotal = $scope.dataTotal + parseInt($scope.dataTables[i].Target);
                    }
                };           
                if($scope.dataBudgets.length > 0){
                     $scope.myVar = true;  
                     $scope.myBtn = false;
                    //Computation for the recommended values
                    for (var p in $scope.dataBudgets) {   
                        $scope.dataBudgets[p].Recommended = $scope.list_budget * ($scope.dataBudgets[p].Target / $scope.dataTotal);
                        $scope.recommendedTotal = $scope.recommendedTotal + $scope.dataBudgets[p].Recommended;
                        $scope.dataTables[p].Adjusted = $scope.list_budget * ($scope.dataBudgets[p].Target / $scope.dataTotal);
                        $scope.adjustedTotal = $scope.adjustedTotal + $scope.dataBudgets[p].Recommended;          
                    }            
                }else{            
                    $scope.alert2.push({ type: 'danger', msg: 'Please select the Type of Media you want to use for your campaign.' });            
                }
            }
        }
        /*
        $scope.recommendedTotal = Math.ceil( $scope.recommendedTotal /.01)*0.01;   
        console.log('dataTables: ' + JSON.stringify($scope.dataTables));
        console.log('dataBudgets: ' + JSON.stringify($scope.dataBudgets));
        console.log('$scope.dataTotal: ' + $scope.dataTotal);
        */
    };  
    $scope.updateMediaSelection = function (selectionValue) {
      for (var i = 0; i < $scope.dataTables.length; i++)
      {
         $scope.dataTables[i].isSelected = selectionValue;
      }
    };
    $scope.removeMedia = function(selectionValue){
        for(var i = $scope.dataTables.length - 1; i >= 0; i--){
            if($scope.dataTables[i].Media == selectionValue){
                $scope.dataTables.splice(i,1);
            }
        }
    };    
    $scope.formatter = function(modelValue, filter, defaultValue) {
        //console.log("arguments", arguments);
        if (modelValue) {
            return filter("currency")(modelValue);
        }
            return defaultValue;
        };
    $scope.all = function() {
        //console.log("arguments", arguments);
        return true;
    };
    $scope.getAdjustedTotal = function(){
        $scope.adjustedTotal = 0;
        for(var i = $scope.dataBudgets.length - 1; i >= 0; i--){
            $scope.adjustedTotal = $scope.adjustedTotal +  $scope.dataBudgets[i].Adjusted;
        }    
    };
    $scope.closeAlert1 = function(index) {
        //console.log('$scope.closeAlert: ' + index);
        $scope.alert1.splice(index, 1);
    };
    $scope.closeAlert2 = function(index) {
        //console.log('$scope.closeAlert: ' + index);
        $scope.alert2.splice(index, 1);
    };
    $scope.closeAlert3 = function(index) {
        //console.log('$scope.closeAlert: ' + index);
        $scope.alert3.splice(index, 1);
    };    
    $scope.submitBudget = function(path){
        //console.log('$scope.adjustedTotal > $scope.list_budget: ' + ($scope.adjustedTotal > $scope.list_budget));
        if($scope.adjustedTotal > $scope.list_budget){
           $scope.alert3.push({ type: 'danger', msg: 'Total Adjusted value is greater than Campaign Budget.' });            
        }else{
            for(var i = $scope.dataBudgets.length - 1; i >= 0; i--){
                
                if(angular.isUndefined($scope.dataBudgets[i]) || ($scope.dataBudgets[i] === null )){                    
                }else{
                    $scope.dataBudgets[i].targetAudience = $scope.list_category;
                    for (var key in $scope.targetDatas) {
                        if ($scope.targetDatas.hasOwnProperty(key)) {
                            var obj = $scope.targetDatas[key];
                            if(obj['ID'] == $scope.list_category){
                                $scope.dataBudgets[i].targetName = obj['Name'];                                
                            }                
                        }
                    }                
                    
                    recorder.addBudget($scope.dataBudgets[i]); 
                }
            };
            $location.path( path );
        }
    };
    angular.isUndefinedOrNull = function(val) {
        return angular.isUndefined(val) || val === null 
    }
    
});