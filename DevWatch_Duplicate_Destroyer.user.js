// ==UserScript==
// @name        deviantArt - DevWatch Duplicate Destroyer
// @namespace   nucleargenom.com
// @description Removes duplicates from your dA inbox
// @include     http://www.deviantart.com/messages/#view=deviations*
// @include     http://www.deviantart.com/messages/#view=deviations%*
// @version     1
// @grant		none
// ==/UserScript==

var gmi = document.getElementById("gmi-ResourceStream");
var deviations = {};
var boxNumber;
var waitIntervalID;
var origin;

function cleanInbox() {
	deviations = {};
	origin = document.URL;
	cleanPage();
}

function cleanPage () {
	try{
		var boxes = gmi.getElementsByClassName("mcbox ch mcbox-thumb mcbox-thumb-deviation"); 
		if (boxes[boxes.length-1].getElementsByClassName("tt-a")[0]&&boxes[boxes.length-1].getElementsByClassName("tt-a")[0].getAttribute){
			clearInterval(waitIntervalID);
			while (boxNumber < boxes.length){
				var id = boxes[boxNumber].getElementsByClassName("tt-a")[0].getAttribute("collect_rid").match(/:(\d+)/)[1];
				if (id in deviations){
					clickOn(boxes[boxNumber].getElementsByClassName("mcx")[0]);
					waitIntervalID = setInterval(cleanPage,500);
					return;
				}
				else{
					deviations[id]=true;
					boxNumber++;
				}
			}
			if(getNextPage()){
				boxNumber = 0;
				waitIntervalID = setInterval(cleanPage,500);
			}
			else
				location.assign(origin);
		}
	}catch(error){
		console.log("Type error caught, aborting.");
		console.log(error);
		clearInterval(waitIntervalID);
	}
}

function getMessagePage (pageNum){
	var messages = new Array();

}

function placeButton (){
	if(document.URL.indexOf("http://www.deviantart.com/messages/#view=deviations")===0)
	{
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
	else if (document.getElementById("DuplicateDeleterButton"))
		document.getElementById("DuplicateDeleterButton").parentElement.removeChild(document.getElementById("DuplicateDeleterButton"));

}

function getNextPage()
{
	var next = document.getElementsByClassName("r page");
	//console.log(next);
	if (next.length > 0)
	{
		next = next[0];
		console.log(next.href);
		clickOn(next);
		return true;
	}
	return false;
}

function clickOn (element){
	var evt = document.createEvent("MouseEvents");
	evt.initEvent("click", true, true);
	element.dispatchEvent(evt);
}

placeButton();
document.addEventListener("DOMSubtreeModified", placeButton, true);