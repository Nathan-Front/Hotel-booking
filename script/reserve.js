
async function fetchRooms(){
    const roomContainer = document.querySelector(".rooms-container");

    const resSingle = await fetch("reserve-rooms-html/twinBedSingle.html");
    const twinSingleHTML = await resSingle.text();
    roomContainer.insertAdjacentHTML("afterbegin", twinSingleHTML);

    const resFull = await fetch("reserve-rooms-html/twinBedFull.html");
    const twinFullHTML = await resFull.text();
    roomContainer.insertAdjacentHTML("beforeend", twinFullHTML);

    const resDouble = await fetch("reserve-rooms-html/doubleBed.html");
    const doubleFullHTML = await resDouble.text();
    roomContainer.insertAdjacentHTML("beforeend", doubleFullHTML);

    const resQueen = await fetch("reserve-rooms-html/queenBed.html");
    const queenHTML = await resQueen.text();
    roomContainer.insertAdjacentHTML("beforeend", queenHTML);

    const resKing = await fetch("reserve-rooms-html/kingBed.html");
    const kingHTML = await resKing.text();
    roomContainer.insertAdjacentHTML("beforeend", kingHTML);

    const resFamily = await fetch("reserve-rooms-html/family.html");
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

function displayMoreDetails(){
 const moreDetailsBtn = document.querySelectorAll(".more-button");
 const closeMoreDetailsBtn = document.querySelector(".close-button");
 const container = document.querySelector("body");
 if(moreDetailsBtn){
    moreDetailsBtn.forEach(btn =>{
        btn.addEventListener("click", async ()=>{
            const roomType = btn.closest(".reserve-section");
            const roomFiles = {
                "twin-bed-single-rooms": "twinBedSingleMore.html",
                "twin-bed-full-rooms": "twinBedFullMore.html",
                "double-bed-rooms": "doubleBedMore.html",
                "queen-rooms": "queenBedMore.html",
                "king-rooms": "kingBedMore.html",
                "family-rooms": "familyMore.html"
            };
            const fileName = roomFiles[roomType.id];
            if (fileName) {
                const res = await fetch(`rooms-more-details/${fileName}`);
                const html = await res.text();
                container.insertAdjacentHTML("afterbegin", html);
            }
            container.classList.add("no-scroll");
            const lockWrapper = document.querySelector(".lock-wrapper");
            const popup = document.querySelector(".more-details-wrapper");
        
            lockWrapper.classList.add("active");
            popup.classList.add("active");
        
            document.addEventListener("click", (e)=>{
                if (e.target.matches(".close-button")) {
                    e.target.closest(".lock-wrapper").remove();
                    document.body.classList.remove("no-scroll");
                }
            });
        });
    });
 }
}
async function initAsync() {
 const savedRoom = localStorage.getItem("selectedRoom");
  if (savedRoom) {
    const roomContainer = document.querySelector(".rooms-container");
    const resReserve = await fetch("reserve-rooms-html/reserveRoom.html");
    const reserveHTML = await resReserve.text();
    roomContainer.innerHTML = reserveHTML;
    flatpickr("#dateRange", {
      mode: "range",
      dateFormat: "Y-m-d"
    });
  } else {
    await fetchRooms();
    displayMoreDetails();
    reserveRoom();
  }
  scrollHash();
  cancelReservation();
}
document.addEventListener("DOMContentLoaded", initAsync);

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

//This needs to be global to be able to access it
function reserveRoom(){
    const reserveBtn = document.querySelectorAll(".reserve-room-button");
    reserveBtn.forEach(btn =>{
        btn.addEventListener("click", async ()=>{
            const wrapper = btn.closest(".reserve-section");
            const roomType = wrapper.querySelector("h3").textContent;
           
            localStorage.setItem("selectedRoom", roomType);
            const roomContainer = document.querySelector(".rooms-container");

            const resReserve = await fetch("reserve-rooms-html/reserveRoom.html");
            const reserveHTML = await resReserve.text();
            roomContainer.innerHTML = reserveHTML;
            flatpickr("#dateRange", {
                mode: "range",
                dateFormat: "Y-m-d"
            });
        });
    });
}

function cancelReservation(){
    document.addEventListener("click", async (e) => {
        if (e.target.matches(".cancel-reservation-button")) {
            localStorage.removeItem("selectedRoom");

            //Clear html first before fetching rooms again
            const roomContainer = document.querySelector(".rooms-container");
            roomContainer.innerHTML = "";

            //Reload rooms without reloading page
            await fetchRooms();
            //Reattach listeners
            displayMoreDetails();
            reserveRoom();
        }
    });
}
