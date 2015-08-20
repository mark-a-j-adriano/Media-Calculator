angular.module('app').controller('newspaperCtrl', function ($scope, $location, $filter, services, recorder, recorderNews) {
    $scope.alert1 = [];
    $scope.alert2 = [];
    $scope.publications = [];
    $scope.myVar = false; 
    $scope.myBtn = true;
    $scope.AdjustedBudget = 0;
    $scope.newspaperData = recorder.getBudget();    
    for (var key in $scope.newspaperData) {
        if ($scope.newspaperData.hasOwnProperty(key)) {
            var obj = $scope.newspaperData[key]; 
            var testStr = $filter('uppercase')(obj['Media']);
            if(testStr =='NEWSPAPER'){
                $scope.list_category = obj['targetAudience'];
                $scope.list_Name = obj['targetName'];
                $scope.AdjustedBudget = obj['Adjusted'];
                break;
            }
        }
    };
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
    $scope.updateMediaSelection = function (selectionValue) {
        for (var i = 0; i < $scope.dataTables.length; i++)
        {
            $scope.dataTables[i].isSelected = selectionValue;
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
    $scope.randomize = function () {
        var toggle = true;
        var numbers = [];
        var titles = [];
        $scope.labels = [];

        services.getData($scope.list_category, "Newspaper").then(function (data) {
            $scope.dataTables = data.data
                //var object = data.data;
            //console.log(JSON.stringify(data.data));
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
                            }
                            toggle = !toggle;
                        }
                    }
                }
            }
            //console.log("$scope.labels: " + $scope.labels);
        });

        $scope.data = [numbers];
    };
    angular.element(document).ready(function () {       
        $scope.randomize();
    });
    $scope.formatter = function(modelValue, filter, defaultValue) {
        //console.log("arguments", arguments);
        if (modelValue) {
            return filter("currency")(modelValue);
        }
        return defaultValue;
    };
    $scope.showLastRow = function() {  
        $scope.recommendedTotal = 0;
        $scope.adjustedTotal = 0;       
        $scope.dataTotal = 0;  
                
        for(var i = $scope.dataTables.length - 1; i >= 0; i--){
            if($scope.dataTables[i].isSelected == true){
                $scope.publications.push($scope.dataTables[i])
                $scope.dataTotal = $scope.dataTotal + parseInt($scope.dataTables[i].Target);
            }
        };           
        
        if($scope.publications.length > 0){
            $scope.myVar = true;   
            $scope.myBtn = false;
            //Computation for the recommended values
            for (var p in $scope.publications) { 
            
                //console.log('$scope.AdjustedBudget: ' + $scope.AdjustedBudget);
                //console.log('$scope.publications[p].Target: ' + $scope.publications[p].Target);
                //console.log('$scope.dataTotal: ' + $scope.dataTotal);
                
                
                $scope.publications[p].Recommended = $scope.AdjustedBudget * ($scope.publications[p].Target / $scope.dataTotal);
                $scope.recommendedTotal = $scope.recommendedTotal + $scope.publications[p].Recommended;
                $scope.publications[p].Adjusted = $scope.AdjustedBudget * ($scope.publications[p].Target / $scope.dataTotal);
                $scope.adjustedTotal = $scope.adjustedTotal + $scope.publications[p].Recommended;          
            }            
        }else{            
            $scope.alert1.push({ type: 'danger', msg: 'Please select the Type of Media you want to use for your campaign.' });            
        }
       
    };  
    $scope.getAdjustedTotal = function(){
        $scope.adjustedTotal = 0;
        for(var i = $scope.publications.length - 1; i >= 0; i--){
            $scope.adjustedTotal = $scope.adjustedTotal +  $scope.publications[i].Adjusted;
        }    
    };
    $scope.submitBudget = function(path){
        if($scope.adjustedTotal > $scope.AdjustedBudget){
           $scope.alert2.push({ type: 'danger', msg: 'Total Adjusted value is greater than Newspaper Budget.' });            
        }else{
            for(var i = $scope.publications.length - 1; i >= 0; i--){
                
                if(angular.isUndefined($scope.publications[i]) || ($scope.publications[i] === null )){                    
                }else{
                    $scope.publications[i].targetAudience = $scope.list_category;
                    for (var key in $scope.targetDatas) {
                        if ($scope.targetDatas.hasOwnProperty(key)) {
                            var obj = $scope.targetDatas[key];
                            if(obj['ID'] == $scope.list_category){
                                $scope.publications[i].targetName = obj['Name'];                                
                            }                
                        }
                    } 
                    recorderNews.addBudget($scope.publications[i]); 
                    //console.log('recorderNews: ' + JSON.stringify($scope.publications[i]));                    
                }
            };
            $location.path( path );    
        }
    };
    
});