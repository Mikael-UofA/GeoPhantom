'use strict'

loadLocations()

const maxDisplayedLocations = 5;
let locations = [];
let listSize = 0;
let channels = 1;
let currentChannel = 1;

document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.list-group-item');
    const toggleButton = document.getElementById('toggleButton');
    const prevButton = document.getElementById('previous');
    const nextButton = document.getElementById('next');
    const addButton = document.getElementById('addButton');



    buttons.forEach(button => {
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
        if (toggleButton.classList.contains('btn-dis')) {
            const activeButton = document.querySelector('.list-group-item.active');
            if (activeButton) {
                toggleButton.classList.remove('btn-dis');
                toggleButton.classList.add('btn-act')
                toggleButton.textContent = 'Activated';
                console.log(`Active button text: ${activeButton.textContent}`);
            } else {
                console.log('No active button found');
            }
        } else {
            toggleButton.classList.remove('btn-act')
            toggleButton.classList.add('btn-dis');
            toggleButton.textContent = 'Disabled';
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
        window.location.href = "../add/adding.html";
    })

});

function loadLocations() {
    chrome.runtime.sendMessage({ action: 'load' }, (response) => {
        if (response.error) {
            console.error('Error:', response.error);
        } else {
            locations = response.value;
            listSize = locations.length;
            channels = Math.max(Math.ceil(listSize / maxDisplayedLocations), 1);

            updateChannels();
            updateListButtons();
        }
    });
}

function updateChannels() {
    document.getElementById('dynamicText').innerHTML = currentChannel + "/" + channels;
}

function updateListButtons() {
    const buttons = document.querySelectorAll('.list-group-item');
    buttons.forEach((button, index) => {
        button.innerHTML = listSize <= index + (currentChannel - 1) * 5 ? "------------------" : getLocation(index, currentChannel).name;
    });
}

function getLocation(index, currentChannel) {
    return locations[index + (currentChannel - 1) * 5]
}
