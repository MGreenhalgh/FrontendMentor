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
    initialConstructJobs(data);
}

function initialConstructJobs(data) {
    var newHTML = "", jobHolder = document.getElementById("jobHolder");
    for (var i = 0; i < data.length; i++) {

        var companyAfters = "", isFeatured = "", tags = "";
        if (data[i].new) companyAfters += "<div class='new'>NEW!</div>";
        if (data[i].featured) { companyAfters += "<div class='featured'>FEATURED</div>"; isFeatured = " featured"; }

        tags = buildTags(data[i]);

        newHTML +=
            "<div class='job" + isFeatured + "'>" +
            "<div class='jobLeft'>" +
            "<img src='" + data[i].logo + "' alt='" + data[i].company + "'>" +
            "<div class='jobInfo'>" +
            "<div class='jobCompany'>" + data[i].company + companyAfters + "</div>" +
            "<a href='#' class='jobTitle'>" + data[i].position + "</a>" +
            "<div class='jobSmallInfo'>" +
            "<div class='jobAge'>" + data[i].postedAt + "</div>·" +
            "<div class='jobTime'>" + data[i].contract + "</div>·" +
            "<div class='jobLocation'>" + data[i].location + "</div>" +
            "</div></div></div>" +
            "<div class='jobTags'>" + tags + "</div>" +
            "</div>";
    }
    jobHolder.innerHTML += newHTML;
}

function buildTags(data) {
    var tags = [data.role, data.level], tagsOutput = "";

    for (var i = 0; i < data.languages.length; i++) tags.push(data.languages[i]);
    for (var i = 0; i < data.tools.length; i++) tags.push(data.tools[i]);

    for (var i = 0; i < tags.length; i++) {
        tagsOutput += "<button class='tag " + tags[i] + "Filter' onclick='addFilter(event)'>" + tags[i] + "</button>"
    }

    return tagsOutput;
}

function addFilter(event) {
    var filterTagHolder = document.getElementById("filterTagHolder");

    if (!filterTagHolder.hasChildNodes() || document.getElementById("filterHolder").classList.contains("hide")) document.getElementById("filterHolder").classList.remove("hide");

    if (!IsElementInsideContainer("filterTagHolder", event.target.innerText + "Filter")) {
        var newFilterTag = "<div id='" + event.target.innerText + "Filter' class='filterTag'>" + event.target.innerText + "<button class='filterTagRemove' onclick='removeFilter(event)'></button></div>";
        filterTagHolder.innerHTML += newFilterTag;
    }

    toggleJobs(true, event.target.innerText);

}

function IsElementInsideContainer(containerID, childID) {
    var elm = document.getElementById(childID);
    var parent = elm ? elm.parentNode : false;
    return (parent.id && parent.id === containerID) ? true : false;
}

function removeFilter(event) {


    toggleJobs(false, event.target.parentElement.innerText);

    event.target.parentElement.remove();
    if (document.getElementById("filterTagHolder").childElementCount === 0) document.getElementById("filterTagHolder").parentElement.classList.add("hide");
    else {
        var refilter = document.getElementById("filterTagHolder").childNodes;

        for (var i = 0; i < refilter.length; i++) {

            toggleJobs(true, refilter[i].innerText);

        }
    }
}

function toggleJobs(hide, name) {
    var allJobs = document.querySelectorAll(".jobTags");
    for (var i = 0; i < allJobs.length; i++) {
        var showJob;
        hide ? showJob = true : showJob = false;
        for (var e = 0; e < allJobs[i].childNodes.length; e++) {
            if (hide) { if (allJobs[i].childNodes[e].classList.contains(name + "Filter")) hide ? showJob = false : showJob = true; }
            else if (!allJobs[i].childNodes[e].classList.contains(name + "Filter")) hide ? showJob = false : showJob = true;
        }
        if (showJob) {
            hide ? allJobs[i].parentElement.classList.add("hide") : allJobs[i].parentElement.classList.remove("hide");
        }
    }
}


function clearAllFilters() {
    var filterTagHolder = document.getElementById("filterTagHolder");

    while (filterTagHolder.lastElementChild) { filterTagHolder.removeChild(filterTagHolder.lastElementChild); }
    filterTagHolder.parentElement.classList.add("hide");

    var showAll = document.querySelectorAll(".job");
    for (var i = 0; i < showAll.length; i++) {
        if (showAll[i].classList.contains("hide")) showAll[i].classList.remove("hide");
    }
}