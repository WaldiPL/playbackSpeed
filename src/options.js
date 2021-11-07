"use strict";

(function(){
	document.addEventListener("DOMContentLoaded",restoreOptions);
	document.addEventListener("DOMContentLoaded",restoreShortcuts);
	document.getElementById("optionsForm").addEventListener("change",saveOptions);
	document.getElementById("addRow").addEventListener("click",addRow);
	document.getElementById("addButton").addEventListener("click",addButton);
	document.getElementById("theme").addEventListener("change",e=>{document.getElementById("popupPreview").className=e.target.value;});
	translate();
})();

function saveOptions(){
	let [minRange,maxRange,stepRange,stepButton,stepFast,theme]=[
		num(document.getElementById("minRange").value),
		num(document.getElementById("maxRange").value),
		num(document.getElementById("stepRange").value),
		num(document.getElementById("stepButton").value),
		num(document.getElementById("stepFast").value),
		document.getElementById("theme").value
	];
	if(!minRange)min=0.3;
	if(!maxRange)max=4;
	if(!stepRange)stepRange=0.1;
	if(!stepButton)stepButton=0.25;
	if(!stepFast)stepFast=5;
	if(maxRange<minRange)maxRange=minRange+stepRange;
	if(stepRange>maxRange)stepRange=maxRange-minRange;
	browser.storage.local.set({
		minRange,
		maxRange,
		stepRange,
		stepButton,
		stepFast,
		theme
	});
}

function restoreOptions(){
	let container=document.getElementById("popupPreview");
		container.textContent="";
	let fragment=document.createDocumentFragment();
	browser.storage.local.get().then(db=>{
		document.getElementById("minRange").value=db.minRange;
		document.getElementById("maxRange").value=db.maxRange;
		document.getElementById("stepRange").value=db.stepRange;
		document.getElementById("stepButton").value=db.stepButton;
		document.getElementById("stepFast").value=db.stepFast;
		document.getElementById("theme").value=db.theme;
		document.getElementById("popupPreview").className=db.theme;
		
		db.popup.forEach(row=>{
			let rowElm=document.createElement("div");
				rowElm.className="flexrow";
			let del=document.createElement("input");
				del.type="button";
				del.className="delete";
				del.value='\uf808';
				del.title=i18n("deleteRow");
				del.addEventListener("click",deleteRow);
			rowElm.appendChild(del);
			row.forEach(e=>{
				let item;
				switch(e){
					case "plus":
						item=document.createElement("button");
						item.id=e;
						item.textContent="+";
						item.title=i18n("increaseSpeed");
						break;
					case "minus":
						item=document.createElement("button");
						item.id=e;
						item.textContent="-";
						item.title=i18n("decreaseSpeed");
						break;
					case "open":
						item=document.createElement("button");
						item.id=e;
						item.textContent=browser.i18n.getMessage("newTab");
						break;
					case "range":
						item=document.createElement("input");
						item.type="range";
						item.id=e;
						item.value=25;
						break;
					case "current":
						item=document.createElement("span");
						item.id=e;
						item.textContent=1;
						item.title=i18n("currentSpeed");
						break;
					case "customize":
						item=document.createElement("button");
						item.id=e;
						item.textContent='\uf807';
						item.title=i18n("customize");
						break;
					case "playpause":
						item=document.createElement("button");
						item.id=e;
						item.textContent='\uf800';
						item.title=i18n(e);
						break;
					case "rewind":
						item=document.createElement("button");
						item.id=e;
						item.textContent='\uf802';
						item.title=i18n(e);
						break;
					case "fastforward":
						item=document.createElement("button");
						item.id=e;
						item.textContent='\uf803';
						item.title=i18n(e);
						break;
					case "loop":
						item=document.createElement("button");
						item.id=e;
						item.textContent='\uf806';
						item.title=i18n(e);
						break;
					case "mute":
						item=document.createElement("button");
						item.id=e;
						item.textContent='\uf804';
						item.title=i18n(e);
						break;
					default:
						item=document.createElement("button");
						item.textContent=e;
				}
				rowElm.appendChild(item);
			});
			fragment.appendChild(rowElm);
		});
		container.appendChild(fragment);
		
		$(function(){
			$("#popupPreview").sortable({
			  axis:"y",
			  containment:"#popupPreview",
			  tolerance:"pointer",
			  cursorAt:{top:16},
			  cursor:"row-resize",
			  update:savePopup
			});
			$(".flexrow,#palette").sortable({
			  connectWith:".flexrow,#palette",
			  items:"button,input[type='range'],span",
			  cancel:"",
			  tolerance:"pointer",
			  containment:"#customization",
			  cursorAt:{top:16,left:0},
			  cursor:"move",
			  opacity:.75,
			  update:savePopup
			});
		});

		browser.theme.getCurrent().then(theme=>{
			let autoStyle=document.createElement("style");
			let popup_border=theme.colors.popup_border||"#d0d1d1";
			autoStyle.textContent=`
			.auto{
				--background-color:${theme.colors.popup};
				--text-color:${theme.colors.popup_text};
				--popup-border:${popup_border};
			}`;
			document.body.appendChild(autoStyle);
		});
	}).then(()=>{
		let itemsId=["plus","minus","open","range","current","playpause","customize","rewind","fastforward","loop","mute"];
		itemsId.forEach(id=>{
			if(!document.getElementById(id))restoreItem(id);
		});
		document.body.removeAttribute("class");
	});
}

