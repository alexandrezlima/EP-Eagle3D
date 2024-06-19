const messageHandler = (event) => {
	
	if(!event.data.type) return;
	const loaderStep1 = document.getElementById("loaderStep1");
	const loaderStep2 = document.getElementById("loaderStep2");
	const loaderStep3 = document.getElementById("loaderStep3");
	const iframeElem = document.getElementById("iframe_1");
	const sidebar = document.getElementById("sidebar");


	console.log("received data event type " + event.data.type)
	switch (event.data.type) {
		case "ResponseFromUE4":
			console.log("UE4->iframe: " + event.data.descriptor)
			myHandleResponseFunction(event.data.descriptor);
			break;
		case "stage1_inqueued":
			break;
		case "stage2_deQueued":
			//loading screen 1 hides
			break;
		case "stage3_slotOccupied":
			break;
		case "stage4_playBtnShowedUp":
			let playButton = document.getElementById("playButtonParent");
			playButton.click();
			onPlayBtnPressed();
			break;
		case "stage5_playBtnPressed":
			$('#iframe_1').focus();
			setTimeout(function() {
				handleSendCommands('eagleloaded', 'true');
				// removeLoadingScreen();
			}, 1000);
			break;
		case "_focus":
			//document.getElementById("iframe_1").focus();
			break;
		case "isIframe":
			let obj = {
				cmd: 'isIframe',
				value: true
			};
			sendToIframe(obj);
			break;
			
		case "QueueNumberUpdated":
			console.log("QueueNumberUpdated. New queuePosition: " +  event.data.queuePosition)
			break;
			
		case "stage3_1_AppAcquiringProgress":
			console.log("stage3_1_AppAcquiringProgress percent: " + JSON.stringify( event.data.percent))
			break;
			
		case "stage3_2_AppPreparationProgress":
			console.log("stage3_2_AppPreparationProgress percent:" + JSON.stringify( event.data.percent))
			break;	
		case "shortCuts":
			console.log("Key pressed");
			break;
		default:
			//console.error("Unhandled message data type");
			break;
	}
}

window.addEventListener('message', messageHandler);

window.addEventListener('message', (message) => {
	if (message.data.type === '_focus') {
		//document.getElementById("iframe_1").focus();
	}
})

function onPlayBtnPressed() {
	let eleBanner = document.getElementById("iframe_1")
	eleBanner.style.visibility = "visible";
}

function sendToIframe(obj) {
	let origin = "*"
	let myIframe = document.getElementById("iframe_1");
	myIframe.contentWindow.postMessage(JSON.stringify(obj), origin);
}

function sentMessage(message) {
	let obj ={
			cmd: "sendToUe4",
			value: message,
	};
	sendToIframe(obj);
}
