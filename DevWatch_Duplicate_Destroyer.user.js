// ==UserScript==
// @name        deviantArt - DevWatch Duplicate Destroyer
// @author		Nuclearo
// @namespace   NuclearGenom
// @description Removes duplicates from your dA inbox
// @include     http://www.deviantart.com/messages/*
// @version     0.94
// @lisence		GPL v2
// @grant		none
// ==/UserScript==

/****
Uses code from Timid Script - http://userscripts.org/users/TimidScript
****/

var deviations = {};
var deteled;
var originURL;
var timeoutLength = 400;

function cleanInbox() {
	deviations = {};
	deviations.length = 0;
	deteled=false;
	$("#DuplicateDeleterButton").addClass("active").off("click");
	originURL = document.URL;
	cleanPage();
}


function cleanPage () {
	try{
		var boxes = $(".mcbox");	//get all the message boxes
		deteled = false;
		//the boxes will always be there, their content might be late, so we check first.
		if (boxes.last().find(".mcb-title a").attr("href")){
			boxes.find(".mcb-title a:not(.seen)").each(function(){
				var id = $(this).attr("href").match(/\d+$/);
				if (id in deviations){
					console.log("duplicate: "+id);
					$(this).offsetParent().find(".mcx").click();
					deteled=true;
				}
				else{
					$(this).addClass("seen");
					deviations[id]=true;
					deviations.length++;
				}
			});

			if (deteled) //If you deleted anything, continue on this page.
				setTimeout(cleanPage,timeoutLength);
			else if(getNextPage()){ //If this page is done, get the nest page.
				deteled=false;
				setTimeout(cleanPage,timeoutLength);
			}
			else { //If there is no next page our work here is done.
				location.assign(originURL);
				$("#DuplicateDeleterButton").removeClass("active").on("click",cleanInbox);
			}
		} else	setTimeout(cleanPage,timeoutLength); //If the content wasn't loaded yet, wait a bit more.
	}catch(error){
		console.log(error);
	}
}

function placeButton (){
	if(document.URL.indexOf("www.deviantart.com/messages/#view=deviations")!==-1){
		if (!$("#DuplicateDeleterButton").length){
			var mczone = $(".mczone-filter");
			if(mczone.length===1){
				var button = $(document.createElement("div"));	//the delete button
				button.attr("id","DuplicateDeleterButton");
				button.addClass("f1");
				button.text("Delete Duplicate Deviations");            
				button.click(cleanInbox);
				var spot = mczone.find("tr");
				var parenTD = document.createElement("td"); //enclosing td for the button
				parenTD.setAttribute("class","f");
				$(parenTD).append(button);
				spot.append(parenTD);
				//create a separator
				// var divl = document.createElement("div");
				// divl.setAttribute("class","dvl");
				// spot.insertBefore(divl,parenTD);
			}
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
	var next = $(".r.page");
	//console.log(next);
	if (next.length > 0)
	{
		next.click();
		return true;
	}
	return false;
}


$(placeButton);
// document.addEventListener("DOMSubtreeModified", placeButton, true);
obs = new window.MutationObserver(placeButton);
obs.observe(document,{subtree:true, childList: true});