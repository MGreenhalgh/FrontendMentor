
var data;
async function fetchJSON() { //Load all the JSON data
    var r = await fetch('data.json');
    var d = await r.json();
    return data = d;
}

document.addEventListener('DOMContentLoaded', function () {
    populatePage() //Populating the page after waiting for the JSON data to load
});

async function populatePage() {
    var wait = await fetchJSON(); //Wait for all the JSON data to load from this function before we do anything
    console.log(data.comments[1]);
}
