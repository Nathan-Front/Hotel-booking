
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


async function displayReserveRoomPage(roomData){
    const roomContainer = document.querySelector(".rooms-container");
    roomContainer.innerHTML = await loadHTML("reserve-rooms-html/reserveRoom.html");
    populateReservation(roomData);
    datePicker();
    roomPicker();
    finalStep();
    computePrice();
}

function reserveRoom(){
    const reserveBtn = document.querySelectorAll(".reserve-room-button");
    reserveBtn.forEach(btn => {
    btn.addEventListener("click", async () => {
        const wrapper = btn.closest(".reserve-section");
        const roomType = wrapper.querySelector("h3").textContent;
        const roomImage = wrapper.querySelector(".main-picture").src;
        const today = new Date().toISOString().split("T")[0];
        const originalPrice = wrapper.querySelector(".original-price").textContent;
        const percentOff = btn.closest(".price-main-wrapper")?.querySelector(".percent-off")?.textContent || "0%";

        localStorage.setItem("selectedRoom", JSON.stringify({
             type: roomType,
    image: roomImage,
    date: today,
    price: originalPrice,
    discount: percentOff,
    nights: 1,
    roomOption: 1,
    dateStart: today,
    dateEnd: today
        }));
        await displayReserveRoomPage({
             type: roomType,
    image: roomImage,
    date: today,
    price: originalPrice,
    discount: percentOff,
    nights: 1,
    roomOption: 1,
    dateStart: today,
    dateEnd: today
        });

    });
});

}

async function loadHTML(path) {
    const res = await fetch(path);
    return await res.text();
}
function populateReservation(data){
     if (!data) return;

    const wrap = document.querySelector("#reserveRoom-wrapper");
    if (!wrap) return;

    wrap.querySelector("#reserve-image").src = data.image;
    wrap.querySelector(".selected-room-type").textContent = data.type;
    wrap.querySelector(".reservation-date").textContent = data.date;
    wrap.querySelector(".price-before-discounts").textContent = data.price;
    wrap.querySelector(".special-discounts").textContent = data.discount;
    wrap.querySelector(".night-count").textContent = data.nights;
    wrap.querySelector(".room-count").textContent = data.roomOption;
    computePrice();
}

function datePicker(){
    flatpickr("#dateRange", {
        mode: "range",
        dateFormat: "Y-m-d",
        onChange: function(selectedDates, dateStr, instance) {

            if (selectedDates.length === 2) {

                const startDate = instance.formatDate(selectedDates[0], "Y-m-d");
                const endDate   = instance.formatDate(selectedDates[1], "Y-m-d");

                const diffTime = selectedDates[1] - selectedDates[0];
                const nights = diffTime / (1000 * 60 * 60 * 24);

                const roomData = JSON.parse(localStorage.getItem("selectedRoom")) || {};
                const reservedRoom = {
                    ...roomData,
                    dateStart: startDate,
                    dateEnd: endDate,
                    nights: nights
                };
                
                localStorage.setItem("selectedRoom", JSON.stringify(reservedRoom)); 
                document.querySelector(".night-count").textContent = reservedRoom.nights;
                computePrice(); 

            }
        }
    });
}

function roomPicker(){
    const roomOptions = document.querySelector("#room");
    if(!roomOptions) return;
    const roomCountDisplay = document.querySelector(".room-count");
    const initial = JSON.parse(localStorage.getItem("selectedRoom")) || {};
    roomCountDisplay.textContent = initial.roomOption || "0";
    roomOptions.addEventListener("change", async () =>{
        const current = JSON.parse(localStorage.getItem("selectedRoom")) || {};
            const updatedReservedRoom = {
            ...current,      
            roomOption: roomOptions.value
        };
        localStorage.setItem("selectedRoom", JSON.stringify(updatedReservedRoom));
        roomCountDisplay.textContent = updatedReservedRoom.roomOption;
        computePrice(); 
    });
   
}

