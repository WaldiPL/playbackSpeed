"use strict";

(function(){
	document.getElementById("noVideo").textContent=browser.i18n.getMessage("noVideo");
	browser.storage.local.get("theme").then(db=>{
		document.documentElement.className=db.theme;
	});
	browser.tabs.executeScript(null,{
		allFrames: true,
		matchAboutBlank: true,
		file: "/isvideo.js",
		runAt: "document_end"
	}).then(()=>{},e=>{console.error(e);});
})();

function control(e,step){
	browser.tabs.executeScript(null,{
		allFrames: true,
		matchAboutBlank: true,
		code: `control("${e}",${step});`,
		runAt: "document_end"
	});
}

let generated=false;

browser.runtime.onMessage.addListener(mes);
function mes(m,s){
	if(m.isVideo){
		if(!generated){
			generated=true;
			generatePopup(Math.round(m.rate*100)/100);
		}
		browser.tabs.executeScript(null,{
			frameId:s.frameId,
			matchAboutBlank: true,
			file: "/insert.js",
			runAt: "document_end"
		});
	}
	if(m.rate){
		let [elmRange,elmCurrent]=[document.getElementById("range"),document.getElementById("current")];
		if(elmRange)elmRange.value=m.rate;
		if(elmCurrent)elmCurrent.textContent=m.rate;
	}
	if(m.openTab){
		if(m.url){
			browser.tabs.create({active:false,url:m.url}).then(()=>{
			},e=>{
				document.getElementById("error").textContent=browser.i18n.getMessage("error");
				document.getElementById("error").removeAttribute("hidden");
			});
		}
	}
}

function generatePopup(rate){
	let container=document.getElementById("isVideo");
		container.textContent="";
	let fragment=document.createDocumentFragment();
	browser.storage.local.get().then(db=>{
		let items=false;
		db.popup.forEach((row,i)=>{
			let rowElm=document.createElement("div");
				rowElm.className="flexrow";
			row.forEach(e=>{
				let item;
				switch(e){
					case "plus":
						item=document.createElement("button");
						item.id=e;
						item.textContent="+";
						item.title=i18n("increaseSpeed");
						item.addEventListener("click",()=>{control("ratePlus",db.stepButton);});
						break;
					case "minus":
						item=document.createElement("button");
						item.id=e;
						item.textContent="-";
						item.title=i18n("decreaseSpeed");
						item.addEventListener("click",()=>{control("rateMinus",db.stepButton);});
						break;
					case "open":
						item=document.createElement("button");
						item.id=e;
						item.textContent=i18n("newTab");
						item.addEventListener("click",()=>{control("open");});
						break;
					case "range":
						item=document.createElement("input");
						item.type="range";
						item.id=e;
						item.min=db.minRange;
						item.max=db.maxRange;
						item.step=db.stepRange;
						item.value=rate;
						item.addEventListener("input",e=>{control(e.target.value);});
						item.addEventListener("mouseover",e=>{e.target.focus();});
						break;
					case "current":
						item=document.createElement("span");
						item.id=e;
						item.textContent=rate;
						item.title=i18n("currentSpeed");
						break;
					case "customize":
						item=document.createElement("button");
						item.id=e;
						item.textContent=i18n("customize");
						item.addEventListener("click",()=>{browser.runtime.openOptionsPage();});
						break;
					case "rewind":
						item=document.createElement("button");
						item.id=e;
						item.title=i18n("rewind")+` (-${db.stepFast} s)`;
						item.addEventListener("click",()=>{control("rewind",db.stepFast);});
						break;
					case "fastforward":
						item=document.createElement("button");
						item.id=e;
						item.title=i18n("fastforward")+` (+${db.stepFast} s)`;;
						item.addEventListener("click",()=>{control("fastforward",db.stepFast);});
						break;
					case "playpause":
					case "loop":
					case "mute":
						item=document.createElement("button");
						item.id=e;
						item.title=i18n(e);
						item.addEventListener("click",()=>{control(e);});
						break;
					default:
						item=document.createElement("button");
						item.textContent=e;
						item.addEventListener("click",()=>{control(e);});
				}
				rowElm.appendChild(item);
				items=true;
			});
			fragment.appendChild(rowElm); 
		});
		if(items){
			container.appendChild(fragment);
		}else{
			let item=document.createElement("button");
				item.id="customize";
				item.textContent=i18n("customize");
				item.addEventListener("click",()=>{browser.runtime.openOptionsPage();});
			container.textContent="";
			container.appendChild(item);
		}
	});
	document.getElementById("isVideo").removeAttribute("hidden");
	document.getElementById("noVideo").setAttribute("hidden","true");
}

function i18n(e,s1){
	return browser.i18n.getMessage(e,s1);
}
