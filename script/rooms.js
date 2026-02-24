

function reservationInputDisplay(){
  const formWrapper = document.querySelector(".rooms-form-wrapper");
  const displayInputReservation = document.querySelector(".user-reserve-info-wrapper");
  const displayInput = document.querySelector(".reserve-info-wrapper");

  displayInputReservation.addEventListener("click", () => {
    displayInput.classList.toggle("reserve-info-wrapper-active");
  });

  displayInput.addEventListener("click", (e) => {
    e.stopPropagation();
  });

  document.addEventListener("click", (e) => {
    if (!formWrapper.contains(e.target)) {
      displayInput.classList.remove("reserve-info-wrapper-active");
    }
  });
}
reservationInputDisplay();


function accordionFAQ(){
 const buttons = document.querySelectorAll(".faq-question");

  buttons.forEach(button => {
    button.addEventListener("click", () => {
      const content = button.nextElementSibling;

      // Close other sections inside same accordion
      const allContent = button.closest(".faq-wrapper").querySelectorAll(".faq-answer");
      allContent.forEach(item => {
        if (item !== content) {
          item.style.maxHeight = null;
        }
      });

      // Toggle current
      if (content.style.maxHeight) {
        content.style.maxHeight = null;
      } else {
        content.style.maxHeight = content.scrollHeight + "px";
      }
    });
  });
}
accordionFAQ();

function getReservationCount(){
  const counterWrapper = document.querySelector(".reserve-info-wrapper");
  const increaseBtn = document.querySelectorAll(".increase-button");
  const decreaseBTn = document.querySelectorAll(".decrease-button");

  let counter;
  increaseBtn.forEach(btn =>{
    btn.addEventListener("click", ()=>{
      const counterUp = btn.closest(".reserve-count-wrapper").querySelector("input");
      if(counterUp.value >= 10) {
        alert("You had reached the maximum number allowed to be reserved. Please contact us if you want to reserve more than 10. We are so sorry for the inconvinience.")
        return;
      };  
      counterUp.value ++;
      counter = counterUp.value;
      const targetId = btn.dataset.target;
      const displayCounter = document.getElementById(targetId);
      displayCounter.textContent = counter;
    });
  });
  decreaseBTn.forEach(btn =>{
    btn.addEventListener("click", ()=>{
      const counterDown = btn.closest(".reserve-count-wrapper").querySelector("input");
      if(counterDown.value <= 0) return;
      counterDown.value --;
      counter = counterDown.value;
      const targetId = btn.dataset.target;
      const displayCounter = document.getElementById(targetId);
      displayCounter.textContent = counter;
    });
  });
}
getReservationCount();
