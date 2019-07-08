const customersParent = document.querySelector(".customers_text");
const userpicParent = document.querySelector(".customers_userpic");

const flktyUserpic = new Flickity (userpicParent, {
    initialIndex: 1,
    pageDots: false,
    cellSelector: ".customers_userpic-item",
    percentPosition: false,
    arrowShape: { 
        x0: 0,
        x1: 40, y1: 50,
        x2: 40, y2: 45,
        x3: 5
      }
})

const flktyText = new Flickity (customersParent, {
    asNavFor: userpicParent,
    prevNextButtons: false,
    pageDots: false,
    draggable: false
})