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