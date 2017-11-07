serviceCreator.controller('ServiceInputController', function($scope, $state, ServiceService) {

    AbstractController.call(this, $scope, $state);
    $scope.service = { 
      input: {
        selector:undefined,
        preview: 'lib/img/no-preview.png'
      }
    };

    $scope.loadDataModel = function() {
      ServiceService.getService().then(function(service) {
        $scope.service.input = service.input;
      }); 
    };
    $scope.saveDataModel = function() {
      ServiceService.setInput($scope.service.input);
    };
    $scope.undoActionsOnDom = function(aState) {
      $scope.disableDomElementSelection("input");
    };
    $scope.loadSubformBehaviour = function() { 
      $scope.enableDomElementSelection("input", "onElementSelection", "#property-preview-image");
    };
    $scope.onElementSelection = function(data){
  		this.showPreview(data.previewSource);
      $scope.service.input.preview = data.previewSource;
  		$scope.service.input.selector = data.selectors["1"][0];
  	}
  	$scope.showPreview = function(previewSource){
  		document.querySelectorAll(".hidden").forEach(function(elem){
  			elem.classList.remove("hidden");
  		});
  		document.querySelector("#property-preview-image").src = previewSource;
  	}
    $scope.areRequirementsMet = function(){
      return ($scope.service.input.selector)? true: false;
    };
    $scope.initialize();
});