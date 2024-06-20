window.e3ds = {
	// list of event listeners
	events: {},
	onEvent(eventName, callback) {
		this.events[eventName] = callback;
	}
};

window.HandleResponseFromUE4 = function(event)//process whatever u want to do with your message
{	
	try {
        const data = JSON.parse(event.data);
        console.log("Parsed data:", data);
        let command = String(data.cmd);
        console.log("Command is: " + command);
        
        if (command === 'url') {
            switch (data.value) {
                case 'getlevel':
                    console.log("GET LEVEL CALLED!");
                    handleSendCommands('loadlevel', parent.levelname);
                    break;
                case 'checklevel':
                    console.log("CHECK LEVEL CALLED!");
                    handleSendCommands('checklevel', parent.levelname);
                    break;
                case 'queries':
                    console.log('QUERIES CALLED!');
                    viewMode();
                    autoRecord();
                    getSegment();
                    break;
                case 'unmutesound':
                    //nothing
                    break;
                default:
                    handleOpenLink(data.value);
            }
        } else if (command === 'progress') {
            //removeLoadingText();
            updateProgressBarPercentage(data.value);

        } else if (command === 'removeloading') {
            removeLoadingScreen();
            console.log("REMOVE LOADING SCREEN CALLED!");
            handleSendCommands('loadingremoved', 'loadingremoved');

        } else if (command === 'receivedmessage') {
            //console.log('A resposta foi recebida pela unreal engine:' + data)
            //console.log('Dos dados recebidos pela unreal, temos [comando:' + data.cmd + ', ' + 'valor: ' + data.value + ']');
        } else if (command === 'clipboard') {
            var iframe = document.getElementById('iframe_1');
            if (iframe) {
                iframe.blur();
            }

            window.focus();
            getClipboardValue();
            console.log("BOARDCLIP CALLED!");

        } else if (command === 'playlistinitialized') {
            console.log("Playlist initialized!");
        
        } else if (command === 'checkpreset') {
            if (parent.preseturl != "") {
                handleSendCommands("downloadpreset", parent.preseturl);
            }        
        } else if (command === 'share') {
            let text = data.value;
            const urlwithoutqueries = window.location.origin + window.location.pathname;
            
            const textarea = document.createElement("textarea");
            textarea.value = urlwithoutqueries + text;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand("copy");
            document.body.removeChild(textarea);

            console.log("copied to clipboard");

            handleSendCommands('share', 'done');
            
        } else {
            console.log("");
        }


    } catch (error) {
        //console.error("Error parsing JSON data:", error);
        //console.error("Received data:", event.data);
    }

	
}


//eagle3dstreaming's Server   to Iframe communication
const eventHandler = (event) => {
	
	//console.log("ApplicationResponse", event);

	if (typeof event.data === 'string' || event.data instanceof String) {
		HandleResponseFromUE4(event);
	}
}

window.addEventListener("message", eventHandler);
