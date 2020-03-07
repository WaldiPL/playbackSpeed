"use strict";

var eventAdded;
(function(){
	if(!eventAdded){
		let videos=document.getElementsByTagName("video"),
			audios=document.getElementsByTagName("audio"),
			media=[...videos].concat([...audios]);
		if(!media[0])return;
		eventAdded=true;
		[...media].forEach(elm=>{
			elm.addEventListener("ratechange",e=>{
				let rate=Math.round(e.target.playbackRate*100)/100;
				sendMessageRate(rate);
			});
		});
	}
})();

function control(e,step){
	let videos=document.getElementsByTagName("video"),
		audios=document.getElementsByTagName("audio"),
		media=[...videos].concat([...audios]);
	if(!media[0])return;
	let rate=media[0].playbackRate,
		paused=media[0].paused,
		looped=media[0].loop,
		muted=media[0].muted,
		len=media.length;
	switch(e){
		case "open":
			for(let i=0;i<len;i++){
				browser.runtime.sendMessage({"openTab":true,"url":media[i].currentSrc});
			}
			break;
		case "ratePlus":
			let prate=rate+step;
			rate=Math.round(prate*100)/100;
			for(let i=0;i<len;i++){
				media[i].playbackRate=rate;
			}
			sendMessageRate(rate);
			break;
		case "rateMinus":
			let mrate=(rate-step<0)?0:rate-step;
			rate=Math.round(mrate*100)/100;
			for(let i=0;i<len;i++){
				media[i].playbackRate=rate;
			}
			sendMessageRate(rate);
			break;
		case "playpause":
			for(let i=0;i<len;i++){
				paused?media[i].play():media[i].pause();
			}
			break;
		case "rewind":
			for(let i=0;i<len;i++){
				media[i].currentTime=media[i].currentTime-step;
			}
			break;
		case "fastforward":
			for(let i=0;i<len;i++){
				media[i].currentTime=media[i].currentTime+step;
			}
			break;
		case "loop":
			for(let i=0;i<len;i++){
				media[i].loop=!looped;
			}
			break;
		case "mute":
			for(let i=0;i<len;i++){
				media[i].muted=!muted;
			}
			break;
		default:
			for(let i=0;i<len;i++){
				media[i].playbackRate=e;
			}
			rate=Math.round(e*100)/100;
			sendMessageRate(rate);
	}
}

var lastSent;
function sendMessageRate(rate){
	if(lastSent!==rate){
		lastSent=rate;
		browser.runtime.sendMessage({rate});
	}
}
