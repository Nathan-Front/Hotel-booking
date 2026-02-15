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

let firstSectionImages = document.querySelectorAll(".room-image");
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

  // Clean up old exit state
  setTimeout(() => {
    current.classList.remove("exit");
  }, 600);
}

setInterval(firstSectionImagesAnimation, 8000);

const galleryWrapper = document.querySelector(".gallery-wrapper");
const galleryImages = document.querySelectorAll(".gallery-image");
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


window.addEventListener("resize", () => {
  updateGallery();
  initialGalleryImage();
  const maxIndex = galleryImages.length - visibleGalleryImages;
  if(currentIndex > maxIndex){
    currentIndex = maxIndex;
  }

  updateGallery();
});

function prevNextButtons(){
  const prevBtn = document.querySelector(".prev");
  const nextBtn = document.querySelector(".next");
  if(!prevBtn || !nextBtn) return;
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
prevNextButtons();

function getGalleryWrapperWidth(){
  const gallerMainWrapper = document.querySelector(".gallery-main-wrapper");
  const viewportWidth = Array.from(galleryImages);
  if(!galleryWrapper || !galleryImages || !viewportWidth) return null;
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
  return {fullWidth, perSlideWidth};
}

function mobileTouchCarousel(){

}

const galleryDot = document.querySelector(".slider-dots");
function galleryDots(){
  if(!galleryDots) return;
  galleryDots.innerHTML = "";
  for(let i = 0; i < galleryImages.length; i++){
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
document.addEventListener("DOMContentLoaded", galleryDots);

function updateGalleryDots(){
  const dots = galleryDot.querySelectorAll("button");
  if(!dots) return;
  dots.forEach((dot, gallery) => {
    dot.classList.toggle("galleryActive", gallery === currentIndex);
  });
}
window.addEventListener("load", ()=>{
  if(!galleryDot) return;
  updateGalleryDots();
});