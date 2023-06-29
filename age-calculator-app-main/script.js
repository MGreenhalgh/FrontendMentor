const today = new Date;
let enteredDate;

function checkField(event) {
    if (event.target.value == "") {
        event.target.nextElementSibling.innerHTML = "This field is required";
        event.target.nextElementSibling.classList.remove("hide");
        event.target.style.borderColor = "red";
        return;
    }
    switch (event.target.id) {
        case "day":
            if (Number(event.target.value) > 31 || isNaN(Number(event.target.value))) {
                showError(event, "Must be a valid " + event.target.id);
                if (isNaN(Number(event.target.value))) showError(event, "Must be a number");
            }
            else {
                if (event.target.style.borderColor == "red") event.target.style.borderColor = "#878787";
                if (!event.target.nextElementSibling.classList.contains("hide")) event.target.nextElementSibling.classList.add("hide");
            }
            break;
        case "month":
            if (Number(event.target.value) > 12 || isNaN(Number(event.target.value))) {
                showError(event, "Must be a valid " + event.target.id);
                if (isNaN(Number(event.target.value))) showError(event, "Must be a number");
            }
            else {
                if (event.target.style.borderColor == "red") event.target.style.borderColor = "#878787";
                if (!event.target.nextElementSibling.classList.contains("hide")) event.target.nextElementSibling.classList.add("hide");
            }
            break;
        case "year":
            if (Number(event.target.value) > today.getFullYear || isNaN(Number(event.target.value))) {
                if (Number(event.target.value) > today.getFullYear) showError(event, "Must be in the past");
                if (isNaN(Number(event.target.value))) showError(event, "Must be a number");
            }
            else {
                if (event.target.style.borderColor == "red") event.target.style.borderColor = "#878787";
                if (!event.target.nextElementSibling.classList.contains("hide")) event.target.nextElementSibling.classList.add("hide");
            }
    }
}

function showError(event, text) {
    event.target.nextElementSibling.innerHTML = text;
    event.target.nextElementSibling.classList.remove("hide");
    event.target.style.borderColor = "red";
}

function getAge() {
    enteredDate = new Date(document.getElementById("year").value, document.getElementById("month").value, document.getElementById("day").value);

    var nowDate = moment(today);
    var thenDate = moment(enteredDate);

    var years = nowDate.diff(thenDate, 'year');
    thenDate.add(years, 'years');

    var months = nowDate.diff(thenDate, 'months');
    thenDate.add(months, 'months');

    var days = nowDate.diff(thenDate, 'days');

    document.getElementById("dayResult").innerHTML = days;
    document.getElementById("monthResult").innerHTML = months;
    document.getElementById("yearResult").innerHTML = years;
}