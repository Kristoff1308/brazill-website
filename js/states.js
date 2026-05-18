document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener("click", e => {
            e.preventDefault();
            const target = document.querySelector(a.getAttribute("href"));
            if (target) {
                target.scrollIntoView({
                    behavior: "smooth"
                });
            }
        });
    });
    const cards = document.querySelectorAll(".flip-card, .region-section");
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("show");
            } else {
                entry.target.classList.remove("show");
            }
        });
    }, {
        threshold: 0.15
    });
    cards.forEach(card => observer.observe(card));
    window.addEventListener("scroll", () => {
        const hero = document.querySelector(".hero");
        if (!hero) return;
        const scrollPosition = window.pageYOffset;
        hero.style.backgroundPositionY = scrollPosition * 0.5 + "px";
    });
    const title = document.querySelector(".hero h1");
    if (title) {
        window.addEventListener("mousemove", (e) => {
            const x = (window.innerWidth / 2 - e.pageX) / 40;
            const y = (window.innerHeight / 2 - e.pageY) / 40;
            title.style.transform = `translate(${x}px, ${y}px)`;
        });
    }
    document.querySelectorAll(".flip-card").forEach(card => {
        card.addEventListener("click", () => {
            const location = card.dataset.map;
            if (!location) return;
            const url = `https://www.google.com/maps/search/${encodeURIComponent(location)}`;
            window.open(url, "_blank");
        });
    });
    const video = document.getElementById("bgVideo");
    const soundBtn = document.getElementById("soundToggle");
    if (video && soundBtn) {
        soundBtn.addEventListener("click", () => {
            video.muted = !video.muted;
            soundBtn.textContent = video.muted
                ? "🔇 Sound Off"
                : "🔊 Sound On";
        });
    }
});