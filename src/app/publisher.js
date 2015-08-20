angular.module('app').controller('publisherCtrl', function ($scope, $window, $modal, $log, ngDialog, recorderNews) {
    
    $scope.workspaces=[];
    $scope.workspaces = recorderNews.getBudget();
    
    var activeFlag = true;
    var details = [{insertion:"", colour:"", period: "", position:"", size:"", amount: ""}];
    var setAllInactive = function() {
        angular.forEach($scope.workspaces, function(workspace) {
            workspace.active = false;
        });
        
    };    
    var addNewWorkspace = function() {
        var id = $scope.workspaces.length + 1;
        $scope.workspaces.push({
            id: id,
            name: "Workspace " + id,
            active: true
        });
    };     
    
    $scope.appendData = function () {
        for (var p in $scope.workspaces) {
            $scope.workspaces[p].active = activeFlag;
            if(activeFlag){
                activeFlag=!activeFlag;
            };            
            $scope.workspaces[p].disable = false;
            console.log(p+': '+ JSON.stringify($scope.workspaces[p]));
            $scope.workspaces[p].details = [{insertion:"", colour:"", period: "", position:"", size:"", amount: ""}];
            
        }
    };   
    
    $scope.addWorkspace = function () {
        setAllInactive();
        addNewWorkspace();
    };    
    $scope.ShowConfirm = function () {
        if ($window.confirm("Please confirm?")) {
            $scope.Message = "You clicked YES.";
            console.log("You clicked YES.");
        } else {
            $scope.Message = "You clicked NO.";
            console.log("You clicked NO.");
        }
    };    
    $scope.openModalForm = function() {
		ngDialog.openConfirm({template: 'partials/modals.html',
		  scope: $scope //Pass the scope object if you need to access in the template
		}).then(
			function(value) {
				//save the contact form
			},
			function(value) {
				//Cancel or do nothing
			}
		);
	};    
    $scope.ShowDialog = function() {
        $dialog.dialog({}).open('partials/modals.html');  
    };    
    $scope.items = ['item1', 'item2', 'item3'];
    $scope.animationsEnabled = true;
    $scope.open = function (size) {

    var modalInstance = $modal.open({
      animation: $scope.animationsEnabled,
      templateUrl: 'partials/modals.html',
      controller: 'ModalInstanceCtrl',
      size: size,
      resolve: {
        items: function () {
          return $scope.items;
        }
      }
    });

    modalInstance.result.then(function (selectedItem) {
      $scope.selected = selectedItem;
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };
    $scope.toggleAnimation = function () {
    $scope.animationsEnabled = !$scope.animationsEnabled;
  };
    
    angular.element(document).ready(function () { 
        console.log('call append data');
        $scope.appendData();
        console.log('call append data done.');
    }); 
    
  
});