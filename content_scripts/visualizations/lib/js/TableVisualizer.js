function TableVisualizer(){
	this.initialize();
}
TableVisualizer.prototype.initialize = function() {
	
	this.showLoadingMessage("Extracting Results...");
	browser.runtime.sendMessage({ "call": "onVisualizationLoaded"}).then(data => {
		this.presentData(data);
		this.hideLoadingMessage();
	});
};
TableVisualizer.prototype.showLoadingMessage = function(msg){
	document.getElementById("loading-message").innerHTML = msg;
}
TableVisualizer.prototype.presentData = function(data){
	
	var table = document.querySelector("#results");
	console.log("presentData: ", data);
	this.initializeDatatable(document, table, data.results);
}
TableVisualizer.prototype.hideLoadingMessage = function(){
	document.getElementById("loading").remove();
}
TableVisualizer.prototype.initializeDatatable = function(doc, table, concepts) {

	//TODO: refactor this method
	/* TODO: guys, we should not have a method inside a method! And you should not use that "if". And you should refactor this long method.
	function format (d) {
	    // `d` is the original data object for the row
	    	if (d.Image){
				return '<table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">'+
			        '<tr>'+
			            "<td> <img src="+d.Image+" alt='Image'</td>"+
			        '</tr>'+
			 '</table>';
	    	} else {
	    	return '<table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">'+
		        '<tr>'+
		            '<td>Stock:</td>'+
		            '<td> Disponible </td>'+
		        '</tr>'+
		        '<tr>'+
		      	   '<td>Editorial:</td>'+
	         	   '<td>'+d.Editorial+'</td>'+
		        '</tr>'+
		    '</table>'}
		}*/
		if (concepts[0] == undefined){
			alert("ERROR: no concepts found");
			return;
		}
		var properties = Object.keys(concepts[0]);

		doc.defaultView["$"](doc).ready(function(){
		var tableC =doc.defaultView["$"](table).DataTable({
	        "paging": false,
	        "bFilter": false,
	        "ordering": true,
	        "searching": false,
	        "data": concepts,
	        "columns": [
	            {
	                "className":      'details-control',
	                "orderable":      false,
	                "data":           null,
	                "defaultContent": ' '
	            },

	            //Add this from concept
	            { "title":properties[0], "data": properties[0]},
	            { "title":properties[1], "data": properties[1],  "defaultContent": "<i>Not set</i>"}
	        ],
	        "order": [[1, 'asc']]
		});



		var tbody = doc.querySelector("#results > tbody");
		doc.defaultView["$"](tbody).on('click', 'td.details-control', function () {
			var tr = doc.defaultView["$"](this).closest('tr');
	      	var row = tableC.row( tr );
	        if (row.child.isShown()) {
	            // This row is already open - close it
	            row.child.hide();
	            tr.removeClass('shown');
	        }
	        else {
	            // Open this row
	            //row.child( format(row.data()) ).show();
	            tr.addClass('shown');
	        }
		});
	});

}

var tableVis = new TableVisualizer();
browser.runtime.onMessage.addListener(function callTableVisActions(request, sender) {

	if(tableVis[request.call]){
		//console.log("calling " + request.call + " at TableVisualizer");
		//Se lo llama con: browser.tabs.sendMessage
		tableVis[request.call](request.args);
	}
});