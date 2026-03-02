
async function fetchContactInfo(){
    const main = document.querySelector(".contact-main-wrapper");

    const resForm = await fetch("./index-html/fifthSection.html");
    const formHTML = await resForm.text();
    main.insertAdjacentHTML("beforeend", formHTML);

    const resReview = await fetch("./contact-html/customerReview.html");
    const reviewHTML = await resReview.text();
    main.insertAdjacentHTML("beforeend", reviewHTML);

    const resReserve = await fetch("./reservation-button-html/reservationBtn.html");
    const reserveHTML = await resReserve.text();
    main.insertAdjacentHTML("beforeend", reserveHTML);
}


let vissibleReview = 0;
function initializeReviewCarousel(){
    if(window.innerWidth <= 599){
        vissibleReview = 1;
    }else if(window.innerWidth <= 768){
        vissibleReview = 2;
    }else{
        vissibleReview = 3;
    }
}
let reviewIndex = 0;
function updateReviewCarousel(){
    const reviewWrapper = document.querySelector(".review-carousel-wrapper");
    if(!reviewWrapper) return;
    const { fullWidth } = getReviewFullWrapperWidth();
    if (!fullWidth) return;
    reviewWrapper.style.justifyContent = "flex-start";
    const translateX = reviewIndex * fullWidth;
    reviewWrapper.style.transform = `translateX(-${translateX}px)`;
    updateReviewDots();
}



function prevNextReview(){
    const prevBtn = document.querySelector(".prevRev");
    const nextBtn = document.querySelector(".nextRev");
    const reviewItems = document.querySelectorAll(".review-carousel-items");
    if(!prevBtn || !nextBtn || reviewItems.length === 0) return;
    const maxIndex = reviewItems.length - vissibleReview;
    nextBtn.addEventListener("click", () => {
        reviewIndex++;
        if(reviewIndex > maxIndex){
            reviewIndex = 0;
        }
        updateReviewCarousel();
    });
    prevBtn.addEventListener("click", () => {
        reviewIndex--;
        if(reviewIndex < 0){
            reviewIndex = maxIndex;
        }
        updateReviewCarousel();
    });
}


function getReviewFullWrapperWidth(){
    const reviewMainWrap = document.querySelector(".review-carousel-main-wrap");
    const reviewWrapper = document.querySelector(".review-carousel-wrapper");
    const reviewItems = document.querySelectorAll(".review-carousel-items");
    if(!reviewMainWrap || !reviewWrapper || reviewItems.length === 0) return;
    const viewportWidth = Array.from(reviewItems);
    if(!viewportWidth) return null;
    const reviewSLides = reviewItems[0];
    const slideRect = reviewSLides.getBoundingClientRect();
    const style = getComputedStyle(reviewSLides);
    const marginRight = parseFloat(style.marginRight);
    const marginLeft = parseFloat(style.marginLeft);
    const perSideWidth = slideRect.width;
    const wrapperWidth = reviewMainWrap.getBoundingClientRect().width;
    const containerWidth = getComputedStyle(reviewWrapper);
    let gap = parseFloat(containerWidth.gap) || 0;
    if(containerWidth.gap.includes("%")){
        gap = wrapperWidth * (parseFloat(containerWidth.gap) / 100);
    }
    const fullWidth = perSideWidth + marginRight + marginLeft + gap;
    return {fullWidth, perSideWidth, wrapperWidth};
}

function reviewDots(){
    const revDots = document.querySelector(".review-dots");
    const reviewItems = document.querySelectorAll(".review-carousel-items");
    if(!revDots || reviewItems.length === 0) return;
    revDots.innerHTML = "";
    let totalDots = reviewItems.length - vissibleReview + 1;
   
    for(let i = 0; i < totalDots; i++){
        const dot = document.createElement("button");
        dot.addEventListener("click", () =>{
            reviewIndex = i;
            updateReviewCarousel();       
        });
        revDots.appendChild(dot);
    }
    updateReviewDots();
}

function updateReviewDots(){
    const revDots = document.querySelector(".review-dots");
    if(!revDots) return;
    const dots = revDots.querySelectorAll("button");
    dots.forEach((dot, index) => {
        if(index === reviewIndex){
            dot.classList.add("review-Active");
        }else{
            dot.classList.remove("review-Active");
        }
    });
}
window.addEventListener("resize", () => {
    initializeReviewCarousel();
    reviewDots();
    updateReviewCarousel();
});


function enableTouchSwipe() {
    if (window.innerWidth > 599) return; 

    const reviewWrapper = document.querySelector(".review-carousel-wrapper");
    const reviewItems = document.querySelectorAll(".review-carousel-items");
    if (!reviewWrapper || reviewItems.length === 0) return;

    let startX = 0;
    let currentTranslate = 0;
    let isDragging = false;

    const maxIndex = reviewItems.length - vissibleReview;
    reviewWrapper.addEventListener("touchstart", (e) => {
        startX = e.touches[0].clientX;
        isDragging = true;
        reviewWrapper.style.transition = "none"; 
    });
    reviewWrapper.addEventListener("touchmove", (e) => {
        if (!isDragging) return;
        const currentX = e.touches[0].clientX;
        const diff = currentX - startX;
        const { fullWidth } = getReviewFullWrapperWidth();
        currentTranslate = -(reviewIndex * fullWidth) + diff;
        reviewWrapper.style.transform = `translateX(${currentTranslate}px)`;
    });

    reviewWrapper.addEventListener("touchend", (e) => {
        if (!isDragging) return;
        isDragging = false;
        const endX = e.changedTouches[0].clientX;
        const diff = endX - startX;
        reviewWrapper.style.transition = "transform 0.4s ease";
        //minimum swipe distance
         if (diff > 50) {
            reviewIndex--;
            if (reviewIndex < 0) {
                reviewIndex = maxIndex; 
            }
        } else if (diff < -50) {
            reviewIndex++;
            if (reviewIndex > maxIndex) {
                reviewIndex = 0;
            }
        }

        updateReviewCarousel();
    });
}
async function initAsync() {
    await fetchContactInfo();
    initializeReviewCarousel();
    prevNextReview();
    updateReviewCarousel();
    reviewDots();
    updateReviewDots();
    enableTouchSwipe();
}
document.addEventListener("DOMContentLoaded", initAsync);