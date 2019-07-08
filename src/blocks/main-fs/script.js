const header = document.querySelector("header.header");
const button = document.querySelector(".first-screen_arrow");
const block = document.querySelector(button.getAttribute("href"));

const handleClick = e => {
    e.preventDefault();

    const top =  document.documentElement.clientTop - (window.pageYOffset ||  document.documentElement.scrollTop || document.body.scrollTop || 0) + header.getBoundingClientRect().height;
    const rect = block.getBoundingClientRect();
    const offset = rect.top - top;
    
    window._animate(progress => {
        window.scrollTo(0, ((window.pageYOffset ||  document.documentElement.scrollTop || document.body.scrollTop || 0) * (1 - progress)) + (progress * offset));
    });
}

button.addEventListener("click", handleClick);
button.addEventListener("touchend", handleClick);