function num(e){
	return Math.round(e*100)/100;
}

function addRow(){
	let rowElm=document.createElement("div");
		rowElm.className="flexrow";
	let del=document.createElement("input");
		del.type="button";
		del.value='\uf808';
		del.title=i18n("deleteRow");
		del.className="delete";
		del.addEventListener("click",deleteRow);
		rowElm.appendChild(del);
	let container=document.getElementById("popupPreview");
		container.appendChild(rowElm);

	$(function(){
		$(rowElm).sortable({
		  connectWith:".flexrow,#palette",
		  items:"button,input[type='range'],span",
		  cancel:"",
		  tolerance: "pointer",
		  containment: "#customization",
		  cursorAt:{top:16, left:0},
		  cursor:"move",
		  opacity:.75,
		  update: savePopup
		});
	});
	savePopup();
}

function deleteRow(e){
	let items=e.target.parentElement.children;
	if(items.plus){restoreItem("plus");}
	if(items.minus){restoreItem("minus");}
	if(items.open){restoreItem("open");}
	if(items.range){restoreItem("range");}
	if(items.current){restoreItem("current");}
	if(items.playpause){restoreItem("playpause");}
	if(items.customize){restoreItem("customize");}
	if(items.rewind){restoreItem("rewind");}
	if(items.fastforward){restoreItem("fastforward");}
	if(items.loop){restoreItem("loop");}
	if(items.mute){restoreItem("mute");}
	e.target.parentElement.remove();
	savePopup();
}

function addButton(){
	let buttonValue=document.getElementById("buttonValue").value;
	if(!buttonValue)return;
	let button=document.createElement("button");
		button.textContent=buttonValue;
	let palette=document.getElementById("palette");
		palette.appendChild(button);
}

