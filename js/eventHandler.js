document.addEventListener('DOMContentLoaded', function() {
	//const iframe = document.getElementById('iframe_1');
    //const iframeWindow = iframe.contentWindow;
	var iframe = document.getElementById('iframe_1');
    //iframe.focus();

    iframe.addEventListener('blur', function() {
        console.log("Iframe perdeu o foco (diretamente no iframe)");
        setTimeout(function() {
            iframe.focus();
            console.log("Foco reestabelecido!");
        }, 1000);
    });

    window.getClipboardValue = function()
    {
        /*
        iframe.blur();
        window.focus();

        var clipboardData = navigator.clipboard.readText();
        var pastedText = clipboardData.getData("text/plain");
        console.log('Pasted text: ', pastedText);
        handleSendCommands('paste', pastedText);
        window.blur();
        iframe.focus();
        */
    }

    
    //Handles the paste function event.
    document.addEventListener("paste", function(event) {
        //Get the clipboard contents as plain text
        var clipboardData = event.clipboardData || window.clipboardData;
        var pastedText = clipboardData.getData("text/plain");

        //Sends the pasted text to the pixel streaming application.
        handleSendCommands('paste', pastedText);
    });


	//Eagle3D send commands.
	window.handleSendCommands = function(command, valuestring) {

		let descriptor = {
			[command]: valuestring
		};

		let obj = {
			cmd: "sendToUe4",
			value: descriptor
		};
	
		console.log('Sending message to UE...');
		console.log(JSON.stringify(obj));
		document.getElementById("iframe_1").contentWindow.postMessage(JSON.stringify(obj), "*");
	}

	//Check if the local storage has a url. Useful for protected pages.
	if (localStorage.getItem('url'))
        {
          const newUrl = localStorage.getItem('url');
          history.replaceState(null, null, newUrl);
          localStorage.removeItem('url');
        }
        
        //Useful for progress bar.
        let counter = 0;

        //Removes the loading screen.
        window.removeLoadingScreen = function() {
            const overlay = document.getElementById('overlay');
            const imageContainer = document.getElementById('imageContainer');
            
            if (overlay)
                overlay.remove();

            if (imageContainer)
                imageContainer.remove();

            console.log("Loading screen removed!");
        }


        //Handles the url to open in a new tab.
        window.handleOpenLink = function(url) {
            window.open(url, "_blank");
            console.log(url);
        }
        

        //Returns if there is any segment.
        window.getSegment = function() {
            let name = 'segment';

            const queryString = window.location.search;
            const urlParams = new URLSearchParams(queryString);
            const paramValue = urlParams.get(name);

            let segmentValue = (paramValue !== null) ? paramValue : -1;

            handleSendCommands('segment', segmentValue);            
        }

        //Autorecords the screen after loading the level.
        window.autoRecord = function() {
            let name = 'ar';

            const queryString = window.location.search;
            const urlParams = new URLSearchParams(queryString);
            const paramValue = urlParams.get(name);

            if (paramValue === 'true')
            {
                handleSendCommands('autorecord', paramValue);
            }
            else
            {
                handleSendCommands('autorecord', 'false');
            }
        }

        window.viewMode = function() {
            let name = 'vo';

            const queryString = window.location.search;
            const urlParams = new URLSearchParams(queryString);
            const paramValue = urlParams.get(name);

            if (paramValue === "true")
            {
                handleSendCommands('viewonly', paramValue);
            }
            else
            {
                handleSendCommands('viewonly', 'false');
			}
        }
        
        window.updateProgressBarPercentage = function(percent) {
            const barProgress = document.getElementById('loadingProgressBar');
            if (barProgress) {
            		if (counter === 0) {
                    const loadingBar = document.getElementById('loadingBar');
                    if (loadingBar) {
                        loadingBar.style.display = 'block';
                    }
                    counter++;
                }
            
                barProgress.style.width = percent + '%';
            }
        }

});

/*

window.e3ds.onEvent("clipboard", (data) => {
	console.log("SUCESSO!");
    console.log(data);
});
*/