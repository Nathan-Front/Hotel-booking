async function leadershipHTML(){
  const aboutContainer = document.querySelector(".about-main-wrapper");

  const resAboutBanner = await fetch("./about-us-html/aboutBanner.html");
  const aboutBannerHTML = await resAboutBanner.text();
  aboutContainer.insertAdjacentHTML("afterbegin", aboutBannerHTML);

  const resLead = await fetch("./about-us-html/leadership.html");
  const leadHTML = await resLead.text();
  aboutContainer.insertAdjacentHTML("beforeend", leadHTML);

  const resTimeline = await fetch("./about-us-html/timeline.html");
  const timelineHTML = await resTimeline.text();
  aboutContainer.insertAdjacentHTML("beforeend", timelineHTML);

  const resResBtn = await fetch("./reservation-button-html/reservationBtn.html");
  const resBtnHTML = await resResBtn.text();
  aboutContainer.insertAdjacentHTML("beforeend", resBtnHTML);
}

async function initAsync() {
  await leadershipHTML();
}
document.addEventListener("DOMContentLoaded", initAsync);