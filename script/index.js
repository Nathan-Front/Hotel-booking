async function fetchNavbar(){
  const body = document.body;

  //Navigation
  const res = await fetch("navigation.html");
  const navHTML = await res.text();
  body.insertAdjacentHTML("afterbegin", navHTML);

  //footer
  const footerRes = await fetch("footer.html");
  const footerHTML = await footerRes.text();
  body.insertAdjacentHTML("beforeend", footerHTML);

  //alright
  const alrightRes = await fetch("alright.html");
  const alrightHTML = await alrightRes.text();
  body.insertAdjacentHTML("beforeend", alrightHTML);

  //If mobileviewport
  if (window.innerWidth <= 540) {
   const resMobile = await fetch("mobileNavigation.html");
   const mobileNavHTML = await resMobile.text();
   document.body.insertAdjacentHTML("beforeend", mobileNavHTML);
  }
}

async function fetchIndexContent() {
  const main = document.querySelector(".index-main-wrapper");
  if (!main) return;
  const resFirst = await fetch("./index-html/firstSection.html");
  const firstSectionHTML = await resFirst.text();
  main.insertAdjacentHTML("afterbegin", firstSectionHTML);

  const resSecond = await fetch("./index-html/secondSection.html");
  const secondSectionHTML = await resSecond.text();
  main.insertAdjacentHTML("beforeend", secondSectionHTML);

  const resThird = await fetch("./index-html/thirdSection.html");
  const thirdSectionHTML = await resThird.text();
  main.insertAdjacentHTML("beforeend", thirdSectionHTML);

  const resFourth = await fetch("./index-html/fourthSection.html");
  const fourthSectionHTML = await resFourth.text();
  main.insertAdjacentHTML("beforeend", fourthSectionHTML);

  const resFifth = await fetch("./index-html/fifthSection.html");
  const fifthSectionHTML = await resFifth.text();
  main.insertAdjacentHTML("beforeend", fifthSectionHTML);
}


function animateFirstSectionImage(){
  //Animate first section images
  let firstSectionImages = document.querySelectorAll(".room-image");
  if (firstSectionImages.length === 0) return null;
  let currentImageIndex = 0;
  firstSectionImages[currentImageIndex].classList.add("active");
  
  function firstSectionImagesAnimation() {
    const current = firstSectionImages[currentImageIndex];
    current.classList.remove("active");
    current.classList.add("exit");
    currentImageIndex = (currentImageIndex + 1) % firstSectionImages.length;
    const next = firstSectionImages[currentImageIndex];
    next.classList.remove("exit");
    next.classList.add("active");
    //Clean up old exit state
    setTimeout(() => {
      current.classList.remove("exit");
    }, 600);
  }
  setInterval(firstSectionImagesAnimation, 5000);
}

function goToReservationHtml(){
  const reservationBtn = document.querySelector(".book-button");
  if(!reservationBtn) return;
  reservationBtn.addEventListener("click", () => {
    window.location.href = "reserve.html";
  });
}
function goToAboutHtml(){
  const aboutBtn = document.querySelector(".to-about-us-button");
  if(!aboutBtn) return;
  aboutBtn.addEventListener("click", () => {
    window.location.href = "about.html";
  });
}

let visibleGalleryImages;
function initialGalleryImage(){
  if(window.innerWidth <= 540){
    visibleGalleryImages = 2;
  } else if(window.innerWidth <= 768){
    visibleGalleryImages = 3;
  } else{
    visibleGalleryImages = 4;
  }
}
initialGalleryImage();
let currentIndex = 0; 
function updateGallery(){
  const galleryWrapper = document.querySelector(".gallery-wrapper");
  const galleryImages = document.querySelectorAll(".gallery-image");
  if(!galleryWrapper) return;
  const container = document.querySelector(".gallery-main-wrapper");
  const maxTranslate = galleryWrapper.scrollWidth - container.clientWidth;

  const {fullWidth} = getGalleryWrapperWidth();
  let translate = currentIndex * fullWidth;

  if (translate > maxTranslate) {
    translate = maxTranslate;
  }
  galleryWrapper.style.transform = `translateX(-${translate}px)`;
  updateGalleryDots();
}
window.addEventListener("load", () => {
  updateGallery();
});
window.addEventListener("resize", () => {
  updateGallery();
  initialGalleryImage();
    const galleryWrapper = document.querySelector(".gallery-wrapper");
  const galleryImages = document.querySelectorAll(".gallery-image");
  const maxIndex = galleryImages.length - visibleGalleryImages;
  if(currentIndex > maxIndex){
    currentIndex = maxIndex;
  }

  updateGallery();
});

function prevNextButtons(){
  const prevBtn = document.querySelector(".prev");
  const nextBtn = document.querySelector(".next");
  const galleryImages = document.querySelectorAll(".gallery-image");

  if(!prevBtn || !nextBtn || galleryImages.length === 0) return;

  const galleryMaxIndex = galleryImages.length - visibleGalleryImages;

  nextBtn.addEventListener("click", () => {
    if(currentIndex >= galleryMaxIndex){
      currentIndex = 0;
    } else {
      currentIndex++;
    }
    updateGallery();
  });

  prevBtn.addEventListener("click", () => {
    if(currentIndex <= 0){
      currentIndex = galleryMaxIndex;
    } else {
      currentIndex--;
    }
    updateGallery();
  });
}


