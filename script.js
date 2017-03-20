(function(){
	document.getElementById("newTab").innerHTML=browser.i18n.getMessage("newTab");
	document.getElementById("noVideo").innerHTML=browser.i18n.getMessage("noVideo");
	document.getElementById("speed1").addEventListener("click",()=>{control(100);});
	document.getElementById("speed2").addEventListener("click",()=>{control(200);});
	document.getElementById("newTab").addEventListener("click",()=>{control("open");});
	document.getElementById("range").addEventListener("change",(e)=>{control(e.target.value,true);});
	browser.tabs.executeScript(null, {
    	file: "/insert.js"
	});
})();

function control(e,r=false){
	browser.tabs.query({active: true, currentWindow: true},tabs=>{
    	browser.tabs.sendMessage(tabs[0].id,{control:e,range:r});
  	});
	if(r){
		let rv=parseInt(document.getElementById("range").value)/100;
		document.getElementById("playback-rate").innerHTML=rv;
	}
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