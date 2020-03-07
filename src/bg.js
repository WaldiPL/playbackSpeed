"use strict";

browser.runtime.onInstalled.addListener(handleInstalled);
function handleInstalled(details){
	if(details.reason==="install"||details.reason==="update"){
		browser.storage.local.get().then(db=>{
			if(db.theme===undefined){
				browser.storage.local.set({
					theme:"light",
					minRange:0.3,
					maxRange:4,
					stepRange:0.1,
					stepButton:0.25,
					popup:[["range","current"],["minus","plus"],[1,1.25,1.5,1.75,2],["playpause","open"],["customize"]]
				}).then(()=>{
					browser.runtime.openOptionsPage();
				});
			}else{
				browser.runtime.openOptionsPage();
			}
		});
	}
}

browser.commands.onCommand.addListener(command=>{
	switch(command){
		case "rateDefault":
			control(1);
			break;
		default:
			control(command);
	}
});

function control(e){
	browser.tabs.executeScript(null,{
		allFrames: true,
		matchAboutBlank: true,
		file: "/insert.js",
		runAt: "document_end"
	}).then(()=>{
		browser.storage.local.get(["stepButton","stepFast"]).then(db=>{
			let step=(e==="rewind"||e==="fastforward")?db.stepFast:db.stepButton;
			browser.tabs.executeScript(null,{
				allFrames: true,
				matchAboutBlank: true,
				code: `control("${e}",${step});`,
				runAt: "document_end"
			});
		});
	});
}

browser.runtime.onMessage.addListener(mes);
function mes(m,s){
	if(m.rate){
		browser.browserAction.setBadgeText({text:m.rate+"",tabId:s.tab.id});
	}
}
