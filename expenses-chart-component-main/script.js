var dataJSON = [
  {
    "day": "mon",
    "amount": 17.45
  },
  {
    "day": "tue",
    "amount": 34.91
  },
  {
    "day": "wed",
    "amount": 52.36
  },
  {
    "day": "thu",
    "amount": 31.07
  },
  {
    "day": "fri",
    "amount": 23.39
  },
  {
    "day": "sat",
    "amount": 43.28
  },
  {
    "day": "sun",
    "amount": 25.48
  }
]
var chartBars;
var maxValue = 0;

document.addEventListener('DOMContentLoaded', function () {

  for (let index = 0; index < dataJSON.length; index++) {
    if (dataJSON[index].amount > maxValue) {
      maxValue = dataJSON[index].amount;
    }
  } maxValue = maxValue * 1.4.toFixed(2);

  chartBars = document.querySelectorAll("#chart>div.barHolder>div.bar"); //set bar labels
  for (let index = 0; index < chartBars.length; index++) {
    chartBars[index].parentElement.setAttribute('day', dataJSON[index].day);

    chartBars[index].style.flexBasis = ((dataJSON[index].amount / maxValue) * 100).toFixed(2).toString() + "%";

    createAmount(chartBars[index], dataJSON[index]);
  }
});

function createAmount(bar, data) {
  var popup = document.createElement("div");
  popup.classList.add("popup");
  popup.innerHTML = "$"+data.amount;
  bar.appendChild(popup);

  bar.addEventListener("mouseover", function () { showAmount(bar) });
  bar.addEventListener("mouseout", function () { hideAmount(bar) });

}

function showAmount(bar) {
  bar.firstChild.style.display = "block";
}

function hideAmount(bar) {
  bar.firstChild.style.display = "none";
}