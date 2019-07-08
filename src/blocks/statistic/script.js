
const countItemsBlock = document.querySelector("section.statistic");
const countItems = countItemsBlock.querySelectorAll(".statistic_item-count");

let counts = [];

for (let i = 0; i < countItems.length; i++) {
    counts.push(countItems[i].innerText);
    countItems[i].innerText = "0";
}

const animateCounts = () => {
    let itemBlockRect = countItemsBlock.getBoundingClientRect();
    if (itemBlockRect.bottom <= window.screen.height + itemBlockRect.height * .5 && itemBlockRect.bottom >= itemBlockRect.height * .5) {
        window.removeEventListener("scroll", animateCounts)
        window._animate(function(progress) {
            for (let i = 0; i < countItems.length; i++) {
                countItems[i].innerText = parseInt(progress * counts[i]);
            }
        });
    }
}

window.addEventListener("scroll", animateCounts);