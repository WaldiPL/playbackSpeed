"use strict";

(function(){
	document.getElementById("noVideo").firstElementChild.textContent=browser.i18n.getMessage("noVideo");
	const customizeNo=document.createElement("button");
		customizeNo.id="customizeNo";
		customizeNo.title=i18n("customize");
		customizeNo.textContent='\uf807';
		customizeNo.addEventListener("click",()=>{browser.runtime.openOptionsPage();});
	document.getElementById("noVideo").appendChild(customizeNo);

	browser.storage.local.get("theme").then(db=>{
		document.documentElement.className=db.theme;
		if(db.theme==="auto"){
			browser.theme.getCurrent().then(theme=>{
				let autoStyle=document.createElement("style");
				autoStyle.textContent=`
				:root{
					--background-color:${theme.colors.popup};
					--text-color:${theme.colors.popup_text};
				}`;
				document.body.appendChild(autoStyle);
			});
		}
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
			generatePopup(Math.round(m.rate*100)/100,{"playpause":m.paused,"loop":m.loop,"mute":m.muted});
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
		}else{
			document.getElementById("error").textContent=browser.i18n.getMessage("error");
			document.getElementById("error").removeAttribute("hidden");
		}
	}
}

function generatePopup(rate,btnState){
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
						item.title=i18n("customize");
						item.textContent='\uf807';
						item.addEventListener("click",()=>{browser.runtime.openOptionsPage();});
						break;
					case "rewind":
						item=document.createElement("button");
						item.id=e;
						item.title=i18n("rewind")+` (-${db.stepFast} s)`;
						item.textContent='\uf802';
						item.addEventListener("click",()=>{control("rewind",db.stepFast);});
						break;
					case "fastforward":
						item=document.createElement("button");
						item.id=e;
						item.title=i18n("fastforward")+` (+${db.stepFast} s)`;
						item.textContent='\uf803';
						item.addEventListener("click",()=>{control("fastforward",db.stepFast);});
						break;
					case "playpause":
						item=document.createElement("button");
						item.id=e;
						item.title=i18n(e);
						item.textContent='\uf801';
						item.addEventListener("click",()=>{
							control(e);
							if(item.textContent=='\uf801')item.textContent='\uf800';
							else item.textContent='\uf801';
						});
						if(btnState[e]){
							item.textContent='\uf800';
						}
						break;
					case "loop":
						item=document.createElement("button");
						item.id=e;
						item.title=i18n(e);
						item.textContent='\uf806';
						item.addEventListener("click",()=>{control(e);item.classList.toggle("active");});
						if(btnState[e])item.className="active";
						break;
					case "mute":
						item=document.createElement("button");
						item.id=e;
						item.title=i18n(e);
						item.textContent='\uf804';
						item.addEventListener("click",()=>{
							control(e);
							if(item.textContent=='\uf804')item.textContent='\uf805';
							else item.textContent='\uf804';
						});
						if(btnState[e]){
							item.textContent='\uf805';
						}
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
