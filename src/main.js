import "./scss/main.scss";

const btn = document.querySelector(".js-pulse");
if (btn) {
  btn.addEventListener("click", () => {
    btn.classList.remove("is-pulsing");
    void btn.offsetWidth; // reflow för att trigga animation igen
    btn.classList.add("is-pulsing");
  });
}