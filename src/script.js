"use strict";

(function(){
	document.getElementById("noVideo").textContent=browser.i18n.getMessage("noVideo");
	browser.storage.local.get("theme").then(db=>{
		document.documentElement.className=db.theme;
	});
	browser.tabs.executeScript(null,{
		allFrames: true,
		file: "/isvideo.js",
		runAt: "document_end"
	}).then(()=>{},e=>{console.error(e);});
})();

function control(e,step){
	browser.tabs.executeScript(null,{
		allFrames: true,
		code: `control("${e}",${step});`,
		runAt: "document_end"
	});
}

browser.runtime.onMessage.addListener(mes);
function mes(m){
	if(m.isVideo){
		generatePopup(Math.round(m.rate*100)/100);
		browser.tabs.executeScript(null,{
			allFrames: true,
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
						item.addEventListener("click",()=>{control("plus",db.stepButton);});
						break;
					case "minus":
						item=document.createElement("button");
						item.id=e;
						item.textContent="-";
						item.title=i18n("decreaseSpeed");
						item.addEventListener("click",()=>{control("minus",db.stepButton);});
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
						item.addEventListener("change",e=>{control(e.target.value);});
						break;
					case "current":
						item=document.createElement("span");
						item.id=e;
						item.textContent=rate;
						item.title=i18n("currentSpeed");
						break;
					case "playpause":
						item=document.createElement("button");
						item.id=e;
						item.title=i18n("playPause");
						item.addEventListener("click",()=>{control("playpause");});
						break;
					case "customize":
						item=document.createElement("button");
						item.id=e;
						item.textContent=i18n("customize");
						item.addEventListener("click",()=>{browser.runtime.openOptionsPage();});
						break;
					default:
						item=document.createElement("button");
						item.textContent=e;
						item.addEventListener("click",()=>{control(e);});
						break;
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
