var isDarkMode = true;

function changeDisplayMode() {
    if (isDarkMode) {
        document.querySelector("body").classList.add("bodyLight");
        document.querySelector("h1").classList.add("h1Light");

        var projects = document.querySelectorAll(".project");
        for (var i = 0; i < projects.length; i++) {
            projects[i].classList.add("projectLight");
        }
        document.getElementById("displaySwitch").innerHTML = "🌙"
        isDarkMode = false;
    }
    else {
        document.querySelector("body").classList.remove("bodyLight");
        document.querySelector("h1").classList.remove("h1Light");

        var projects = document.querySelectorAll(".project");
        for (var i = 0; i < projects.length; i++) {
            projects[i].classList.remove("projectLight");
        }
        document.getElementById("displaySwitch").innerHTML = "🌞"
        isDarkMode = true;
    }
}

document.addEventListener('DOMContentLoaded', function () {
    populatePage() //Populating the page after waiting for the JSON data to load
    //Do stuff after loading from JSON
});
async function fetchJSON() { //Load all the JSON data and return after it's all loaded
    var r = await fetch('data.json');
    var d = await r.json();
    return data = d;
}
async function populatePage() {
    var wait = await fetchJSON(); //Wait for all the JSON data to load from this function before we do anything else
    if (data) console.log('JSON data loaded');

    var projectHolder = document.getElementById('projectHolder');

    for (var i = 0; i < data.projects.length; i++) {
        var newHTML =
            "<div class='project'>" +
            "<img src='" + data.projects[i].path + "/design/desktop-design.jpg' alt='" + data.projects[i].name + "'>" +
            "<div class='projectLinkHolder'>" +
            "<a class='projectLink' href='" + data.projects[i].path + "'>" + data.projects[i].name + "</a>" +
            "<a class='FMLink' href='" + data.projects[i].url + "'>View on Frontend Mentor</a>" +
            "</div>"
        "</div>"
        projectHolder.innerHTML += newHTML;
    }
}