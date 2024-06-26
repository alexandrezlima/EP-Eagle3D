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
        console.log("cmd é " + command);
        
        if (command === 'url') {
            console.log("Entrou em URL!");
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
                    console.log('Queries called!');
                    viewMode();
                    autoRecord();
                    getSegment();
                    break;
                default:
                    handleOpenLink(data.value);
            }
        } else if (command === 'progress') {
            updateProgressBarPercentage(data.value);
        } else if (command === 'removeloading') {
            removeLoadingScreen();
            console.log("REMOVE LOADING SCREEN CALLED!");
            handleSendCommands('loadingremoved', 'loadingremoved');
        } else if (command === 'receivedmessage') {
            console.log('A resposta foi recebida pela unreal engine:' + data)
            console.log('Dos dados recebidos pela unreal, temos [comando:' + data.cmd + ', ' + 'valor: ' + data.value + ']');
        } else if (command === 'clipboard') {
            // Remover o foco do iframe e colocá-lo na janela principal
            var iframe = document.getElementById('iframe_1');
            if (iframe) {
                iframe.blur();
            }
            window.focus();
            getClipboardValue();
            console.log("CLIPBOARD CHAMADO!");
        } else if (command === 'playlistinitialized') {
            console.log("Playlist initialized!");
        
        } else {
            console.log("ENTROU NO ELSE!!!");
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
