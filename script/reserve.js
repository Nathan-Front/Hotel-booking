
function displayOtherRooms(){
    const showMore = document.querySelector(".more-rooms");
    const rooms = document.querySelector(".section-sub-wrapper");
    showMore.addEventListener("click", ()=>{
        if (rooms.classList.contains("show-other-rooms")) {
            // collapse
            rooms.style.height = rooms.scrollHeight + "px";
            requestAnimationFrame(() => {
                rooms.style.height = "450px";
            });
            rooms.classList.remove("show-other-rooms");
        } else {
            // expand
            rooms.style.height = rooms.scrollHeight + "px";

            rooms.addEventListener("transitionend", function handler() {
                rooms.style.height = "auto";
                rooms.removeEventListener("transitionend", handler);
            });
             rooms.classList.toggle("show-other-rooms");
        }
    });
}
displayOtherRooms();