window.onload = function () {
    console.log("window loaded.");
    animateDots();
    connect();
};

//Eagle3D send commands.
window.handleSendCommands = function(command, valuestring) {

    let descriptor = {
        [command]: valuestring
    };

    let obj = {
        cmd: "sendToUe4",
        value: descriptor
    };

    console.log(JSON.stringify(obj));
    window.postMessage(JSON.stringify(obj), "*");

    console.log("Sending command [" + JSON.stringify(obj) + "] to Playground...");
}




// Definindo as funções no escopo global
e3ds_controller.callbacks.onResponseFromUnreal = function(descriptor) {
    console.log("ob-onResponseFromUnreal");
    console.log("UnrealResponse: " + descriptor);

    try {
        const data = JSON.parse(descriptor);
        console.log("Parsed data:", data);

        let command = String(data.cmd);
        let value = String(data.value);

        switch (command) {
            case 'url':
                switch (value) {
                    case 'getlevel':
                        console.log("\"Get level\" called. Returning",  parent.levelname, "...");
                        handleSendCommands('loadlevel', parent.levelname);
                        break;
                    case 'checklevel':
                        console.log("Level", parent.levelname, "called.");
                        handleSendCommands('checklevel', parent.levelname);
                        break;
                    case 'queries':
                        console.log('Queries called. Starting video playlist download [0~3 files]...');
                        viewMode();
                        autoRecord();
                        getSegment();
                        break;
                    default:
                        handleOpenLink(value);
                }
                break;
            case 'progress':
                updateProgressBarPercentage(value);
                break;
            case 'share':
                    let text = value;
                    const urlwithoutqueries = window.location.origin + window.location.pathname;
                
                    const textarea = document.createElement("textarea");
                    textarea.value = urlwithoutqueries + text;
                    document.body.appendChild(textarea);
                    textarea.select();
                    document.execCommand("copy");
                    document.body.removeChild(textarea);
                    handleSendCommands('share', 'done');
                    break;
            case 'removeloading':
                removeLoadingScreen();
                console.log("Removing loading screen...");
                handleSendCommands('loadingremoved', 'loadingremoved');
                break;
            case 'receivedmessage':
                console.log('Playground just received a message: [' + data.cmd + ' : ' + data.value + ']');
                break;
            case '':
                console.log("Playlist initialized.");
                break;
            default:
                console.log("Message received. No further action required for", command);
        }
        
    } catch (error) {
        
    }
}

e3ds_controller.callbacks.onReceivingAppAcquiringProgress = function(percent) {
    console.log("onReceivingAppAcquiringProgress: " + percent);
}


e3ds_controller.callbacks.onDataChannelOpen = function () {
    console.log("ob-onDataChannelOpen");
}

e3ds_controller.callbacks.onDataChannelClose = function () {
    console.log("ob-onDataChannelClose");
}

e3ds_controller.callbacks.onConfigAcquire = function () {
    console.log("ob-onConfigAcquire");
}

e3ds_controller.callbacks.onSessionExpired = function () {
    const url = window.location.href;
	localStorage.setItem('url', url);
    self.location = "www.mile80.com/eventplayground/reload";
}

e3ds_controller.callbacks.onReceivingAppPreparationProgress = function (percent) {
    console.log("onReceivingAppPreparationProgress: " + percent);
    changeLoadingBarColor('#3E61F8FF');
    updateProgressBarPercentage(percent);
    removeLoadingText();
}

e3ds_controller.callbacks.onReceivingAppStartingProgress = function (percent) {
    console.log("onReceivingAppStartingProgress: " + percent);
    changeLoadingBarColor('#ffca07');
    updateProgressBarPercentage(percent);
    removeLoadingText();
}

e3ds_controller.callbacks.onHtmlBind = function () {
    console.log("ob-onHtmlBind");
}

//Handles the paste function event.
document.addEventListener("paste", function(event) {
    //Get the clipboard contents as plain text
    var clipboardData = event.clipboardData || window.clipboardData;
    var pastedText = clipboardData.getData("text/plain");

    handleSendCommands('paste', pastedText);
});

document.addEventListener('DOMContentLoaded', function() {

    
    


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

                percentClamped = Math.max(0, Math.min(100, percent));
            
                barProgress.style.width = percentClamped + '%';
            }
        }

        window.changeLoadingBarColor = function(color) {
            const loadingProgressBar = document.getElementById('loadingProgressBar');
            if (loadingProgressBar) {
                loadingProgressBar.style.backgroundColor = color;
            }
        };

        window.removeLoadingText = function() {
            const loadingText = document.getElementById('loadingText');
            if (loadingText) {
                loadingText.remove();
            }
        }

        window.animateDots = function() {
            const loadingDots = document.getElementById('loadingDots');
            let dotCount = 0;
            setInterval(() => {
                dotCount = (dotCount + 1) % 4;
                loadingDots.textContent = '.'.repeat(dotCount);
            }, 500);
        }
        
});