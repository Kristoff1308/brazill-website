const form = document.getElementById("registerForm");
form.addEventListener("submit", async function(e){
    e.preventDefault();
    const firstName =
    document.getElementById("firstName").value;
    const lastName =
    document.getElementById("lastName").value;
    const email =
    document.getElementById("email").value;
    const phone =
    document.getElementById("phone").value;
    const password =
    document.getElementById("password").value;
    const confirmPassword =
    document.getElementById("confirmPassword").value;
    const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{6,}$/;
    if(!passwordRegex.test(password)){
        alert(
            "Password must contain:\n" +
            "- minimum 6 characters\n" +
            "- uppercase letter\n" +
            "- lowercase letter\n" +
            "- number\n" +
            "- special character"
        );
        return;
    }
    if(password !== confirmPassword){
        alert("Passwords do not match");
        return;
    }
    try{
        const response = await fetch("/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                firstName,
                lastName,
                email,
                phone,
                password
            })
        });
        const data = await response.json();
       alert(data.message);
       form.reset();
       window.location.href = "login.html";
    } catch(error){
        alert("Server error");
    }
});
const togglePassword =
document.getElementById("togglePassword");
const passwordInput =
document.getElementById("password");
togglePassword.addEventListener("click", () => {
    if(passwordInput.type === "password"){
        passwordInput.type = "text";
        togglePassword.textContent = "Hide";
    } else {
        passwordInput.type = "password";
        togglePassword.textContent = "Show";
    }

});
const toggleConfirmPassword =
document.getElementById("toggleConfirmPassword");
const confirmPasswordInput =
document.getElementById("confirmPassword");
toggleConfirmPassword.addEventListener("click", () => {
    if(confirmPasswordInput.type === "password"){
        confirmPasswordInput.type = "text";
        toggleConfirmPassword.textContent = "Hide";
    } else {
        confirmPasswordInput.type = "password";
        toggleConfirmPassword.textContent = "Show";
    }
});