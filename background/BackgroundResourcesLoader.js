function BackgroundResourcesLoader(){}
BackgroundResourcesLoader.syncLoadScripts = function(files, tab, callback) {

	var me = this, file = files.splice(0, 1)[0];
	if(file){
		//if(file.isLoadedAt(tab)){ 
			browser.tabs.executeScript(tab.id, { "file": file.path /*, allFrames: true*/ }).then(function(){
				me.syncLoadScripts(files, tab, callback);
			});
		//}
		//else me.syncLoadScripts(files, tab, callback);
	}else{
		if(callback) callback();
	}	
};
BackgroundResourcesLoader.syncLoadStyles = function(files, tab, callback) {

	//TO MERGE 
};


function BackgroundResource(path, className){ 
	this.path = path;
	this.className = className
	//this.isLoadedAt = function(win){
		// We are omitting the loading if the class do exist. Otherwise we have an error
		// classes created with the class reserved word can not be redeclared
	//}
}

/* PROS AND CONS: if you do use this to load the files, 
you will have control over the already loaded files and 
you can use "classes" with no "redefinition" problems. 
But you will have to listen for each reload on each tab, so you can mark each file as loaded or not.

function VerifiableLoadingResource(path, classToImport){

	BackgroundResource.call(this, path, classToImport);
	this.isLoadedAt = function(tab){
		return tab.hasClassDefined(this.className);
	}
}
function UnverifiableLoadingResource(path){
	
	BackgroundResource.call(this, path, undefined);
	this.isLoadedAt = function(tab){
		return true;
	}
}*/