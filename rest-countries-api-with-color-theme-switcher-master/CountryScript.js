function changeViewMode(event) {
    var b = event.target;
    if (document.documentElement.getAttribute("data-theme") === "dark") {
        document.documentElement.setAttribute("data-theme", "light");
        b.style.backgroundImage = "url(images/moon-regular.svg)";
        document.getElementById("backButton").style.backgroundImage = "url(images/arrow-left-solid.svg)";
        b.innerHTML = "Dark Mode";
    }
    else if (document.documentElement.getAttribute("data-theme") === "light") {
        document.documentElement.setAttribute("data-theme", "dark");
        b.style.backgroundImage = "url(images/moon-solid.svg)";
        document.getElementById("backButton").style.backgroundImage = "url(images/arrow-left-solid-white.svg)";
        b.innerHTML = "Light Mode";
    }
    document.getElementById('backButton').href = ".?view=" + document.documentElement.getAttribute("data-theme");
}

document.addEventListener('DOMContentLoaded', function () {
    populatePage() //Populating the page after waiting for the JSON data to load
    //Do stuff after loading from JSON
});
async function fetchJSON() { //Load all the JSON data and return after it's all loaded
    try {
        //var r = await fetch('https://restcountries.com/v3.1/all?fields=name,flag,nativeName,population,region,subregion,capital,topLevelDomain,currencies,languages,alpha3Code,borders');
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
    document.getElementById('backButton').href = ".?view=" + document.documentElement.getAttribute("data-theme");
    var searchString = thisURL.searchParams.get('alpha');
    var countryData = data.find(obj => { return obj.alpha3Code === searchString })

    document.title = countryData.name + " | API Countries";
    var domains = arrayToString(countryData.topLevelDomain);
    var currencies = arrayToString(countryData.currencies);
    var languages = arrayToString(countryData.languages);
    var hasBorderCountries = countryData.borders ?
        "<div id='border'>" +
        "<span>Border Countries:</span>" +
        "<div id='borderButtonHolder'>" + buildBorderCountries(countryData.borders) + "</div></div>" : ""

    var newHTML =
        "<img src='" + countryData.flag + "' id='flag'>" +
        "<div>" +
        "<h1>" + countryData.name + "</h1>" +
        "<div id='countryInfo'>" +
        "<div>Native Name: <span>" + countryData.nativeName + "</span></div>" +
        "<div>Population: <span>" + numberWithCommas(countryData.population) + "</span></div>" +
        "<div>Region: <span>" + countryData.region + "</span></div>" +
        "<div>Sub Region: <span>" + countryData.subregion + "</span></div>" +
        "<div>Capital: <span>" + countryData.capital + "</span></div>" +
        "<div>Top Level Domain: <span>" + domains + "</span></div>" +
        "<div>Currencies: <span>" + currencies + "</span></div>" +
        "<div>Languages: <span>" + languages + "</span></div>" +
        "</div>" +
        hasBorderCountries +
        "</div>"


    document.getElementById("country").innerHTML += newHTML;
}

function arrayToString(array) {
    var string = "";
    if (typeof array[0] === 'object') {
        for (let i = 0; i < array.length; i++) {
            if (i < array.length - 1) string += array[i].name + ", ";
            else string += array[i].name;
        }
    }
    else {
        for (let i = 0; i < array.length; i++) {
            if (i < array.length - 1) string += array[i] + ", ";
            else string += array[i];
        }
    }
    return string;
}

function buildBorderCountries(borderCountries) {
    var borderHTML = "";
    for (let i = 0; i < borderCountries.length; i++) {
        const a = borderCountries[i];
        var country = data.find(obj => { return obj.alpha3Code === a })
        borderHTML += "<a href='country.html?alpha=" + a + "' class='button'>" + country.name + "</a>"
    }
    return borderHTML;
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}