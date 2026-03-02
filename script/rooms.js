
async function fetchRoomsPrice(){
  const mainWrapper = document.querySelector(".rooms-main-wrapper");

  const resAvailability = await fetch("./rooms-html/checkAvailability.html");
  const checkAvaialbleHTML = await resAvailability.text();
  mainWrapper.insertAdjacentHTML("afterbegin", checkAvaialbleHTML);

  const resRoomsPrice = await fetch("./rooms-html/rooms-price.html");
  const roomsPriceHTML = await resRoomsPrice.text();
  mainWrapper.insertAdjacentHTML("beforeend", roomsPriceHTML);

  const resMostBooked = await fetch("./rooms-html/most-booked.html");
  const mostBookedHTML = await resMostBooked.text();
  mainWrapper.insertAdjacentHTML("beforeend", mostBookedHTML);

  const resFAQ = await fetch("./rooms-html/FAQ.html");
  const FAQHTML = await resFAQ.text();
  mainWrapper.insertAdjacentHTML("beforeend", FAQHTML);
}
async function initAsync() {
  await fetchRoomsPrice();
  reservationInputDisplay();
  accordionFAQ();
  getReservationCount();
 checkRooms();
}
document.addEventListener("DOMContentLoaded", initAsync);

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

function checkRoomAvailable(){
  const rooms = document.getElementById("rooms-form");
  if(!rooms) return;
  rooms.addEventListener("submit", (e) => {
    e.preventDefault();
    const checkInDate = document.getElementById("checkin").value;
    const checkOutDate = document.getElementById("checkout").value;
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const today = new Date();
    if (checkIn < today || checkOut < today) {
      alert("Please select a valid date. The date cannot be in the past.");
      return;
    }

    if (checkIn >= checkOut) {
      alert("Check-out date must be after check-in date.");
      return;
    }
    alert("Rooms are available on the selected dates you selected! Please proceed to the next step to complete your reservation.");
  });
}

function checkAvailability(checkIn, checkOut) {
  // Example: already booked date ranges
  const bookedDates = [
    { start: "2026-03-10", end: "2026-03-15" },
    { start: "2026-03-20", end: "2026-03-25" }
  ];

  const requestedStart = new Date(checkIn);
  const requestedEnd = new Date(checkOut);

  for (let booking of bookedDates) {
    const bookedStart = new Date(booking.start);
    const bookedEnd = new Date(booking.end);

    // Check if dates overlap
    if (
      requestedStart < bookedEnd &&
      requestedEnd > bookedStart
    ) {
      return false; // Not available
    }
  }

  return true; // Available
}

function checkRooms(){
  document
  .getElementById("rooms-form")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    const checkIn = document.getElementById("checkin").value;
    const checkOut = document.getElementById("checkout").value;
   // const result = document.getElementById("availability-result");

    if (!checkIn || !checkOut) {
      alert("Please select both dates.");
      return;
    }

    if (new Date(checkIn) >= new Date(checkOut)) {
      alert("Check-out must be after check-in.");

      return;
    }

    const available = checkAvailability(checkIn, checkOut);

    if (available) {
      alert("Rooms are available!");
    } else {
      alert("We are so sorry, no room is available for the selected dates.");
    }
  });
}
