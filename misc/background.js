(() => {
    "use strict";
    // Function to configure geolocation settings for a tab
    const configureGeolocation = tabId => {
        chrome.storage.local.get(["activation", "geo"], items => {
            const { geo, activation } = items;

            if (activation) {
                // Attach the debugger to the specified tab
                chrome.debugger.attach({ tabId }, "1.3", () => {
                    if (!chrome.runtime.lastError) {
                        // Set geolocation if latitude or longitude is specified
                        if (geo && geo.lat && geo.long) {
                            chrome.debugger.sendCommand({
                                tabId
                            }, "Emulation.setGeolocationOverride", {
                                latitude: geo.lat ? parseFloat(geo.lat) : -3.3815258661710974,
                                longitude: geo.long ? parseFloat(geo.long) : 29.373503814891507,
                                accuracy: 1
                            });
                        }
                    }
                });
            }
        });
    };

    // Function to ensure the debugger is attached and configure geolocation
    const ensureDebuggerAttached = tabId => {
        chrome.debugger.getTargets(targets => {
            const target = targets.find(t => t.tabId === tabId);
            if (!target || !target.attached) {
                configureGeolocation(tabId);
            }
        });
    };

    // Event listener for newly created tabs
    chrome.tabs.onCreated.addListener(tab => {
        if (tab.id) configureGeolocation(tab.id);
    });

    // Event listener for activated tabs
    chrome.tabs.onActivated.addListener(activeInfo => {
        ensureDebuggerAttached(activeInfo.tabId);
    });

    // Event listener for updated tabs
    chrome.tabs.onUpdated.addListener(tabId => {
        ensureDebuggerAttached(tabId);
    });


    // Handle incoming messages
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        switch(request.action) {
            case 'add':
                const resp1 = parseLocationString(request.value);
                loadLocations().then(locations => {
                    locations.push(resp1);
                    return saveLocations(locations); 
                }).then(() => {
                    console.log("Addition of new location successful");
                    sendResponse({ value: "Successful addition" });
                }).catch(error => {
                    console.error('Error:', error);
                    sendResponse({ error: error.message });
                });
                return true;
            case 'save':
                saveLocations(request.value).then(() => {
                    sendResponse({ value: true });
                }).catch(error => {
                    console.error('Error:', error);
                    sendResponse({ error: error.message });
                });
                return true;
            case 'load':
                loadLocations().then(locations => {
                    console.log("Load Successful");
                    sendResponse({ value: locations });
                }).catch(error => {
                    console.error('Error loading locations:', error);
                    sendResponse({ error: error.message });
                });
                return true;
            default:
                console.log('Save unsuccessful. Unknown action:', request.action);
                sendResponse({ error: 'Unknown action' });
                return true;
        }
    });

    function loadLocations() {
        return new Promise((resolve, reject) => {
            chrome.storage.local.get('locations', function(result) {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError);
                    return;
                }
                const locations = result.locations ? JSON.parse(result.locations) : [];
                resolve(locations);
            });
        });
    }

    function parseLocationString(locationString) {
        const parts = locationString.split(',').map(part => part.trim());

        const name = parts[0];
        const latitude = parseFloat(parts[1]);
        const longitude = parseFloat(parts[2]);

        const location = {
            name: name,
            lat: latitude,
            long: longitude
        };

        return location;
    }

    function saveLocations(locations) {
        return new Promise((resolve, reject) => {
            chrome.storage.local.set({ locations: JSON.stringify(locations) }, function() {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError);
                    return;
                }
                console.log('Locations saved.');
                resolve();
            });
        });
    }
})();