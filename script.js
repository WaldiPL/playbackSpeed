(function(){
	document.getElementById("newTab").innerHTML=browser.i18n.getMessage("newTab");
	document.getElementById("noVideo").innerHTML=browser.i18n.getMessage("noVideo");
	document.getElementById("speed1").addEventListener("click",()=>{control(100);});
	document.getElementById("speed2").addEventListener("click",()=>{control(200);});
	document.getElementById("newTab").addEventListener("click",()=>{control("open");});
	document.getElementById("range").addEventListener("change",(e)=>{control(e.target.value);});
	browser.tabs.executeScript(null, {
		allFrames: true,
    	file: "/isvideo.js"
	});
})();

function control(e){
	browser.tabs.executeScript(null,{
		allFrames: true,
    	file: "/insert.js"
	});
	if(e!="open")document.getElementById("playback-rate").innerHTML=parseInt(e)/100;
	if(typeof(e)==="number")document.getElementById("range").value=parseInt(e);
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
		document.getElementById("range").value=m.rate*100;
		document.getElementById("playback-rate").innerHTML=m.rate;
	}
	if(m.openTab){
		if(m.url)browser.tabs.create({active:false,url:m.url});
	}
}