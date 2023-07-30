var isDarkMode = true;

function changeDisplayMode() {

    if (document.documentElement.getAttribute("data-theme") === "dark") {
        document.documentElement.setAttribute("data-theme", "light");
        document.getElementById("displaySwitch").innerHTML = "🌞"

    }
    else if (document.documentElement.getAttribute("data-theme") === "light") {
        document.documentElement.setAttribute("data-theme", "dark");
        document.getElementById("displaySwitch").innerHTML = "🌙"

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
        var a = data.projects.length - (i + 1);
        var newHTML =
            "<div class='project'>" +
            "<img src='" + data.projects[a].path + "/design/desktop-design.jpg' alt='" + data.projects[a].name + "'>" +
            "<div class='projectLinkHolder'>" +
            "<a class='projectLink' href='" + data.projects[a].path + "'>" + data.projects[a].name + "</a>" +
            "<a class='FMLink' href='" + data.projects[a].url + "'>View on Frontend Mentor</a>" +
            "</div>"
        "</div>"
        projectHolder.innerHTML += newHTML;
    }
}