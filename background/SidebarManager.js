function SidebarManager(defaultFile, defaultDependencies, listeners){

	console.log("**************\nINSTANCIATING THE SIDEBAR MANAGER\n**************");

	this.defaultFile = defaultFile;
	this.defaultDependencies = defaultDependencies;
	this.status = {};
	this.listeners = [];
	this.addListeners(listeners);
}
SidebarManager.prototype.addListeners = function(listeners) { 

	for (var i = listeners.length - 1; i >= 0; i--) {
		this.addListener(listeners[i]);
	}
}
SidebarManager.prototype.initializeStateForTab = function(tabId) { 

	this.status[tabId] = new NoLoadedSidebar(this); 
}
SidebarManager.prototype.addListener = function(listener) { 

	this.listeners.push(listener);
}
SidebarManager.prototype.notifyListeners = function() { 

	var me = this;
	this.getCurrentTab(function(tab){
		for (var i = me.listeners.length - 1; i >= 0; i--) {
			me.listeners[i].onSidebarStatusChange(me.status[tab.id], tab);
		}
	});
}
SidebarManager.prototype.onFrameReadyForLoadingUrl = function() { 

	//this.open();  salta a onSidebarStatusChange
	this.loadChromeUrl(this.defaultFile, this.defaultDependencies); 
	this.notifyListeners();
}
SidebarManager.prototype.onSidebarClosed = function() { 

	this.close();
	this.notifyListeners();
}
SidebarManager.prototype.loadChromeUrl = function(chromeUrl, filePaths) { //PUBLIC

	this.getCurrentTab(function(tab){
		browser.tabs.sendMessage(tab.id, {
			call: "loadUrl", 
			args: { 
				"url": browser.extension.getURL(chromeUrl),
				"filePaths": filePaths
			}
		});
	});
};
SidebarManager.prototype.onElementSelection = function(data) { 

	console.log("***SidebarManager.prototype.onElementSelection");
	console.log(data);
	this.getCurrentTab(function(tab){
		browser.tabs.sendMessage(tab.id, {
			call: "onElementSelection", 
			args: data
		});
	});
}
SidebarManager.prototype.onTriggerSelection = function(data) { 

  	this.getCurrentTab(function(tab){
		browser.tabs.sendMessage(tab.id, {
			call: "onTriggerSelection", 
			args: data
		});
	});
};
SidebarManager.prototype.onResultsContainerSelection = function(data) { 

  	this.getCurrentTab(function(tab){
		browser.tabs.sendMessage(tab.id, {
			call: "onResultsContainerSelection", 
			args: data
		});
	});
};
SidebarManager.prototype.toggleSidebar = function(callback) { //PUBLIC

	var me = this;
	this.getCurrentTab(function(tab){
		//console.log("got current tab", tab);
		me.getStatusForTab(tab).toggleSidebar(tab, callback);
	});
};
SidebarManager.prototype.adaptPlaceholder = function(tab, data) {

	data.domainName = tab.url.split(".")[1];

	browser.tabs.sendMessage(tab.id, {
		call: data.callback, 
		args: data
	});
};
SidebarManager.prototype.getCurrentUrl = function(tab, data, sendResponse) {

	sendResponse("tab.url");
};
SidebarManager.prototype.getStatusForTab = function(tab) {

	//console.log("getting current tab's status", this.status[tab.id]);
	if (this.status[tab.id] == undefined)
		this.initializeStateForTab(tab.id);
	
	return this.status[tab.id];
};
SidebarManager.prototype.open = function() {

	var me = this;
	this.getCurrentTab(function(tab){
		me.getStatusForTab(tab).open(tab);
	});
};
SidebarManager.prototype.getCurrentTab = function(callback) {

	try{
		browser.tabs.query({active: true, currentWindow: true}).then((tabs) => {
			callback(tabs[0]);
		});
	}catch(err){ console.log(err); }	
};
SidebarManager.prototype.close = function() {
	var me = this;
	this.getCurrentTab(function(tab){
		me.getStatusForTab(tab).close(tab);
	});
};

//El estado sirve para diferenciar cuando se ha cargado los scripts necesarios en el contexto de la página y cuándo no. Hayq ue prevenir cargarlos dos veces.
function SidebarManagerStatus(context){
	this.open = function(tab){
		this.sendOpenMessage(tab);
	};
	this.close = function(tab){	};
	this.sendOpenMessage = function(tab){
		browser.tabs.sendMessage(tab.id, {call: "open"});
	};
	this.isOpen = function(){
		return false;
	};
	this.isLoaded = function(){
		return false;
	};
	this.toggleSidebar = function(tab, callback){};
	this.log = function(){};
}




function LoadedSidebar(context){ // SUPERCLASS
	SidebarManagerStatus.call(this, context);
	this.toggleSidebar = function(tab, callback){

		this.log(); 
		browser.tabs.sendMessage(tab.id, {call: "toggle"});
		if(callback) callback(tab);
	};
	this.isLoaded = function(){
		return true;
	};
}
function LoadedClosedSidebar(context){
	LoadedSidebar.call(this, context);
	this.isOpen = function(){
		return false;
	};
	this.log = function(){
		console.log("LoadedCLOSED-Sidebar- files already loaded. Just send toggle message to the CS_SIDEBAR");
	}
}
function LoadedOpenSidebar(context){
	LoadedSidebar.call(this, context);
	this.isOpen = function(){
		return true;
	};
	this.log = function(){
		console.log("LoadedOPEN-Sidebar- files already loaded. Just send toggle message to the CS_SIDEBAR");
	}
	this.close = function(tab){
		context.status[tab.id] = new LoadedClosedSidebar(context);
	}
}




function NoLoadedSidebar(context){
	SidebarManagerStatus.call(this, context);

	var status = this;
	this.toggleSidebar = function(tab, callback){
		console.log("instantiating CS_SIDEBAR and sending the open message");
		this.open(tab);
		if(callback) callback(tab);
	};
	this.open = function(tab){

		BackgroundResourcesLoader.syncLoadScripts([
	  		new BackgroundResource("/content_scripts/ContentResourcesLoader.js"),
	  		new BackgroundResource("/content_scripts/sidebar/Sidebar.js")
	  	], tab, function () {
	        context.status[tab.id] = new LoadedOpenSidebar(context);
	        status.sendOpenMessage(tab);
	    });
	};
}