'use strict'

document.querySelector('form').addEventListener('submit', function(event) {
    const textInput = document.getElementById('floatingName');
    const latitude = document.getElementById('floatingLatitude');
    const longitude = document.getElementById('floatingLongitude');
    
    if (!textInput.checkValidity()) {
        textInput.classList.add('is-invalid');
        event.preventDefault();
        event.stopPropagation();
    } else {
        textInput.classList.remove('is-invalid');
    }
    
    if (!latitude.checkValidity()) {
        latitude.classList.add('is-invalid');
        event.preventDefault();
        event.stopPropagation();
    } else {
        latitude.classList.remove('is-invalid');
    }

    if (!longitude.checkValidity()) {
        longitude.classList.add('is-invalid');
        event.preventDefault();
        event.stopPropagation();
    } else {
        longitude.classList.remove('is-invalid');
    }

    this.classList.add('was-validated');
}, false);