const buttons = document.querySelectorAll(".services_item-more");
const titleArr = document.querySelectorAll(".services_item-title");
const textArr = document.querySelectorAll(".services_item-text");
const popup = document.querySelector(".services_popup");
const closeButton = popup.querySelector("button");

let popupTitle = popup.querySelector(".services_popup-title");
let popupText = popup.querySelector(".services_popup-text");

for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener("click", e => {
        popupTitle.innerText = titleArr[i].innerText;
        popupText.innerText = textArr[i].innerText;
        popup.classList.add("active");
        document.querySelector("html").classList.add("active");
    })
}

const closeModal = e => {
    e.stopPropagation();
    e.preventDefault();
    if (e.target === closeButton || e.target === popup) {
        popup.classList.remove("active");
        document.querySelector("html").classList.remove("active");
    }
}

popup.addEventListener("click", closeModal);