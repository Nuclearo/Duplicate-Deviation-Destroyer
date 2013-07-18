// ==UserScript==
// @name        deviantArt - DevWatch Duplicate Destroyer
// @namespace   nucleargenom.com
// @description Removes duplicates from your dA inbox
// @include     http://www.deviantart.com/messages/#view=deviations*
// @version     1
// @grant		none
// ==/UserScript==

var gmi = document.getElementById("gmi-ResourceStream");;

function cleanInbox () {
	var deviations = {};
	var boxes = gmi.getElementsByClassName("mcbox ch mcbox-thumb mcbox-thumb-deviation");
	for (i = 0; i < boxes.length; i++){
		var id=boxes[i].getElementsByClassName("tt-a")[0].getAttribute("collect_rid").match(/:(\d+)/)[1];
		if (id in deviations){
			var evt = document.createEvent("MouseEvents");
			evt.initEvent("click", true, true);
			boxes[i].getElementsByClassName("mcx")[0].dispatchEvent(evt);
			// boxes[i].getElementsByClassName("mcx")[0].getAttribute("onclick"); //onclick();
		}else
			deviations[id]=true;
		
	}
	// var results = null;
	// for(var page = 1;results=getMessagePage(page);++page){
	// 	for message in results {
	// 		deviations.add(parseInt(message.reply_rid)); //TODO: add actual check/delete.
	// 		Alert(JSON.stringify(deviations));
	// 	}
	// }
}

function getMessagePage (pageNum){
	var messages = new Array();

}

function placeButton (){
	if (!document.getElementById("DuplicateDeleterButton"))
        {
            button = document.createElement("button");
            button.id = "DuplicateDeleterButton"
            button.setAttribute("style", "width: 100%; height: 25px;");
            button.textContent = "Delete Duplicate Deviations";            
            button.onclick = cleanInbox;
            gmi = document.getElementById("gmi-ResourceStream");
            gmi.parentNode.insertBefore(button, gmi);
        }
}

placeButton();