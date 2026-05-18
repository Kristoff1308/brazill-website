document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("contactForm");
    const popup = document.getElementById("popup");
    const closePopup = document.getElementById("closePopup");
    closePopup.addEventListener("click", () => {
        popup.classList.remove("show");
    });
    form.addEventListener("submit", function (e) {
        e.preventDefault();
        let valid = true;
        document.querySelectorAll(".error").forEach(el => el.innerText = "");
        let name = document.getElementById("name").value.trim();
        let email = document.getElementById("email").value.trim();
        let phone = document.getElementById("phone").value.trim();
        let message = document.getElementById("message").value.trim();
        if (name.length < 3) {
            document.getElementById("nameError").innerText = "Enter valid name";
            valid = false;
        }
        if (!email.includes("@")) {
            document.getElementById("emailError").innerText = "Enter valid email";
            valid = false;
        }
        if (isNaN(phone) || phone.length < 9) {
            document.getElementById("phoneError").innerText = "Enter valid phone";
            valid = false;
        }
        if (message.length < 8) {
            document.getElementById("messageError").innerText = "Message too short";
            valid = false;
        }
        if (!valid) return;
        popup.classList.add("show");
        console.log({ name, email, phone, message });
        form.reset();
    });
});