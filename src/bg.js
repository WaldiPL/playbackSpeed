"use strict";

browser.runtime.onInstalled.addListener(handleInstalled);
function handleInstalled(details){
	if(details.reason==="install"||details.reason==="update"){
		const defaultDB={
			theme:"light",
			minRange:0.3,
			maxRange:4,
			stepRange:0.1,
			stepButton:0.25,
			stepFast:5,
			popup:[["range","current"],["minus","plus"],[1,1.25,1.5,1.75,2],["playpause","mute","loop"],["open","customize"]],
		};
		browser.storage.local.get().then(result=>{
			const db=Object.assign({},defaultDB,result);
			browser.storage.local.set(db).then(()=>{
				if(!details.temporary)browser.runtime.openOptionsPage();
			},err=>{
				console.error(err);
			});	
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

browser.theme.onUpdated.addListener(updateIcon);
browser.theme.getCurrent().then(theme=>{updateIcon({theme});});
	
function updateIcon(e){
	let iconColor="#5b5b66";
	if(e.theme.colors)iconColor=e.theme.colors.icons||e.theme.colors.toolbar_text||"#5b5b66";
	const svg=`<svg width="32" height="32" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="${iconColor}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m4 4 12 12-12 12z"/><path d="m15 4 12 12-12 12"/></svg>`;
	const blob=new Blob([svg],{type:"image/svg+xml;charset=utf-8"});
	const blobURL=URL.createObjectURL(blob);	
	const image=new Image();
	image.onload=()=>{
		const canvas=document.createElement("canvas");
		canvas.widht=32;
		canvas.height=32;
		const context=canvas.getContext("2d");
		context.drawImage(image,0,0,32,32); 
		const imageData=context.getImageData(0,0,32,32);
		browser.browserAction.setIcon({imageData});
	};
	image.src=blobURL;	
}

browser.runtime.onMessage.addListener(mes);
function mes(m,s){
	if(m.rate){
		browser.browserAction.setBadgeText({text:m.rate+"",tabId:s.tab.id});
	}
}