function computePrice(){
    const selectedRoom = JSON.parse(localStorage.getItem("selectedRoom")) || {};
    const vat = document.querySelector(".vat");
    const service = document.querySelector(".service-price");
    let totalPayment = document.querySelector(".total-payment");
    let savedPrice = document.querySelector(".total-saved");

    const basePrice = Number(String(selectedRoom.price || 0).replace(/\D/g, ""));
    const roomCount = Number(selectedRoom.roomOption || 1);
    const nights = Number(selectedRoom.nights || 1);
    const discountPercent = Number(String(selectedRoom.discount || 0).replace(/\D/g, ""));
    const vatPercent = Number(vat.textContent.replace(/\D/g, ""));
    const servicePercent = Number(service.textContent.replace(/\D/g, ""));

    const roomNightsPrice = basePrice * roomCount * nights;

    const taxedPrice = roomNightsPrice * (vatPercent / 100);
    const servicePrice = roomNightsPrice * (servicePercent / 100);
    const discountPrice = roomNightsPrice * (discountPercent / 100);

    const priceTotal = roomNightsPrice + taxedPrice + servicePrice - discountPrice;
    totalPayment.textContent = priceTotal;
    savedPrice.textContent = discountPrice;
    console.log(roomNightsPrice);
    console.log(taxedPrice);
    console.log(servicePrice);
}

function finalStep(){
    const finalStepForm = document.querySelector("#final-step-form");
    if(!finalStepForm) return;
    finalStepForm.addEventListener("submit", (e)=>{
        e.preventDefault();
        const firstName = document.querySelector("#firstName");
        const familytName = document.querySelector("#lastName");
        const reserveEmail = document.querySelector("#email");
        const reservePhone = document.querySelector("#phone");
        const selectedPayment = document.querySelector('input[name="paymentMethod"]:checked');
        const selectedRoom = document.querySelector(".selected-room-type");
        const dateOfReservation = document.querySelector(".reservation-date");
        const reserveDateRange = document.querySelector("#dateRange");
        const roomCount = document.querySelector(".room-count");
        const nightCount = document.querySelector(".night-count");
        const originalPrice = document.querySelector(".price-before-discounts");
        const discount = document.querySelector(".special-discounts");
        const vat = document.querySelector(".vat");
        const service = document.querySelector(".service-price");
        const totalPayment = document.querySelector(".total-payment");

        const discountPrice = Number(originalPrice.textContent.replace(/\D/g, "")) / Number(discount.textContent.replace(/\D/g, ""));
        const taxedPrice = Number(originalPrice.textContent.replace(/\D/g, "")) / Number(vat.textContent.replace(/\D/g, ""));
        const servicePrice = Number(originalPrice.textContent.replace(/\D/g, "")) / Number(service.textContent.replace(/\D/g, ""));

        const saved = document.querySelector(".total-saved");
        alert(`
            Reservation Summary:
            First Name: ${firstName.value}
            Family Name: ${familytName.value}
            Email: ${reserveEmail.value}
            Phone: ${reservePhone.value}
            Payment: ${selectedPayment.value}
            Room: ${selectedRoom.textContent}
            Reservation Date: ${dateOfReservation.textContent}
            Date Range: ${reserveDateRange.value}
            Room Count: ${roomCount.textContent}
            Night Count: ${nightCount.textContent}
            Original Price: ${originalPrice.textContent}
            Discount: ${discount.textContent}
            VAT: ${vat.textContent}
            Service Fee: ${service.textContent}
            Total Payment: ${totalPayment.textContent}
            Saved: ${saved.textContent}
        `);
        finalStepForm.reset();
    });
        
}

function cancelReservation(){
    document.addEventListener("click", async (e) => {
        if (e.target.matches(".cancel-reservation-button")) {
            localStorage.removeItem("selectedRoom");
            localStorage.removeItem("selectedRoomImage");
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



async function initAsync() {
    const roomContainer = document.querySelector(".rooms-container");
    const savedRoom = localStorage.getItem("selectedRoom");

    if (savedRoom) {
        roomContainer.innerHTML = await loadHTML("reserve-rooms-html/reserveRoom.html");
        populateReservation(JSON.parse(savedRoom));
        datePicker();
        roomPicker();
        finalStep();
        computePrice();
       
     } else {
        await fetchRooms();
        displayMoreDetails();
        reserveRoom();
    }
    scrollHash();
    cancelReservation();
    
   
}
document.addEventListener("DOMContentLoaded", initAsync);