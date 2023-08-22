document.addEventListener('DOMContentLoaded', () => populatePage());
async function fetchJSON() { //Load all the JSON data and return after it's all loaded
    var r = await fetch('data.json'); var d = await r.json(); return data = d;
}
async function populatePage() {
    await fetchJSON(); //Wait for all the JSON data to load from this function before we do anything else
    if (data) console.log('JSON data loaded');
    showStage(1);
}

function showStage(stage) {
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
        var billing = data.selections.plan.monthly ? "Monthly" : "Yearly";
        var billingLong = data.selections.plan.monthly ? "month" : "year";
        var billingShort = data.selections.plan.monthly ? "mo" : "yr";
        var totalPrice = data.selections.plan.monthly ? selectedPlan.price : selectedPlan.price * 10;

        var addonsHTML = data.selections.addons.length > 0 ? `<div class="summaryAddOns">` : "";
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
        addonsHTML += data.selections.addons.length > 0 ? `</div>` : "";

        var summaryHTML =
            `<div class="summaryPlan">` +
            `<div class="summaryPlanText">` +
            `<div class="summaryPlanTitle">${selectedPlan.name} (${billing})</div>` +
            `<a class="summaryPlanChange" onclick="showStage(2)">Change</a>` +
            `</div>` +
            `<div class="summaryPlanPrice">$${totalPrice}/${billingShort}</div>` +
            `</div>` +
            addonsHTML +
            `</>`;

        document.getElementById('summaryHolder').innerHTML = summaryHTML;

        var totalHTML = `Total (per ${billingLong})<div id="summaryTotalPrice">+$${totalPrice}/${billingShort}</div>`;
        document.getElementById('summaryTotal').innerHTML = totalHTML;
    }
    if (thisStage.querySelector('.backButton')) thisStage.querySelector('.backButton').addEventListener("click", () => { showStage(stage - 1) })
    if (thisStage.querySelector('.nextButton')) thisStage.querySelector('.nextButton').addEventListener("mouseover", () => { nextCheckValid(stage) })
}

function validateFields(type) {
    var field = document.getElementById(`${type}Field`);
    var emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    var phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;

    switch (type) {
        case "name": {
            if (field.value > "") {
                data.details.name = field.value;
                clearFieldError(field)
                break;
            } else {
                fieldError(field)
            }
            break;
        }
        case "email": {
            if (emailRegex.test(field.value)) {
                data.details.email = field.value;
                clearFieldError(field)
                break;
            } else {
                fieldError(field)
            }
            break;
        }
        case "phone": {
            if (phoneRegex.test(field.value)) {
                data.details.phone = field.value;
                clearFieldError(field)
                break;
            } else {
                fieldError(field)
            }
            break;
        }
    }
}

function fieldError(element) {
    if (element.nextElementSibling) if (element.nextElementSibling.classList.contains("error")) clearFieldError(element);

    var e = document.createElement("div");
    e.innerText = "This field must be valid";
    e.classList.add("error");
    element.parentElement.insertBefore(e, element.nextElementSibling);
    element.style.borderColor = "red";

}
function clearFieldError(element) {
    if (element.nextElementSibling) if (element.nextElementSibling.classList.contains("error")) {
        element.nextElementSibling.remove();
        element.style.borderColor = null;
    }
}

function nextCheckValid(stage) {
    var nextButton = document.getElementById(`formStage${stage}`).querySelector('.nextButton');
    switch (stage) {
        case 1: {
            if (data.details.name > "" && data.details.email > "" && data.details.phone > "") {
                nextButton.classList.remove("notValid")
                nextButton.addEventListener("click", () => { showStage(stage + 1) })
            }
            else nextButton.classList.add("notValid")
            break;
        }
        case 2: {
            if (data.selections.plan.id > 0) {
                nextButton.classList.remove("notValid")
                nextButton.addEventListener("click", () => { showStage(stage + 1) })
            }
            else nextButton.classList.add("notValid")
            break;
        }
        case 3:
        case 4: {
            nextButton.addEventListener("click", () => { showStage(stage + 1) })
            break;
        }
    }
}

function choosePlan(event, plan) {
    var planButtons = document.querySelectorAll("#planButtonHolder button");
    for (let i = 0; i < planButtons.length; i++) {
        if (planButtons[i].classList.contains("selected")) planButtons[i].classList.remove("selected");
    }
    event.target.closest("button").classList.add("selected")
    data.selections.plan.id = plan
    console.log("Plan: " + data.selections.plan);
}

function chooseBilling() {
    var button = document.querySelector("#planMonthlyYearlySwitch .sliderButton");
    var billingElement = button.closest("#planMonthlyYearlySwitch");
    if (button.style.left == "50%" && !data.selections.plan.monthly) {  //monthly
        button.style.left = "0%";
        data.selections.plan.monthly = true;
        billingElement.querySelector(".monthly").classList.add("selected");
        billingElement.querySelector(".yearly").classList.remove("selected");

        var planPrices = document.querySelectorAll("#planButtonHolder button .planPrice")
        for (let i = 0; i < planPrices.length; i++) {
            var planPrice = data.plans.find(obj => { return obj.id === i + 1 }).price
            planPrices[i].innerHTML = `$${planPrice}/mo`
            planPrices[i].closest("button").classList.remove("extend");
        }

        var addonPrices = document.querySelectorAll("#addOnButtonHolder button .addOnPrice")
        for (let i = 0; i < addonPrices.length; i++) {
            var addonPrice = data.addons.find(obj => { return obj.id === i + 1 }).price
            addonPrices[i].innerHTML = `$${addonPrice}/mo`
        }
    } else { //yearly
        button.style.left = "50%";
        data.selections.plan.monthly = false;
        billingElement.querySelector(".yearly").classList.add("selected");
        billingElement.querySelector(".monthly").classList.remove("selected");

        var planPrices = document.querySelectorAll("#planButtonHolder button .planPrice")
        for (let i = 0; i < planPrices.length; i++) {
            var planPrice = data.plans.find(obj => { return obj.id === i + 1 }).price * 10
            planPrices[i].innerHTML = `$${planPrice}/yr<div class="freeMonths">2 months free</div>`
            planPrices[i].closest("button").classList.add("extend");
        }

        var addonPrices = document.querySelectorAll("#addOnButtonHolder button .addOnPrice")
        for (let i = 0; i < addonPrices.length; i++) {
            var addonPrice = data.addons.find(obj => { return obj.id === i + 1 }).price * 10
            addonPrices[i].innerHTML = `$${addonPrice}/yr`
        }
    }
    console.log("Monthly? " + data.selections.plan.monthly);
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
    console.log("Addons: " + data.selections.addons);

}