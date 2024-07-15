'use strict'
const displayedLocations = 5;
const savedLocation = 23;
const channels = Math.ceil(23/5);
let currentChannel = 1;

updateChannels()

document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.list-group-item');
    const toggleButton = document.getElementById('toggleButton');
    const prevButton = document.getElementById("previous");
    const nextButton = document.getElementById("next");



    buttons.forEach(button => {
        button.addEventListener('click', () => {
            buttons.forEach(btn => btn.classList.remove('active'));

            button.classList.add('active');
        });
    });
    toggleButton.addEventListener('click', () => {
        if (toggleButton.classList.contains('btn-disabled')) {
            toggleButton.classList.remove('btn-disabled');
            toggleButton.textContent = 'Activated';
        } else {
            toggleButton.classList.add('btn-disabled');
            toggleButton.textContent = 'Disabled';
        }
    });

    prevButton.addEventListener('click', () => {
        if (currentChannel != 1) {
            currentChannel -= 1;
            updateChannels()
        }
    })
    nextButton.addEventListener('click', () => {
        if (currentChannel < channels) {
            currentChannel += 1;
            updateChannels()
        }
    })

});

function updateChannels() {
    document.getElementById("dynamicText").innerHTML = currentChannel + "/" + channels
}