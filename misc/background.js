import { Location } from './location.js';

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
})
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

    const location = new Location(name, latitude, longitude);

    return location
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
