// ==UserScript==
// @name        deviantArt - DevWatch Duplicate Destroyer
// @author		Nuclearo
// @namespace   NuclearGenom
// @description Removes duplicates from your dA inbox
// @include     http://www.deviantart.com/messages/*
// @version     0.91
// @lisence		GPL v2
// @grant		none
// ==/UserScript==

/****
Uses code from Timid Script - http://userscripts.org/users/TimidScript
****/

var gmi = document.getElementById("gmi-ResourceStream");
var deviations = {};
var boxNumber;
var waitIntervalID;
var originURL;
var buttonClass = "f1";

function cleanInbox(button) {
	deviations = {};
	buttonClass = "f1 active";
	originURL = document.URL;
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
			else{
				location.assign(originURL);
				buttonClass = "f1";
			}
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
	if(document.URL.indexOf("www.deviantart.com/messages/#view=deviations")!==-1){
		if (!document.getElementById("DuplicateDeleterButton")){
			var mczone = document.getElementsByClassName("mczone-filter");
			if(mczone.length===1){
				var button = document.createElement("div");	//the delete button
				button.id = "DuplicateDeleterButton";
				button.setAttribute("class",buttonClass);
				button.textContent = "Delete Duplicate Deviations";            
				button.onclick = cleanInbox;
				var spot = mczone[0].getElementsByTagName("tr")[0];
				var parenTD = document.createElement("td"); //enclosing td for the button
				parenTD.setAttribute("class","f");
				parenTD.appendChild(button);
				spot.insertBefore(parenTD, spot.lastChild.nextSibling);
				//create a separator
				// var divl = document.createElement("div");
				// divl.setAttribute("class","dvl");
				// spot.insertBefore(divl,parenTD);
			}
			gmi = document.getElementById("gmi-ResourceStream");
		}
	}
	else if (document.getElementById("DuplicateDeleterButton")){
		var parenTD=document.getElementById("DuplicateDeleterButton").parentElement;
		parenTD.removeChild(document.getElementById("DuplicateDeleterButton"));
		parenTD.parentElement.removeChild(parenTD);
	}

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

window.onload = placeButton();
document.addEventListener("DOMSubtreeModified", placeButton, true);