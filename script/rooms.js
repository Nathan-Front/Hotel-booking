
async function fetchNavbar(){
  const res = await fetch("navigation.html");
  const navHTML = await res.text();
  const navContainer = document.querySelector("body");
  navContainer.insertAdjacentHTML("afterbegin", navHTML);
}
fetchNavbar();

async function fetchBottomSections() {
  const body = document.body;

  // Load footer first
  const footerRes = await fetch("footer.html");
  const footerHTML = await footerRes.text();
  body.insertAdjacentHTML("beforeend", footerHTML);

  // Then load alright
  const alrightRes = await fetch("alright.html");
  const alrightHTML = await alrightRes.text();
  body.insertAdjacentHTML("beforeend", alrightHTML);

  if(window.innerWidth > 540) return;
    const res = await fetch("mobileNavigation.html");
    const mobileNavHTML = await res.text();
    const container = document.querySelector("body");
    container.insertAdjacentHTML("beforeend", mobileNavHTML);
}
fetchBottomSections();

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