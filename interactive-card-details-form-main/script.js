function updateText(event) {
    var updateContent = event.target.value;

    var updateTarget = event.target.id.toString().charAt(0).toUpperCase() + event.target.id.slice(1);
    updateTarget = document.getElementById("card" + updateTarget);

    if (updateContent) updateTarget.innerText = updateContent;
}
function updateMonth(event) {
    var updateContent = event.target.value.toString().padStart(2, '0');
    var updateTarget = event.target.id.toString().charAt(0).toUpperCase() + event.target.id.slice(1);
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

function checkField(event) {
    if (event.target.value.length == 0) { errorText(event, "Can't be blank"); return (0); }

    switch (event.target.id) {
        case "number":
            if (event.target.value.length > 0 && event.target.value.length < 16) { errorText(event, "Must be 16 digits"); return (0); }
            break;
        case "month":
            if (event.target.value > 12) { errorText(event, "Must be a valid month"); return (0); }
            break;
        case "year":
            if (event.target.value.length > 0 && event.target.value.length != 2) { errorText(event, "Must be a valid year"); return (0); }
            break;
        case "CVC":
            if (event.target.value.length > 0 && event.target.value.length != 3) { errorText(event, "Must be 3 digits"); return (0); }
    }
    clearError(event);
}

function errorText(event, text) {
    if (document.getElementById(event.target.id + "error"))clearError(event);

    if (!document.getElementById(event.target.id + "error")) {
        var e = document.createElement("div");
        e.innerText = text;
        e.classList.add("error");
        var pos = event.target.getBoundingClientRect();
        e.style.left = pos.left + 5 + "px";
        e.style.top = pos.bottom + 1 + "px";
        e.style.display = "block";
        e.id = event.target.id + "error";
        event.target.parentElement.appendChild(e);
        event.target.style.borderColor = "red";
    }
}
function clearError(event) {
    if (document.getElementById(event.target.id + "error")) {
        document.getElementById(event.target.id + "error").remove();
        event.target.style.borderColor = "#e0e0e0";
    }
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
        if (theEvent.preventDefault) theEvent.preventDefault();
    }
}

var confirmed = false;

function confirmButton(event) {
    clearError(event);

    if (document.getElementById("name").value &&
        document.getElementById("number").value &&
        document.getElementById("month").value &&
        document.getElementById("year").value &&
        document.getElementById("CVC").value &&
        document.getElementsByClassName("error").length == 0 &&
        !confirmed) {
        document.querySelector("form").style.display = "none";
        document.getElementById("complete").style.display = "flex";
        confirmed = true;
        return (0);
    }
    else if (!confirmed) {
        errorText(event, "All fields must be filled");
    }

    if (confirmed) {
        document.querySelector("form").style.display = "block";
        document.getElementById("complete").style.display = "none";
        document.getElementById("name").value = null;
        document.getElementById("number").value = null;
        document.getElementById("month").value = null;
        document.getElementById("year").value = null;
        document.getElementById("CVC").value = null;
        document.getElementsByClassName("error").value = null;
        confirmed = false;
        return (0);
    }
}