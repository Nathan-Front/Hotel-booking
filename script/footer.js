function subscribeToNewsletter(){
    const subscribeBtn = document.querySelector(".subscribe-button");
    if (!subscribeBtn) return;
    subscribeBtn.addEventListener("click", () => {
        const emailInput = document.querySelector(".subscribe-input");
        const email = emailInput.value.trim();
        if(email){
            alert("Thank you for subscribing!");
            localStorage.setItem("subscribedEmail", email);
            emailInput.value = "";
        } else {
            alert("Please enter a valid email address.");
        }
    });
}


   
