(() => {
  "use strict";

  const starField = document.getElementById("starField");
  const enterButton = document.getElementById("enterGarden");
  const giftButton = document.getElementById("openGift");
  const giftReveal = document.getElementById("giftReveal");
  const giftLabel = document.getElementById("giftLabel");
  const againButton = document.getElementById("againButton");
  const soundToggle = document.getElementById("soundToggle");
  const soundLabel = document.getElementById("soundLabel");
  const toast = document.getElementById("toast");
  let toastTimer;
  const siteMusic = document.getElementById("siteMusic");

  // Build a lightweight star field without images or external libraries.
  if (starField) {
    const fragment = document.createDocumentFragment();
    const count = window.innerWidth < 700 ? 72 : 115;
    for (let i = 0; i < count; i++) {
      const star = document.createElement("span");
      star.className = "star";
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;
      star.style.setProperty("--duration", `${2.2 + Math.random() * 4.8}s`);
      star.style.setProperty("--delay", `${Math.random() * -6}s`);
      if (Math.random() > 0.83) {
        star.style.width = "3px";
        star.style.height = "3px";
      }
      fragment.appendChild(star);
    }
    starField.appendChild(fragment);
  }

  // Reveal sections as they enter the viewport.
  const revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach(item => observer.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add("visible"));
  }
  // Ensure the first screen is visible immediately.
  document.querySelectorAll(".hero .reveal").forEach(item => item.classList.add("visible"));

  // Navigate between separate screens; never require scrolling to reach the next section.
  const pages = Array.from(document.querySelectorAll(".story-page"));
  function goToPage(index) {
    const target = Math.max(0, Math.min(pages.length - 1, Number(index)));
    pages.forEach((page, i) => {
      const active = i === target;
      page.hidden = !active;
      page.classList.toggle("active", active);
      page.setAttribute("aria-hidden", String(!active));
    });
    window.scrollTo({ top: 0, behavior: "auto" });
    const current = pages[target];
    if (current) current.querySelectorAll(".reveal").forEach(item => item.classList.add("visible"));
  }
  document.querySelectorAll("[data-go]").forEach(button => {
    button.addEventListener("click", () => {
      goToPage(button.getAttribute("data-go"));
      if (button.classList.contains("page-next") && Number(button.dataset.go) === 1) {
        showToast("به باغ جادویی خوش آمدی ✨");
      }
    });
  });
  enterButton?.addEventListener("click", () => {
    goToPage(1);
    showToast("به باغ جادویی خوش آمدی ✨");
  });
  document.getElementById("brandHome")?.addEventListener("click", event => {
    event.preventDefault();
    goToPage(0);
  });
  document.getElementById("backToHome")?.addEventListener("click", event => {
    event.preventDefault();
    goToPage(0);
  });
  goToPage(0);

  giftButton?.addEventListener("click", () => {
    if (giftButton.classList.contains("opened")) return;
    giftButton.classList.add("opened");
    giftButton.setAttribute("aria-expanded", "true");
    giftLabel.textContent = "جادو در حال شکفتن است...";
    giftButton.disabled = true;
    window.setTimeout(() => {
      giftReveal.hidden = false;
      giftLabel.textContent = "هدیه‌ات باز شد ✨";
      giftButton.disabled = false;
      sprinkleConfetti();
    }, 700);
  });

  againButton?.addEventListener("click", () => {
    giftReveal.hidden = true;
    giftButton.classList.remove("opened");
    giftButton.setAttribute("aria-expanded", "false");
    giftLabel.textContent = "لمس کن تا هدیه باز شود";
  });

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove("show"), 2600);
  }

  function sprinkleConfetti() {
    const colors = ["#f4c9e3", "#f2d39a", "#d8b8f2", "#fff0d0"];
    for (let i = 0; i < 26; i++) {
      const piece = document.createElement("span");
      piece.textContent = Math.random() > 0.5 ? "✦" : "✧";
      piece.style.position = "fixed";
      piece.style.zIndex = "15";
      piece.style.pointerEvents = "none";
      piece.style.left = `${20 + Math.random() * 60}%`;
      piece.style.top = `${40 + Math.random() * 20}%`;
      piece.style.color = colors[Math.floor(Math.random() * colors.length)];
      piece.style.fontSize = `${10 + Math.random() * 14}px`;
      piece.style.opacity = "0";
      piece.style.transition = `transform ${1.1 + Math.random() * 1.2}s ease-out, opacity 1.3s ease`;
      document.body.appendChild(piece);
      requestAnimationFrame(() => {
        piece.style.opacity = "1";
        piece.style.transform = `translate(${(Math.random() - 0.5) * 280}px, ${-80 - Math.random() * 250}px) rotate(${Math.random() * 240}deg)`;
      });
      window.setTimeout(() => {
        piece.style.opacity = "0";
        window.setTimeout(() => piece.remove(), 350);
      }, 1300);
    }
  }

  // Play the uploaded song only after the visitor taps the music button.
  soundToggle?.addEventListener("click", async () => {
    if (!siteMusic) return;
    if (siteMusic.paused) {
      try {
        await siteMusic.play();
        soundToggle.setAttribute("aria-pressed", "true");
        if (soundLabel) soundLabel.textContent = "توقف آهنگ";
      } catch (error) {
        showToast("پخش آهنگ انجام نشد؛ فایل آهنگ را کنار index.html قرار بده.");
      }
    } else {
      siteMusic.pause();
      soundToggle.setAttribute("aria-pressed", "false");
      if (soundLabel) soundLabel.textContent = "پخش آهنگ";
    }
  });

  siteMusic?.addEventListener("ended", () => {
    soundToggle?.setAttribute("aria-pressed", "false");
    if (soundLabel) soundLabel.textContent = "پخش آهنگ";
  });

})();
