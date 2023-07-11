function openDropdown(event) {
    const dropdown = event.target.nextElementSibling;
    console.log(dropdown);
    if (dropdown.classList.contains("hide")) {
        dropdown.classList.remove("hide");
        event.target.classList.add("opened");
    }
    else {
        dropdown.classList.add("hide");
        event.target.classList.remove("opened");
    }
}

function openMenu(event) {
    const menu = document.getElementById("headerContainer");
    console.log(menu);
    if (menu.classList.contains("opened")) {
        menu.classList.remove("opened");
        event.target.classList.remove("closeButton");
    }
    else {
        menu.classList.add("opened");
        event.target.classList.add("closeButton");
    }
}