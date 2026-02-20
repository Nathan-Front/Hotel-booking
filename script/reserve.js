
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

function displayOtherRooms(){
    const showMore = document.querySelectorAll(".more-rooms");
    const moreRooms = document.querySelector(".more-rooms");
    showMore.forEach(btn =>{
        btn.addEventListener("click", ()=>{
            const mainWrapper = btn.closest(".reserve-section").querySelector(".section-sub-wrapper");
            if (mainWrapper.classList.contains("show-other-rooms") && btn.classList.contains("active") ) {
                // collapse
                mainWrapper.style.height = mainWrapper.scrollHeight + "px";
                requestAnimationFrame(() => {
                    mainWrapper.style.height = "450px";
                });
                mainWrapper.classList.remove("show-other-rooms");
                btn.classList.remove("active");
            } else {
                // expand
                mainWrapper.style.height = mainWrapper.scrollHeight + "px";

                mainWrapper.addEventListener("transitionend", function handler() {
                    mainWrapper.style.height = "auto";
                    mainWrapper.removeEventListener("transitionend", handler);
                });
                 mainWrapper.classList.toggle("show-other-rooms");
                 btn.classList.toggle("active");
            }
        });
    });

}
displayOtherRooms();