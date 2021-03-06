const header = document.querySelector("header.header");
const buttons = document.querySelectorAll("header a");
const menuButton = document.querySelector(".header_menu-button");
const menuIcon = document.querySelector(".header_menu-icon");
const nav = document.querySelector("nav");

const toggleActive = () => {
    nav.classList.toggle("active");
    menuIcon.classList.toggle("active");
}

const handleClick = e => {
    e.preventDefault();

    const block = document.querySelector(e.target.getAttribute("href"));
    const currentScroll = (window.pageYOffset ||  document.documentElement.scrollTop || document.body.scrollTop || 0);
    const top =  document.documentElement.clientTop - currentScroll + header.getBoundingClientRect().height;
    const offset = block.getBoundingClientRect().top - top;

    window._animate(progress => {
        window.scrollTo(0, (currentScroll * (1 - progress)) + (progress * offset));
    });
}

const changeHeaderBackground = () => {
    if (scrollY > 0) {
        header.style.backgroundColor = "#2b2a29";
    } else {
        header.style.backgroundColor = "transparent";
    }
}

changeHeaderBackground();

for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener("click", handleClick, false);
    buttons[i].addEventListener("click", toggleActive, false);
}

menuButton.addEventListener("click", toggleActive, false);
window.addEventListener("scroll", changeHeaderBackground, false);