import { Location } from './location.js';

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log(request);
    console.log(sender);

    switch(request.action) {
        case 'save':
            const response = parseLocationString(request.value);
            console.log("Save Successful")
            sendResponse({ saveSuccessful: response });
            break;
        default:
            console.log('Save unsuccessful. Unknown action:', request.action);
            sendResponse({ error: 'Unknown action' });
    }
})

function parseLocationString(locationString) {
    // Split the string by comma and trim any extra spaces
    const parts = locationString.split(',').map(part => part.trim());

    // Extract the name, latitude, and longitude
    const name = parts[0];
    const latitude = parseFloat(parts[1]);
    const longitude = parseFloat(parts[2]);

    // Create a new Location instance
    const location = new Location(name, latitude, longitude);

    return location
}