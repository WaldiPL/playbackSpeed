browser.commands.onCommand.addListener(command=>{
	if(command==="ratePlus"){
		control("plus");
	}if(command==="rateMinus"){
		control("minus");
	}if(command==="rateDefault"){
		control(1);
	}
});

function control(e){
	browser.tabs.executeScript(null,{
		allFrames: true,
		file: "/insert.js",
		runAt: "document_end"
	});
	browser.tabs.query({active: true, currentWindow: true},tabs=>{
		browser.tabs.sendMessage(tabs[0].id,{control:e});
	});
}
