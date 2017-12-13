browser.runtime.onMessage.addListener(mes);
function mes(m){
	if(m.control)control(m.control);
	browser.runtime.onMessage.removeListener(mes);
}

function control(e) {
	let videos=document.getElementsByTagName("video"),
		audios=document.getElementsByTagName("audio");
	if(!videos[0]&&!audios[0])return;
	let rate=videos[0]?videos[0].playbackRate:audios[0].playbackRate,
		lenV=videos.length,
		lenA=audios.length;
	switch(e){
		case "open":
			for(let i=0;i<lenV;i++){
				browser.runtime.sendMessage({"openTab":true,"url":videos[i].currentSrc});
			}
			for(let i=0;i<lenA;i++){
				browser.runtime.sendMessage({"openTab":true,"url":audios[i].currentSrc});
			}
			break;
		case "plus":
			let prate=(rate>3.75)?4:rate+0.25;
			for(let i=0;i<lenV;i++){
				videos[i].playbackRate=prate;
			}
			for(let i=0;i<lenA;i++){
				audios[i].playbackRate=prate;
			}
			browser.runtime.sendMessage({"rate":prate});
			break;
		case "minus":
			let mrate=(rate<0.5)?0.25:rate-0.25;
			for(let i=0;i<lenV;i++){
				videos[i].playbackRate=mrate;
			}
			for(let i=0;i<lenA;i++){
				audios[i].playbackRate=mrate;
			}
			browser.runtime.sendMessage({"rate":mrate});
			break;
		default:
			for(let i=0;i<lenV;i++){
				videos[i].playbackRate=e;
			}
			for(let i=0;i<lenA;i++){
				audios[i].playbackRate=e;
			}
			browser.runtime.sendMessage({"rate":e});
	}
}
