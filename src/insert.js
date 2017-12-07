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
	switch(e){
		case "open":
			for(let i=0;i<len;i++){
				browser.runtime.sendMessage({"openTab":true,"url":videos[i].currentSrc});
			}
			break;
		case "plus":
			let prate=(rate>3.75)?4:rate+0.25;
			for(let i=0;i<len;i++){
				videos[i].playbackRate=prate;
			}
			browser.runtime.sendMessage({"rate":prate});
			break;
		case "minus":
			let mrate=(rate<0.5)?0.25:rate-0.25;
			for(let i=0;i<len;i++){
				videos[i].playbackRate=mrate;
			}
			browser.runtime.sendMessage({"rate":mrate});
			break;
		default:
			for(let i=0;i<len;i++){
				videos[i].playbackRate=e;
			}
			browser.runtime.sendMessage({"rate":e});
	}
}
