import "./scss/main.scss";

const btn = document.querySelector(".js-pulse");
if (btn) {
  btn.addEventListener("click", () => {
    btn.classList.remove("is-pulsing");
    void btn.offsetWidth; // reflow för att trigga animation igen
    btn.classList.add("is-pulsing");
  });
}

const toggle = document.querySelector(".nav-toggle");
const nav = document.querySelector("#mainNav");

if (toggle && nav) {
  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  // Stäng menyn när man klickar en länk (bra på mobil)
  nav.addEventListener("click", (e) => {
    if (e.target.tagName === "A") {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    }
  });
}