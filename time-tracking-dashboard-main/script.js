async function fetchJSON() { //Load all the JSON data and return after it's all loaded
    var r = await fetch('data.json');
    var d = await r.json();
    return data = d;
}

var timeFrame = "weekly";

document.addEventListener('DOMContentLoaded', function () {
    populatePage() //Populating the page after waiting for the JSON data to load
});

async function populatePage() {
    var wait = await fetchJSON(); //Wait for all the JSON data to load from this function before we do anything else
    if (data) console.log('JSON data loaded');

    populateModules();
}

function setTimeFrame(event) {
    if (event.target.classList.contains("selected")) return;

    timeFrame = event.target.id;
    document.getElementById("timeFrameSelect").querySelector(".selected").classList.remove("selected");
    event.target.classList.add("selected");
    populateModules();
}

function populateModules() {

    for (var i = 0; i < data.length; i++) {
        const m = document.querySelector("#" + data[i].title.toLowerCase().replace(/\s+/g, ''));
        console.log(m);
        m.querySelector(".moduleTitle").innerHTML = data[i].title;

        switch (timeFrame) {
            case "daily":
                m.querySelector(".moduleTime").innerHTML = data[i].timeframes.daily.current + "hrs";
                m.querySelector(".modulePreviousTimeFrame").innerHTML = "Yesterday"
                m.querySelector(".modulePreviousTimeAmount").innerHTML = data[i].timeframes.daily.previous + "hrs";
                break;
            case "weekly":
                m.querySelector(".moduleTime").innerHTML = data[i].timeframes.weekly.current + "hrs";
                m.querySelector(".modulePreviousTimeFrame").innerHTML = "Last Week"
                m.querySelector(".modulePreviousTimeAmount").innerHTML = data[i].timeframes.weekly.previous + "hrs";
                break;
            case "monthly":
                m.querySelector(".moduleTime").innerHTML = data[i].timeframes.monthly.current + "hrs";
                m.querySelector(".modulePreviousTimeFrame").innerHTML = "Last Month"
                m.querySelector(".modulePreviousTimeAmount").innerHTML = data[i].timeframes.monthly.previous + "hrs";
                break;
        }
    }
}