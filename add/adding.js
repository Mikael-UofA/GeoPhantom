'use strict'

document.querySelector('form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const formInputs = document.querySelectorAll('.form-control')
    let formIsValid = true;

    formInputs.forEach(input => {
        if(!input.checkValidity()) {
            input.classList.add('is-invalid');
            formIsValid = false;
        } else {
            input.classList.remove('is-invalid');
        }
    })

    if (formIsValid) {
        console.log('Form is valid, redirecting...');
        window.location.href = '../popup/popup.html';
    } else {
        console.log('Form is invalid.');
        event.stopPropagation();
    }

    console.log('Failure');
    this.classList.add('was-validated');
    
}, false);