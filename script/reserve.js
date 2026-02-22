
async function fetchNavbar(){
  const res = await fetch("navigation.html");
  const navHTML = await res.text();
  const navContainer = document.querySelector("body");
  navContainer.insertAdjacentHTML("afterbegin", navHTML);
}

async function fetchBottomSections() {
  const body = document.body;

  //load footer
  const footerRes = await fetch("footer.html");
  const footerHTML = await footerRes.text();
  body.insertAdjacentHTML("beforeend", footerHTML);

  //load alright
  const alrightRes = await fetch("alright.html");
  const alrightHTML = await alrightRes.text();
  body.insertAdjacentHTML("beforeend", alrightHTML);

  //If mobileviewport
  if(window.innerWidth > 540) return;
    const res = await fetch("mobileNavigation.html");
    const mobileNavHTML = await res.text();
    const container = document.querySelector("body");
    container.insertAdjacentHTML("beforeend", mobileNavHTML);
}

async function fetchRooms(){
    const roomContainer = document.querySelector(".rooms-container");

    const resSingle = await fetch("reserve rooms html/twinBedSingle.html");
    const twinSingleHTML = await resSingle.text();
    roomContainer.insertAdjacentHTML("afterbegin", twinSingleHTML);

    const resFull = await fetch("reserve rooms html/twinBedFull.html");
    const twinFullHTML = await resFull.text();
    roomContainer.insertAdjacentHTML("beforeend", twinFullHTML);

    const resDouble = await fetch("reserve rooms html/doubleBed.html");
    const doubleFullHTML = await resDouble.text();
    roomContainer.insertAdjacentHTML("beforeend", doubleFullHTML);

    const resQueen = await fetch("reserve rooms html/queenBed.html");
    const queenHTML = await resQueen.text();
    roomContainer.insertAdjacentHTML("beforeend", queenHTML);

    const resKing = await fetch("reserve rooms html/kingBed.html");
    const kingHTML = await resKing.text();
    roomContainer.insertAdjacentHTML("beforeend", kingHTML);

    const resFamily = await fetch("reserve rooms html/family.html");
    const familyHTML = await resFamily.text();
    roomContainer.insertAdjacentHTML("beforeend", familyHTML);

    const percentOff = document.querySelectorAll(".percent-off");
    percentOff.forEach(price => {
        if (price.textContent.trim() === "0% OFF") {
            const priceWrapper = price.closest(".price-wrapper");
            if (!priceWrapper) return;
            const specialDiscount = priceWrapper.querySelector(".special-discount");
            const originalPrice = priceWrapper.querySelector(".original-price");
            if (specialDiscount)
                specialDiscount.style.textDecoration = "line-through";
            if (originalPrice) {
                originalPrice.textContent = "";
                originalPrice.style.marginRight = "0";
            }
            price.style.textDecoration = "line-through";
        }
    });

    displayOtherRooms();
}

async function initAsync() {
  await fetchNavbar();
  await fetchRooms();
  await fetchBottomSections();
  scrollHash();

}
initAsync();

function displayOtherRooms(){
    const showMore = document.querySelectorAll(".more-rooms");
    const moreRooms = document.querySelector(".more-rooms");
    showMore.forEach(btn =>{
        btn.addEventListener("click", ()=>{
            const mainWrapper = btn.closest(".reserve-section").querySelector(".section-sub-wrapper");
            if (mainWrapper.classList.contains("show-other-rooms") && btn.classList.contains("active") ) {
                //hide
                mainWrapper.style.height = mainWrapper.scrollHeight + "px";
                requestAnimationFrame(() => {
                    mainWrapper.style.height = "450px";
                });
                mainWrapper.classList.remove("show-other-rooms");
                btn.classList.remove("active");
            } else {
                //display
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

function scrollHash(){
  const hash = window.location.hash;
  if (!hash) return;
  const el = document.querySelector(hash);
  if (el) {
    el.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
    history.replaceState(null, null, window.location.pathname);
  }
}
window.addEventListener("load", scrollHash);
