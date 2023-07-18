document.addEventListener('DOMContentLoaded', function () {
    if (window.localStorage.getItem("URLData")) {
        document.getElementById("linkList").innerHTML += window.localStorage.getItem("URLData");
    }
});

async function shorten(event) {
    var longLink = event.target.previousElementSibling.value;
    if (!longLink) { showError(true, "noLink"); return; }
    if (!checkURL(longLink)) { showError(true, "invalid"); return; }

    if (document.getElementById("urlInput").classList.contains("error")) showError(false);
    var shortLink = await getShortLink(longLink);
    shortLink = shortLink.result.full_short_link
    buildLinkElement(longLink, shortLink);
}

function checkURL(longLink) {
    try {
        return Boolean(new URL(longLink));
    }
    catch (e) {
        return false;
    }
}

async function getShortLink(longLink) {
    var response = await fetch("https://api.shrtco.de/v2/shorten?url=" + longLink);
    var result = await response.json()
    return result;
}

function buildLinkElement(longLink, shortLink) {
    var newLinkElement =
        "<div class='linkBox' id='" + shortLink.slice(18) + "'>" +
        "<span class='longLink'>" + longLink + "</span><span class='shortLink'>" + shortLink + "</span><button class='colorButton linkButton' onclick='copy(event)'>Copy</button>" +
        "</div>";
    document.getElementById("linkList").innerHTML += newLinkElement;
    save(newLinkElement);
}

function save(data) {
    if (window.localStorage.getItem("URLData")) window.localStorage.setItem("URLData", window.localStorage.getItem("URLData") + data);
    else window.localStorage.setItem("URLData", data);
}

function copy(event) {
    if (!event.target.classList.contains("copied") && document.getElementsByClassName("copied").length != 0) {
        var c = document.getElementsByClassName("copied");
        c[0].innerHTML = "Copy";
        c[0].classList.remove("copied");
    }
    navigator.clipboard.writeText(event.target.previousElementSibling.innerText);
    event.target.innerHTML = "Copied!";
    event.target.classList.add("copied");
}

function showError(show, reason) {
    var input = document.getElementById("urlInput");
    var text;
    switch (reason) {
        case "noLink":
            text = "Please add a link";
            break;
        case "invalid":
            text = "This link is invalid";
    }
    switch (show) {
        case true:
            input.classList.add("error");
            if (document.getElementById(input.id + "error")) {
                document.getElementById(input.id + "error").remove();
            }
            var e = document.createElement("div");
            e.innerText = text;
            e.classList.add("error");
            e.id = input.id + "error";
            input.parentElement.appendChild(e);
            input.classList.add("error");
            break;
        case false:
            input.classList.remove("error");
            if (document.getElementById(input.id + "error")) {
                document.getElementById(input.id + "error").remove();
            }
    }
}

function menuOpen() {
    document.getElementById("headerMenu").classList.toggle("opened");
    document.getElementById("menuButton").classList.toggle("closeButton");
}