var rating;
var lastClick;

function selectRating(num) {
    rating = num;
    event.target.style.backgroundColor = "#f97312";
    if (lastClick) { lastClick.style.backgroundColor = "rgba(255,255,255,0.1)" }
    lastClick = event.target;
}

function submit() {
    if (rating) {
        document.getElementById("ratingSelected").innerHTML = "You selected " + rating + " out of 5";

        document.getElementById("initial").style.display = "none";
        document.getElementById("thankYou").style.display = "flex";
    }
}