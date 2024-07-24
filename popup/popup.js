'use strict'

loadLocations()

const maxDisplayedLocations = 5;
let locations = [];
let listSize = 0;
let channels = 1;
let currentChannel = 1;

document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.group-item');
    const toggleButton = document.getElementById('toggleButton');
    const toggleButton2 = document.getElementById('toggleButton2');
    const prevButton = document.getElementById('previous');
    const nextButton = document.getElementById('next');
    const addButton = document.getElementById('addButton');
    const deleteButton = document.getElementById('deleteButton');


    // Get the button state from storage
    chrome.storage.local.get(['buttonState'], function(result) {
        if (result.buttonState) {
            toggleButton.classList.remove('btn-dis');
            toggleButton.classList.add('btn-act')
            toggleButton.textContent = 'Activated';
        } else {
            toggleButton.classList.remove('btn-act')
            toggleButton.classList.add('btn-dis');
            toggleButton.textContent = 'Disabled';
        }
    });

    buttons.forEach(button => {
        // If button is already clicked, unclick it, otherwise unclick all other buttons
        button.addEventListener('click', () => {
            if (button.classList.contains('active')) {
                button.classList.remove('active');
            } else {
                buttons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
            }
        });
    });

    toggleButton.addEventListener('click', () => {
        // If the button is disabled
        if (toggleButton.classList.contains('btn-dis')) {
            const activeButton = document.querySelector('.list-group-item.active');
            // If an element of the list was selected
            if (activeButton) {
                toggleButton.classList.remove('btn-dis');
                toggleButton.classList.add('btn-act')
                toggleButton.textContent = 'Activated';
                let geolocation = getGeolocation();
                chrome.storage.local.set({ buttonState: true, geo: geolocation });
                console.log(`Active button text: ${activeButton.textContent}`);
            } else {
                console.log('No active button found');
            }
        } else {
            toggleButton.classList.remove('btn-act')
            toggleButton.classList.add('btn-dis');
            toggleButton.textContent = 'Disabled';
            chrome.storage.local.set({ buttonState: false, geo: 0 });
        }
    });

    toggleButton2.addEventListener('click', () => {
        
        const activeButton = document.querySelector('.group-item.active');
        if (activeButton) {
            // Remove element
            const index = getActiveButtonIndex();
            activeButton.classList.remove('active');
            locations.splice(index, 1);

            updateInfo() // update list and movement;
            saveLocations() // save to storage;
            deleteButton.click() // remove delete mode;
                
        } else {
            console.log('First select an element');
        }
        
    });

    prevButton.addEventListener('click', () => {
        if (currentChannel != 1) {
            currentChannel -= 1;
            updateChannels();
            updateListButtons();
        }
    })
    nextButton.addEventListener('click', () => {
        if (currentChannel < channels) {
            currentChannel += 1;
            updateChannels();
            updateListButtons();
        }
    })

    addButton.addEventListener('click', () => {
        window.location.href = "../new/new.html";
    })
    deleteButton.addEventListener('click', () => {
        if (toggleButton2.classList.contains('hide')) {
            toggleButton.classList.add('hide');
            toggleButton2.classList.remove('hide');
            buttons.forEach(button => {
                button.classList.add('del')
            });
            document.body.style.backgroundImage = "url('../images/pattern3.svg')";
        } else {
            toggleButton2.classList.add('hide');
            toggleButton.classList.remove('hide');
            buttons.forEach(button => {
                button.classList.remove('del')
            });
            document.body.style.backgroundImage = "url('../images/pattern.svg')";
        }
    })

});

function updateInfo() {
    const template = document.getElementById('icon-template').content;
    const formGroups = document.querySelectorAll('.form-group');

    listSize = locations.length;
    channels = Math.max(Math.ceil(listSize / maxDisplayedLocations), 1);

    formGroups.forEach(group => {
        const icon = document.importNode(template, true);
        group.appendChild(icon);
    });

    updateChannels();
    updateListButtons();
}
function loadLocations() {
    chrome.runtime.sendMessage({ action: 'load' }, (response) => {
        if (response.error) {
            console.error('Error:', response.error);
        } else {
            locations = response.value;
            updateInfo()
        }
    });
}

function saveLocations() {
    chrome.runtime.sendMessage({ action: 'save', value: locations }, (response) => {
        if (response.error) {
            console.error('Error:', response.error);
        } else {
            console.log('Save successful:', response.value);
        }
    })
}
function updateChannels() {
    document.getElementById('dynamicText').innerHTML = currentChannel + "/" + channels;
}
function updateListButtons() {
    const buttons = document.querySelectorAll('.group-item');
    buttons.forEach((button, index) => {
        const formGroup = button.closest('.form-group');
        const svg = formGroup.querySelector('.input-icon');

        if (listSize <= index + (currentChannel - 1) * 5 ) {
            button.classList.add('hide');
            svg.classList.add('hide');
        } else {
            button.innerHTML = getLocation(index, currentChannel).name;
            button.classList.remove('hide');
            svg.classList.remove('hide');
        }
        
    });
}
function getLocation(index, currentChannel) {
    return locations[index + (currentChannel - 1) * 5]
}
function getActiveButtonIndex() {
    const buttons = document.querySelectorAll('.group-item');
    for (let i = 0; i < buttons.length; i++) {
        if (buttons[i].classList.contains('active')) {
            return i;
        }
    }
    return -1;
}
function getGeolocation() {
    const index = getActiveButtonIndex();
    const loc = getLocation(index, currentChannel);
    return {lat: loc.lat, long: loc.long};
}
