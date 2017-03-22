browser.runtime.onMessage.addListener(mes);
function mes(m){
	if(m.control)control(m.control);
	browser.runtime.onMessage.removeListener(mes);
}

function control(e) {
	let videos=document.getElementsByTagName("video");
	if(!videos[0])return;
	let rate=videos[0].playbackRate;
	let len=videos.length;
	if(e==="open"){
		for(let i=0;i<len;i++){
			browser.runtime.sendMessage({"openTab":true,"url":videos[i].currentSrc}); 
		}
	}else{
		let speed=parseInt(e);
		for(let i=0;i<len;i++){
			videos[i].playbackRate = speed/100;		
		}
	}
}