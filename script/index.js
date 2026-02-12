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