function restoreItem(id){
	let palette=document.getElementById("palette");
	let item;
	switch(id){
		case "plus":
			item=document.createElement("button");
			item.id=id;
			item.textContent="+";
			item.title=i18n("increaseSpeed");
			break;
		case "minus":
			item=document.createElement("button");
			item.id=id;
			item.textContent="-";
			item.title=i18n("decreaseSpeed");
			break;
		case "open":
			item=document.createElement("button");
			item.id=id;
			item.textContent=i18n("newTab");
			break;
		case "range":
			item=document.createElement("input");
			item.type="range";
			item.id=id;
			item.value=25;
			break;
		case "current":
			item=document.createElement("span");
			item.id=id;
			item.textContent="1";
			item.title=i18n("currentSpeed");
			break;
		case "customize":
			item=document.createElement("button");
			item.id=id;
			item.textContent='\uf807';
			item.title=i18n("customize");
			break;
		case "playpause":
			item=document.createElement("button");
			item.id=id;
			item.textContent='\uf800';
			item.title=i18n("playpause");
			break;
		case "rewind":
			item=document.createElement("button");
			item.id=id;
			item.textContent='\uf802';
			item.title=i18n("rewind");
			break;
		case "fastforward":
			item=document.createElement("button");
			item.id=id;
			item.textContent='\uf803';
			item.title=i18n("fastforward");
			break;
		case "loop":
			item=document.createElement("button");
			item.id=id;
			item.textContent='\uf806';
			item.title=i18n("loop");
			break;
		case "mute":
			item=document.createElement("button");
			item.id=id;
			item.textContent='\uf804';
			item.title=i18n("mute");
			break;
		default:
			item=document.createElement("button");
			item.id=id;
			item.title=i18n(id);
	}
	palette.appendChild(item);	
}

function savePopup(){
	let popup=document.getElementById("popupPreview");
	let raw=[];
	[...popup.children].forEach((row,i)=>{
		[...row.children].forEach((elm,j)=>{
			if(j===0){
				raw[i]=[];
			}else{
				let item=elm.id||elm.textContent;
				raw[i].push(item);
			}
		});
	});

	browser.storage.local.set({
		popup:raw
	});
}

function restoreShortcuts(){
	let container=document.getElementById("shortcutsContainer");
	browser.commands.getAll().then(commands=>{
		commands.forEach(command=>{
			let label=document.createElement("label");
				label.textContent=command.description;
			let input=document.createElement("input");
				input.type="text";
				input.disabled=true;
				input.value=command.shortcut;
				input.placeholder=i18n("noShortcut");
			let reset=document.createElement("button");
				if(command.shortcut){
					reset.className="delete";
					reset.textContent='\uf808';
					reset.title=i18n("deleteShortcut");
					reset.addEventListener("click",()=>{
						browser.runtime.getBrowserInfo().then(e=>{
							const version=parseInt(e.version);
							if(version>=74){
								browser.commands.update({name:command.name,shortcut:""});
							}else{
								browser.commands.reset(command.name);
							}
						})
						input.value="";
						reset.className="hidden";
					});
				}else{
					reset.className="hidden";
				}
			container.append(label,input,reset);
		});
	});
}

function translate(){
	document.getElementById("title").textContent=i18n("options");
	document.getElementById("main").textContent=i18n("main");
	document.getElementById("stepButtonLabel").textContent=i18n("stepButtons");
	document.getElementById("stepFastLabel").textContent=i18n("stepFast");
	document.getElementById("labelTheme").textContent=i18n("theme");
	let themeSelect=document.getElementById("theme").options;
		themeSelect[0].text=i18n("light");
		themeSelect[1].text=i18n("dark");
		themeSelect[2].text=i18n("autoTheme");
	document.getElementById("sliderTitle").textContent=i18n("slider");
	document.getElementById("minRangeLabel").textContent=i18n("minSpeed");
	document.getElementById("maxRangeLabel").textContent=i18n("maxSpeed");
	document.getElementById("stepRangeLabel").textContent=i18n("stepSlider");
	document.getElementById("header").textContent=i18n("customizeTitle");
	document.getElementById("addRow").textContent=i18n("addRow");
	document.getElementById("addButton").textContent=i18n("addButton");
	document.getElementById("shortcuts").textContent=i18n("shortcuts");
	document.getElementById("howShortcut").textContent=i18n("howShortcut");
}

function i18n(e,s1){
	return browser.i18n.getMessage(e,s1);
}
