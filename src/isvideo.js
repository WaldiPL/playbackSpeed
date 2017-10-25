(function(){
	let videos=document.getElementsByTagName("video");
	if(videos[0])browser.runtime.sendMessage({"isVideo":true,"rate":videos[0].playbackRate});
})();