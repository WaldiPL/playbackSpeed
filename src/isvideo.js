"use strict";

(function(){
	let videos=document.getElementsByTagName("video"),
		audios=document.getElementsByTagName("audio");
	if(videos[0])browser.runtime.sendMessage({"isVideo":true,"rate":videos[0].playbackRate});
	else if(audios[0])browser.runtime.sendMessage({"isVideo":true,"rate":audios[0].playbackRate});
})();
