const header = document.querySelector("header.header");
const button = document.querySelector(".first-screen_arrow");
const block = document.querySelector(button.getAttribute("href"));

const handleClick = e => {
    e.preventDefault();

    const currentScroll = (window.pageYOffset ||  document.documentElement.scrollTop || document.body.scrollTop || 0);
    const top =  document.documentElement.clientTop - currentScroll + header.getBoundingClientRect().height;
    const offset = block.getBoundingClientRect().top - top;

    window._animate(progress => {
        window.scrollTo(0, (currentScroll * (1 - progress)) + (progress * offset));
    });
}

button.addEventListener("click", handleClick);
button.addEventListener("touchend", handleClick);