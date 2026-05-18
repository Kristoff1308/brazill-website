document.querySelector(".return-home-btn").addEventListener("click", function (e) {
    e.preventDefault();
    document.body.style.transition = "opacity 0.3s ease";
    document.body.style.opacity = "0.3";
    setTimeout(() => {
        window.location.href = this.href;
    }, 300);
});
const boxes = document.querySelectorAll(".box");
function revealOnScroll() {
    const triggerBottom = window.innerHeight * 0.85;
    boxes.forEach(box => {
        const boxTop = box.getBoundingClientRect().top;
        if (boxTop < triggerBottom) {
            box.classList.add("show");
        }
    });
}
window.addEventListener("scroll", revealOnScroll);
revealOnScroll();
window.addEventListener("load", () => {
    document.body.style.opacity = "1";
});