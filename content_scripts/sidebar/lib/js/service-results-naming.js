function ServiceInputUI(){

	UI.call(this);
	this.userDefInputXpath;

	this.loadSubformBehaviour = function() {
		this.enableDomElementSelection("div", "onResultsContainerSelection");
	};
	this.onResultsContainerSelection = function(data){

		console.log("onResultsContainerSelection");
	};
	this.clearTriggeringStrategyParamsArea = function(){
		document.querySelector("#trigger_mechanism_params_area").innerHTML = "";
	};
	this.addParamsConfigurationControls = function(controls){
		document.querySelector("#trigger_mechanism_params_area").appendChild(controls);
	};
	this.isElementSelected = function(elemType) {
		return (this.userDefInputXpath)? true : false;
	};
	this.areFormRequirementsMet = function(){
		return true;
	};
	this.loadPrevNavigationButton = function() {

		var me = this;
		document.querySelector(".prev > button").onclick = function(){   

	    	if(me.areFormRequirementsMet()){
	    		me.loadResultsSelectionForm();
		    }else me.showMissingRequirementMessage("triggering-error", "");
		};
	};
	this.areRequirementsMet = function(){
		return true;
	};
	this.loadNextNavigationButton = function() {

		var me = this;
		document.querySelector(".next > button").onclick = function(){   

	    	if(me.areRequirementsMet()){
	    	
		    	me.loadUrlAtSidebar({ 
	        		url: "/content_scripts/sidebar/service-results-selection.html",
	        		filePaths: [
	        			"/content_scripts/sidebar/lib/js/ui-commons.js",
	        			"/content_scripts/XPathInterpreter.js",
						"/content_scripts/sidebar/lib/js/service-results-selection.js"
					] 
	        	});
		    }//else me.showMissingRequirementMessage("triggering-error", "");
		};
	};
};



/*var serviceResults = new ServiceInputUI();
	serviceResults.initialize({ //otherwise, if the browser is a collaborator, the class can not be clonned
		"enableRuntimeListeners": function () {
			 browser.runtime.onMessage.addListener(serviceResults.callServiceInputUIActions) 
		},
		"disableRuntimeListeners": function() {
			browser.runtime.onMessage.removeListener(serviceResults.callServiceInputUIActions);
		}
	});*/