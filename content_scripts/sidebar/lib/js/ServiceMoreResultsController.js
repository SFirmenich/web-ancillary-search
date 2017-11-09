function MoreResultsRetrieval(client){ 
	this.getConfigurationFormState = function(data){};
}
function ClickBasedRetrieval(client){
	MoreResultsRetrieval.call(this, client);

	this.getConfigurationFormState = function(data){ 
		return "ServiceMoreResultsSelection";
	};
}
function ScrollDownBasedRetrieval(client){
	MoreResultsRetrieval.call(this, client);
}
function NoMoreResults(client){
	MoreResultsRetrieval.call(this, client);

	this.getConfigurationFormState = function(data){ 
		return;
	};
}


function MoreElementsConfig(){

	this.adaptPlaceholderExample = function(data) {
		document.querySelector("#search_service_name").setAttribute(
			"placeholder", 
			document.querySelector("#search_service_name").getAttribute("placeholder") + " " + data.domainName
		);
	};
};

serviceCreator.controller('ServiceMoreResultsController', function($scope, $state, ServiceService) {

    AbstractController.call(this, $scope, $state);

    $scope.service = {
    	"moreResults": {
	    	"className": 'NoMoreResults',
	    }
    };

    $scope.loadDataModel = function() {
      ServiceService.getService().then(function(service) {
        $scope.service.moreResults = service.moreResults;

        var option = document.querySelector("#" + $scope.service.moreResults.className);
        if(option) option.checked = true;
      }); 
    };
    $scope.saveDataModel = function() {
      ServiceService.setMoreResultsStrategy($scope.service.moreResults.className);
    };
    $scope.undoActionsOnDom = function() {
		$scope.disableDomElementSelection($scope.triggablesSelector); 
    };
    $scope.getValidationRules = function() { // areRequirementsMet < ... < areRequirementsMet
		return {
	        "more_res_mechanism": {
	            "required": true
	        }
	    };
    };
    $scope.loadNextStep = function() {
      if($scope.areRequirementsMet()){
      	var nextFormState = (new window[$scope.service.moreResults.className]()).getConfigurationFormState();
	    if(nextFormState == undefined) nextFormState = "ServiceFilters";
	    $state.go(nextFormState);
      } 
    };
    $scope.loadSubformBehaviour = function() { 
    	document.querySelectorAll(".list-group-item").forEach(function(elem){
    		elem.onclick = function(){
    			$scope.loadStrategyConfig(this);
    		};
    	});
    };
	$scope.showMissingRequirementMessage = function(){
		$scope.service.moreResults.showMissingRequirementMessage();
	};
	$scope.addParamsConfigurationControls = function(controls){
		document.querySelector("#trigger_mechanism_params_area").appendChild(controls);
	};
	$scope.isElementSelected = function(elemType) {
		return ($scope.userDefInputXpath)? true : false;
	};
	$scope.loadStrategyConfig = function(container){

		if(!container.classList.contains("active")){

			$scope.unselectAllRadios();
			container.classList.add("active");
			$scope.service.moreResults.className = container.querySelector("input[type=radio]").getAttribute("value");
			container.querySelector("input[type=radio]").click();
		}
	};
	$scope.unselectAllRadios = function() {
		document.querySelectorAll(".list-group-item").forEach(function(option){
			if(option.classList != undefined && option.classList.contains("active"))
				option.classList.remove("active");
		});
	};
    $scope.initialize();
});