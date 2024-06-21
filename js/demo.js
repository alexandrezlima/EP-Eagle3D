const messageHandler = (event) => {
	
	if(!event.data.type) return;


	console.log("received data event type " + event.data.type)
	switch (event.data.type) {
		case "ResponseFromUE4":
			console.log("UE4->iframe: " + event.data.descriptor);
			myHandleResponseFunction(event.data.descriptor);
			break;
		case "stage1_inqueued":
			updateLoadingText(`Connecting to your playground`);			
			break;
		case "stage2_deQueued":
			//loading screen 1 hides
			removeLoadingText();
			startProgressText();
			break;
		case "stage3_slotOccupied":
			break;
		case "stage4_playBtnShowedUp":
			let playButton = document.getElementById("playButtonParent");
			playButton.click();
			onPlayBtnPressed();
			break;
		case "stage5_playBtnPressed":
			removeLoadingText();
			
			setTimeout(function() {
				handleSendCommands('eagleloaded', 'true');
				$('#iframe_1').focus();
			}, 1000);
			break;
		case "_focus":
			document.getElementById("iframe_1").focus();
			break;
		case "isIframe":
			let obj = {
				cmd: 'isIframe',
				value: true
			};
			sendToIframe(obj);
			break;
			
		case "QueueNumberUpdated":
			console.log("QueueNumberUpdated. New queuePosition: " +  event.data.queuePosition);
			break;
			
		case "stage3_1_AppAcquiringProgress":
			console.log("stage3_1_AppAcquiringProgress percent: " + JSON.stringify( event.data.percent));
			break;
			
		case "stage3_2_AppPreparationProgress":
			console.log("stage3_2_AppPreparationProgress percent:" + JSON.stringify( event.data.percent));
			break;	
		case "shortCuts":
			console.log("Key pressed");
			break;
		default:
			//console.error("Unhandled message data type");
			console.log(event.data.percent);
			break;
	}
}

window.addEventListener('message', messageHandler);

window.addEventListener('message', (message) => {
	if (message.data.type === '_focus') {
		document.getElementById("iframe_1").focus();
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


window.updateLoadingText = function (newText) {
	const loadingText = document.getElementById('loadingText');
	if (loadingText) {
		loadingText.childNodes[0].textContent = newText;
	}
}

function startProgressText() {
	const duration = 10000; // 20 seconds
	const interval = 100; // Update every 200 ms
	const steps = duration / interval; // Total number of steps
	let currentStep = 0;

	const intervalId = setInterval(() => {
		const progress = Math.min(100, Math.round((currentStep / steps) * 100));
		updateProgressBarPercentage(progress);
		currentStep++;

		if (currentStep > steps) {
			clearInterval(intervalId);
		}
	}, interval);
}