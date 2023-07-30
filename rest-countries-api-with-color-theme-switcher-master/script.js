function changeViewMode(event) {
    var b = event.target;
    if (document.documentElement.getAttribute("data-theme") === "dark") {
        document.documentElement.setAttribute("data-theme", "light");
        b.style.backgroundImage = "url(images/moon-regular.svg)";
        document.getElementById("searchButton").style.backgroundImage = "url(images/magnifying-glass-solid.svg)";
        document.getElementById("regionFilter").style.backgroundImage = "url(images/chevron-down-solid.svg)";
        b.innerHTML = "Dark Mode";
    }
    else if (document.documentElement.getAttribute("data-theme") === "light") {
        document.documentElement.setAttribute("data-theme", "dark");
        b.style.backgroundImage = "url(images/moon-solid.svg)";
        document.getElementById("searchButton").style.backgroundImage = "url(images/magnifying-glass-solid-white.svg)";
        document.getElementById("regionFilter").style.backgroundImage = "url(images/chevron-down-solid-white.svg)";
        b.innerHTML = "Light Mode";
    }
}

document.addEventListener('DOMContentLoaded', function () {
    populatePage() //Populating the page after waiting for the JSON data to load
    //Do stuff after loading from JSON
});
async function fetchJSON() { //Load all the JSON data and return after it's all loaded
    try {
        //var r = await fetch('https://restcountries.com/v3.1/all?fields=name,flags,population,region,capital,alpha3Code');
        var d = await r.json();
        return data = d;
    }
    catch (error) {
        console.log("Loading backup data due to error: " + error);
        var r = await fetch('data.json');
        var d = await r.json();
        return data = d;
    }
}
async function populatePage() {
    var wait = await fetchJSON(); //Wait for all the JSON data to load from this function before we do anything else
    if (data) console.log('JSON data loaded');
    var thisURL = new URL(window.location.toLocaleString());
    thisURL.searchParams.get('view') ? document.documentElement.setAttribute("data-theme", thisURL.searchParams.get('view')) : document.documentElement.setAttribute("data-theme", "dark");
    var nameList = [];
    for (let i = 0; i < data.length; i++) {
        const country = data[i];
        var cleanName = country.name.replace(/'/g, 'A');
        nameList.push(cleanName);
        var capital = country.capital ? country.capital : "None";
        newHTML =
            "<a href='country.html?alpha=" + country.alpha3Code + "&view=" + document.documentElement.getAttribute("data-theme") + "' region='" + country.region + "' class='country' id='" + cleanName + "'>" +
            "<img src='" + country.flags.png + "' alt='" + country.name + " flag' class='countryImg'>" +
            "<div class='countryInfo'>" +
            "<div class='countryName'>" + country.name + "</div>" +
            "<div class='countryPop'>Population: <span>" + numberWithCommas(country.population) + "</span></div>" +
            "<div class='countryRegion'>Region: <span>" + country.region + "</span></div>" +
            "<div class='countryCapitals'>Capital: <span>" + capital + "</span></div>" +
            "</div>" +
            "</a>"
        document.getElementById("countryHolder").innerHTML += newHTML;
    }
    searchData = nameList;
}
var searchData;

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function openDropdown() {
    const dropdown = document.getElementById("dropdown");
    if (dropdown.classList.contains("hide")) {
        dropdown.classList.remove("hide");
    }
    else {
        dropdown.classList.add("hide");
    }
}

function filterRegion(region) {
    clearFilter();

    for (let i = 0; i < document.getElementById("countryHolder").children.length; i++) {
        const a = document.getElementById("countryHolder").children[i];
        if (a.getAttribute("region") != region) a.classList.add("hide");
    }

    var newFilterTag = document.createElement("button")
    newFilterTag.id = "filterTag";
    newFilterTag.addEventListener("click", () => { clearFilter() })
    newFilterTag.innerHTML = region;
    document.getElementById("dropdownContainer").prepend(newFilterTag);

    openDropdown();
}

function clearFilter() {
    for (let i = 0; i < document.getElementById("countryHolder").children.length; i++) {
        const a = document.getElementById("countryHolder").children[i];
        if (a.classList.contains("hide")) a.classList.remove("hide");
    }
    if (document.getElementById('filterTag')) document.getElementById('filterTag').remove();
}

function search() {
    event.preventDefault();

    var input = document.getElementById('searchInput').value.toLowerCase();
    console.log(input);
    if (input == "") {
        for (let i = 0; i < searchData.length; i++) {
            const a = searchData[i];
            if (document.getElementById(a).classList.contains("searchHide")) document.getElementById(a).classList.remove("searchHide");
        }
        return;
    }
    for (let i = 0; i < searchData.length; i++) {
        const a = searchData[i];
        console.log(a);
        if (!a.toLowerCase().includes(input)) {
            document.getElementById(a).classList.add("searchHide");
        }
        else if (document.getElementById(a).classList.contains("searchHide")) {
            document.getElementById(a).classList.remove("searchHide");
        }
    }
}