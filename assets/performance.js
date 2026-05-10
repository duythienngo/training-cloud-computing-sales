let scrollSettleTimer = 0;

window.addEventListener("scroll", () => {
  document.body.classList.add("is-scrolling");
  window.clearTimeout(scrollSettleTimer);
  scrollSettleTimer = window.setTimeout(() => {
    document.body.classList.remove("is-scrolling");
  }, 140);
}, { passive: true });

function initImageLightbox() {
  if (document.querySelector(".image-lightbox")) return;

  const images = [...document.querySelectorAll("img:not([data-no-lightbox])")];
  if (!images.length) return;

  const lightbox = document.createElement("div");
  lightbox.className = "image-lightbox";
  lightbox.setAttribute("role", "dialog");
  lightbox.setAttribute("aria-modal", "true");
  lightbox.setAttribute("aria-label", "Xem ảnh phóng lớn");
  lightbox.innerHTML = `
    <button class="image-lightbox-close" type="button" aria-label="Đóng ảnh phóng lớn">×</button>
    <figure class="image-lightbox-frame">
      <img class="image-lightbox-img" alt="">
      <figcaption class="image-lightbox-caption"></figcaption>
    </figure>
  `;

  document.body.appendChild(lightbox);

  const lightboxImg = lightbox.querySelector(".image-lightbox-img");
  const caption = lightbox.querySelector(".image-lightbox-caption");
  const closeBtn = lightbox.querySelector(".image-lightbox-close");
  let activeTrigger = null;

  function closeLightbox() {
    lightbox.classList.remove("open");
    document.body.classList.remove("lightbox-open");
    lightboxImg.removeAttribute("src");
    lightboxImg.alt = "";
    caption.textContent = "";
    activeTrigger?.focus();
    activeTrigger = null;
  }

  function openLightbox(image) {
    activeTrigger = image;
    const figcaption = image.closest("figure")?.querySelector("figcaption");
    const label = image.alt || figcaption?.textContent?.trim() || "";

    lightboxImg.src = image.currentSrc || image.src;
    lightboxImg.alt = label;
    caption.textContent = label;
    caption.hidden = !label;
    document.body.classList.add("lightbox-open");
    lightbox.classList.add("open");
    closeBtn.focus();
  }

  images.forEach((image) => {
    image.classList.add("lightbox-trigger");
    image.setAttribute("tabindex", "0");
    image.setAttribute("role", "button");
    image.setAttribute("aria-label", image.alt ? `Phóng lớn ảnh: ${image.alt}` : "Phóng lớn ảnh");

    image.addEventListener("click", () => openLightbox(image));
    image.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openLightbox(image);
      }
    });
  });

  closeBtn.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && lightbox.classList.contains("open")) {
      closeLightbox();
    }
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initImageLightbox);
} else {
  initImageLightbox();
}