function getGalleryWrapperWidth(){
  const galleryWrapper = document.querySelector(".gallery-wrapper");
  const galleryImages = document.querySelectorAll(".gallery-image");
  if (galleryImages.length === 0) return;
  const gallerMainWrapper = document.querySelector(".gallery-main-wrapper");
  const viewportWidth = Array.from(galleryImages);
  if(!galleryWrapper || !galleryImages.length === 0 || !viewportWidth) return null;
  const gallerySlide = galleryImages[0];
  const slideRect = gallerySlide.getBoundingClientRect();
  const style = getComputedStyle(gallerySlide);
  const marginRight = parseFloat(style.marginRight);
  const marginLeft = parseFloat(style.marginLeft);
  const perSlideWidth = slideRect.width;
  const wrapperWidth = gallerMainWrapper.getBoundingClientRect().width;
  const containerWidth = getComputedStyle(galleryWrapper);
  let gap = parseFloat(containerWidth.gap) || 0;
  if(containerWidth.gap.includes("%")){
    gap = wrapperWidth * (parseFloat(containerWidth.gap) / 100);
  }
  const fullWidth = perSlideWidth + marginRight + marginLeft + gap;
  return {fullWidth, perSlideWidth, wrapperWidth};
}

function galleryDots(){
  const galleryDot = document.querySelector(".slider-dots");
  const galleryImages = document.querySelectorAll(".gallery-image");
  if(!galleryDot || galleryImages.length === 0) return;
  galleryDot.innerHTML = "";
  const totalDots = galleryImages.length - visibleGalleryImages + 2;
  for(let i = 0; i < totalDots ; i++){
    const dot = document.createElement("button");
    dot.addEventListener("click", () =>{
      if(window.innerWidth > 540) return;
      currentIndex = i;
      updateGallery();
    });
    galleryDot.appendChild(dot);
  }
  updateGalleryDots();
}


function updateGalleryDots(){
  const galleryDot = document.querySelector(".slider-dots");
  if (!galleryDot) return;
  const dots = galleryDot.querySelectorAll("button");
  dots.forEach((dot, index) => {
    dot.classList.toggle("galleryActive", index === currentIndex);
  });
}


function galleryMobileTouch(){
  const galleryContainer = document.querySelector(".gallery-wrapper");
  const gallerySlide = document.querySelectorAll(".gallery-image");
  let index = 0;
  let startX = 0;
  let isDragging = false;
  let currentTranslate = 0;
  const sizes = getGalleryWrapperWidth();
  if (!sizes) return;

  const { fullWidth, perSlideWidth, wrapperWidth } = sizes;
  if(!galleryContainer || !gallerySlide || !fullWidth || !perSlideWidth || !wrapperWidth) return;

  /*function updateGallerySlides(){
    const container = document.querySelector(".gallery-main-wrapper");
    if(!container) return;

    const centerOffset = (wrapperWidth - perSlideWidth) / 2;
    let translate = currentIndex * fullWidth - centerOffset;

    const maxTranslate = galleryContainer.scrollWidth - container.clientWidth;

    if (translate < 0) translate = 0;
    if (translate > maxTranslate) translate = maxTranslate;

    galleryContainer.style.transform = `translateX(-${translate}px)`;
  }*/
  galleryContainer.addEventListener("touchstart", (e) =>{
    startX = e.touches[0].clientX;
    isDragging = true;},
    {passive: true}
  );
  galleryContainer.addEventListener("touchmove", (e) =>{
    if(!isDragging)return;},
    {passive: true}
  );
  galleryContainer.addEventListener("touchend", (e) =>{
    if(!isDragging)return;
    const endX = e.changedTouches[0].clientX;
    const diff = endX - startX;
    if(diff > 50){
      currentIndex = currentIndex === 0 ? gallerySlide.length -1: currentIndex - 1;
    }else if (diff < -50){
      currentIndex = (currentIndex + 1) % gallerySlide.length;
    }
    updateGallery();
   // updateGallerySlides();
    isDragging = false;
    updateGalleryDots();
  });
}

function submitForm(){
  const form = document.querySelector("#message-form");
  if(!form) return;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = form.querySelector("input[name='Iname']").value;
    const email = form.querySelector("input[name='Iemail']").value;
    const tel = form.querySelector("input[name='Itel']").value;
    const message = form.querySelector("textarea[name='message']").value;
    alert("Message sent successfully! Thank you for your message.");
    localStorage.setItem("messageForm", JSON.stringify({ name, email, tel, message }));
    form.reset();
  });
}

function subscribeToNewsletter(){
    const subscribeBtn = document.querySelector(".subscribe-button");
    if (!subscribeBtn) return;
    subscribeBtn.addEventListener("click", (e) => {
      e.preventDefault();
        const emailInput = document.querySelector(".subscribe-input");
        const email = emailInput.value.trim().toLowerCase();
        const uEmail = JSON.parse(localStorage.getItem("subscribedEmail")) || [];
        const alreadyExist = uEmail.some(subscribe => subscribe.subscriber?.toLowerCase() === email);
        if(alreadyExist){
          alert("Currently subscribed with this email.");
          emailInput.value = "";
          return;
        }
        if(email){
            alert("Thank you for subscribing!");
            uEmail.push({subscriber: email});
            localStorage.setItem("subscribedEmail", JSON.stringify(uEmail));
            emailInput.value = "";
        } else {
            alert("Please enter a valid email address.");
        }
    });
}


async function initAsync() {
  await fetchNavbar();
  await fetchIndexContent();
  animateFirstSectionImage();
  goToReservationHtml();
  goToAboutHtml();
  initialGalleryImage();
  galleryDots();
  prevNextButtons();
  galleryMobileTouch();
  updateGallery();
  updateGalleryDots();
  submitForm();
  subscribeToNewsletter();
}
document.addEventListener("DOMContentLoaded", initAsync);


