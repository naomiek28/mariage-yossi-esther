const openEnvelope = document.getElementById("openEnvelope");
const weddingMusic = document.getElementById("weddingMusic");
const musicToggle = document.getElementById("musicToggle");
const calendarLink = document.getElementById("calendarLink");
const rsvpForm = document.getElementById("rsvpForm");

let invitationOpened = false;

function updateMusicButton() {
  if (!musicToggle || !weddingMusic) return;
  musicToggle.textContent = weddingMusic.paused ? "♫" : "Ⅱ";
}

function playMusic() {
  if (!weddingMusic) return;

  weddingMusic.volume = 0.45;
  weddingMusic.play().then(updateMusicButton).catch(() => {
    updateMusicButton();
  });
}

function openInvitation() {
  if (invitationOpened) return;

  invitationOpened = true;

  if (openEnvelope) {
    openEnvelope.disabled = true;
  }

  document.body.classList.add("invitation-open");
  window.scrollTo(0, 0);
  playMusic();
}

if (openEnvelope) {
  openEnvelope.addEventListener("click", openInvitation);

  openEnvelope.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openInvitation();
    }
  });
}

if (musicToggle && weddingMusic) {
  musicToggle.addEventListener("click", () => {
    if (weddingMusic.paused) {
      playMusic();
    } else {
      weddingMusic.pause();
      updateMusicButton();
    }
  });
}

function createGoogleCalendarLink() {
  if (!calendarLink) return;

  const title = encodeURIComponent("Mariage Esther & Yossi");
  const location = encodeURIComponent("Salle Ora, Jérusalem, Israël");
  const details = encodeURIComponent("Houppa, Kabalat Panim et célébration du mariage d'Esther et Yossi.");

  const start = "20261028T180000";
  const end = "20261028T230000";

  calendarLink.href =
    "https://calendar.google.com/calendar/render?action=TEMPLATE" +
    `&text=${title}` +
    `&dates=${start}/${end}` +
    `&details=${details}` +
    `&location=${location}`;
}

function updateCountdown() {
  const weddingDate = new Date("2026-10-28T18:00:00").getTime();
  const now = new Date().getTime();
  const distance = weddingDate - now;

  const countdown = document.getElementById("countdown");

  if (!countdown) return;

  if (distance <= 0) {
    countdown.innerHTML = "<p class='normal-text'>Aujourd'hui est le grand jour</p>";
    return;
  }

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((distance / (1000 * 60)) % 60);
  const seconds = Math.floor((distance / 1000) % 60);

  document.getElementById("days").textContent = String(days).padStart(2, "0");
  document.getElementById("hours").textContent = String(hours).padStart(2, "0");
  document.getElementById("minutes").textContent = String(minutes).padStart(2, "0");
  document.getElementById("seconds").textContent = String(seconds).padStart(2, "0");
}

if (rsvpForm) {
  rsvpForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = document.getElementById("guestName").value.trim();
    const count = document.getElementById("guestCount").value;
    const message = document.getElementById("guestMessage").value.trim();

    const text =
      `Bonjour, je confirme ma présence au mariage d'Esther & Yossi.%0A` +
      `Nom : ${encodeURIComponent(name || "Non précisé")}%0A` +
      `Nombre de personnes : ${encodeURIComponent(count)}%0A` +
      `Mot pour les mariés : ${encodeURIComponent(message || "Aucun message")}`;

    window.open(`https://wa.me/972534235534?text=${text}`, "_blank");
  });
}

createGoogleCalendarLink();
updateCountdown();
setInterval(updateCountdown, 1000);
updateMusicButton();
function setupScrollReveal() {
  const elements = document.querySelectorAll(".arch-card, .text-card, .logo-separator");

  elements.forEach((element) => {
    element.classList.add("reveal-on-scroll");
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.18,
      rootMargin: "0px 0px -8% 0px",
    }
  );

  elements.forEach((element) => {
    observer.observe(element);
  });
}

setupScrollReveal();