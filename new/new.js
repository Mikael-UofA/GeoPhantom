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
        const name = document.getElementById('floatingName').value;
        const latitude = parseFloat(document.getElementById('floatingLatitude').value);
        const longitude = parseFloat(document.getElementById('floatingLongitude').value);

        chrome.runtime.sendMessage({action: "add", value: name + ", " + latitude + ", " + longitude}, function(response) {
            console.log(response);
        })
        window.location.href = '../popup/popup.html';
    } else {
        console.log('Form is invalid.');
        event.stopPropagation();
    }

    this.classList.add('was-validated');
    
}, false);