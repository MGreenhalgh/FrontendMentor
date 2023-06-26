function updateText(field) {
    var updateContent = field.target.value;

    var updateTarget = field.target.id.toString().charAt(0).toUpperCase() + field.target.id.slice(1);
    updateTarget = document.getElementById("card" + updateTarget);

    if (updateContent) updateTarget.innerText = updateContent;
}

function updateNumber(event) {
    var updateContent = event.target.value;
    var parts = updateContent.match(/.{1,4}/g);
    updateContent = parts.join(" ");
    var updateTarget = event.target.id.toString().charAt(0).toUpperCase() + event.target.id.slice(1);
    updateTarget = document.getElementById("card" + updateTarget);

    if (updateContent) updateTarget.innerText = updateContent;
}

function validate(evt) {
    var theEvent = evt || window.event;

    // Handle paste
    if (theEvent.type === 'paste') {
        key = event.clipboardData.getData('text/plain');
    } else {
        // Handle key press
        var key = theEvent.keyCode || theEvent.which;
        key = String.fromCharCode(key);
    }
    var regex = /[0-9]|\./;
    if (!regex.test(key)) {
        theEvent.returnValue = false;
        //if(theEvent.preventDefault) theEvent.preventDefault();
    }
}