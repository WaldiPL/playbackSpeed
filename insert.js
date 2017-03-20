(function(){
	let videos=document.getElementsByTagName("video");
	if(videos)browser.runtime.sendMessage({"isVideo":true,"rate":videos[0].playbackRate}); 
})();

browser.runtime.onMessage.addListener(mes);
function mes(m) {
  if(m.control)control(m.control,m.range);
  browser.runtime.onMessage.removeListener(mes);
}

function control(e,range) {
	let videos=document.getElementsByTagName("video");
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
	if(!range)browser.runtime.sendMessage({"rate":rate}); 
}