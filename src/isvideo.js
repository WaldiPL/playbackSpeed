"use strict";

(function(){
	let videos=document.getElementsByTagName("video"),
		audios=document.getElementsByTagName("audio"),
		media=[...videos].concat([...audios]);
	if(media[0]){
		browser.runtime.sendMessage({
			"isVideo":true,
			"rate":media[0].playbackRate,
			"paused":media[0].paused,
			"loop":media[0].loop,
			"muted":media[0].muted,
		});
		return media.length;
	}
})();
