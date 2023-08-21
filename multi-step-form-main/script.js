var currentStage = 1;

document.addEventListener('DOMContentLoaded', () => populatePage());
async function fetchJSON() { //Load all the JSON data and return after it's all loaded
    var r = await fetch('data.json'); var d = await r.json(); return data = d;
}
async function populatePage() {
    await fetchJSON(); //Wait for all the JSON data to load from this function before we do anything else
    if (data) console.log('JSON data loaded');
    showStage(currentStage);
}


function showStage(stage) {
    currentStage = stage;
    var thisStage = document.getElementById(`formStage${stage}`);

    var stages = document.querySelectorAll(".form")
    for (let i = 0; i < stages.length; i++) {
        if (!stages[i].classList.contains("hide")) stages[i].classList.add("hide");
        if (stages[i] == thisStage) stages[i].classList.remove("hide");
    }

    var stageTrackers = document.querySelectorAll(".formStageTracker")
    for (let i = 0; i < stageTrackers.length; i++) {
        if (stageTrackers[i].classList.contains("selected")) stageTrackers[i].classList.remove("selected");
        if (stageTrackers[i].id == `formStage${stage}Tracker`) stageTrackers[i].classList.add("selected");
    }

    if (stage == 4) {
        var selectedPlan = data.plans.find(obj => { return obj.id === data.selections.plan.id })
        console.log(selectedPlan);
        var billing = data.selections.plan.monthly ? "Monthly" : "Yearly";
        var billingLong = data.selections.plan.monthly ? "month" : "year";
        var billingShort = data.selections.plan.monthly ? "mo" : "yr";
        console.log(data.selections.plan.monthly);

        var totalPrice = data.selections.plan.monthly ? selectedPlan.price : selectedPlan.price * 10;


        var addonsHTML = ""
        for (let i = 0; i < data.selections.addons.length; i++) {
            const addon = data.selections.addons[i];
            var selectedAddon = data.addons.find(obj => { return obj.id === addon })
            var addonPrice = data.selections.plan.monthly ? selectedAddon.price : selectedAddon.price * 10;
            addonsHTML +=
                `<div class="summaryAddOnItem">` +
                `<div class="summaryAddOnTitle">${selectedAddon.name}</div>` +
                `<div class="summaryAddOnPrice">+$${addonPrice}/${billingShort}</div>` +
                `</div>`;
            totalPrice += addonPrice;
        }
        var summaryHTML =
            `<div class="summaryPlan">` +
            `<div class="summaryPlanText">` +
            `<div class="summaryPlanTitle">${selectedPlan.name} (${billing})</div>` +
            `<a class="summaryPlanChange" onclick="showStage(2)">Change</a>` +
            `</div>` +
            `<div class="summaryPlanPrice">$${totalPrice}/${billingShort}</div>` +
            `</div>` +
            `<div class="summaryAddOns">` +
            addonsHTML +
            `</div>` +
            `</div>`;

        document.getElementById('summaryHolder').innerHTML = summaryHTML;

        var totalHTML = `Total (per ${billingLong})<div id="summaryTotalPrice">+$${totalPrice}/${billingShort}</div>`;
        document.getElementById('summaryTotal').innerHTML = totalHTML;
    }

    if (thisStage.querySelector('.backButton')) thisStage.querySelector('.backButton').addEventListener("click", () => { showStage(stage - 1) })
    if (thisStage.querySelector('.nextButton')) thisStage.querySelector('.nextButton').addEventListener("click", () => { showStage(stage + 1) })
}

function choosePlan(event, plan) {
    var planButtons = document.querySelectorAll("#planButtonHolder button");
    for (let i = 0; i < planButtons.length; i++) {
        if (planButtons[i].classList.contains("selected")) planButtons[i].classList.remove("selected");
    }
    event.target.closest("button").classList.add("selected")
    data.selections.plan.id = plan
    console.log(data.selections.plan);
}

function chooseAddon(event, addon) {
    var addonElement = event.target.closest(".addOnButton")
    if (!data.selections.addons.find(obj => { return obj === addon })) {
        addonElement.querySelector("input[type='checkbox']").checked = true;
        addonElement.classList.add("selected");
        data.selections.addons.push(addon);
    } else {
        addonElement.querySelector("input[type='checkbox']").checked = false;
        addonElement.classList.remove("selected");
        var index = data.selections.addons.indexOf(addon);
        data.selections.addons.splice(index, 1);
    }
    console.log(data.selections.addons);

}

function chooseBilling() {
    var button = document.querySelector("#planMonthlyYearlySwitch .sliderButton");
    var billingElement = button.closest("#planMonthlyYearlySwitch");
    if (button.style.left == "50%" && !data.selections.plan.monthly) {
        button.style.left = "0%";
        data.selections.plan.monthly = true;
        billingElement.querySelector(".monthly").classList.add("selected");
        billingElement.querySelector(".yearly").classList.remove("selected");
    } else {
        button.style.left = "50%";
        data.selections.plan.monthly = false;
        billingElement.querySelector(".yearly").classList.add("selected");
        billingElement.querySelector(".monthly").classList.remove("selected");
    }
    console.log("Monthly? " + data.selections.plan.monthly);
}