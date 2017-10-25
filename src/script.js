(function(){
	document.getElementById("newTab").textContent=browser.i18n.getMessage("newTab");
	document.getElementById("noVideo").textContent=browser.i18n.getMessage("noVideo");
	document.getElementById("error").textContent=browser.i18n.getMessage("error");
	document.getElementById("speed1").addEventListener("click",()=>{control(1);});
	document.getElementById("speed15").addEventListener("click",()=>{control(1.5);});
	document.getElementById("speed2").addEventListener("click",()=>{control(2);});
	document.getElementById("newTab").addEventListener("click",()=>{control("open");});
	document.getElementById("range").addEventListener("change",e=>{control(e.target.value);});
	browser.tabs.executeScript(null,{
		allFrames: true,
		file: "/isvideo.js",
		runAt: "document_end"
	}).then(()=>{},e=>{console.log(e);});
})();

function control(e){
	browser.tabs.executeScript(null,{
		allFrames: true,
		file: "/insert.js",
		runAt: "document_end"
	});
	if(e!="open")document.getElementById("playback-rate").textContent=e;
	if(typeof(e)==="number")document.getElementById("range").value=e;
	browser.tabs.query({active: true, currentWindow: true},tabs=>{
		browser.tabs.sendMessage(tabs[0].id,{control:e});
	});
}

browser.runtime.onMessage.addListener(mes);
function mes(m){
	if(m.isVideo){
		document.getElementById("isVideo").removeAttribute("hidden");
		document.getElementById("noVideo").setAttribute("hidden","true");
	}
	if(m.rate){
		document.getElementById("range").value=m.rate;
		document.getElementById("playback-rate").textContent=m.rate;
	}
	if(m.openTab){
		if(m.url)browser.tabs.create({active:false,url:m.url}).then(()=>{},e=>{console.log(e);document.getElementById("error").removeAttribute("hidden");});
	}
}
