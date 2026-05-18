fetch("/profile")
    .then(res => {
        if(!res.ok){
            throw new Error("Not logged in");
        }
        return res.json();
    })
    .then(user => {
        document.getElementById("homeEmail").innerText = user.email;
        const avatar = document.getElementById("homeAvatar");
        avatar.style.display = "block";
        if(user.avatar){
            avatar.src = user.avatar;
        }
        document.getElementById("accountBtn").href = "account.html";
    })
    .catch(() => {
        document.getElementById("homeEmail").innerText = "Login";
        document.getElementById("homeAvatar").style.display = "none";
        document.getElementById("accountBtn").href = "login.html";
    });