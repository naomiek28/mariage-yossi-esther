const openEnvelope = document.getElementById("openEnvelope");
const weddingMusic = document.getElementById("weddingMusic");
const musicToggle = document.getElementById("musicToggle");
const calendarLink = document.getElementById("calendarLink");
const calendarLinkHe = document.getElementById("calendarLinkHe");
const rsvpForm = document.getElementById("rsvpForm");
const langButtons = document.querySelectorAll(".lang-btn");

const weddingDate = new Date("2026-10-28T17:30:00");
const whatsappNumber = "972533046743";

let invitationOpened = false;

document.body.dataset.lang = "fr";

function openInvitation() {
  if (invitationOpened) return;

  invitationOpened = true;
  document.body.classList.add("invitation-open");

  playMusic();

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

  setTimeout(() => {
    revealVisibleElements();
  }, 150);
}

function playMusic() {
  if (!weddingMusic) return;

  weddingMusic.play()
    .then(updateMusicButton)
    .catch(() => updateMusicButton());
}

function toggleMusic() {
  if (!weddingMusic) return;

  if (weddingMusic.paused) {
    weddingMusic.play().then(updateMusicButton).catch(() => updateMusicButton());
  } else {
    weddingMusic.pause();
    updateMusicButton();
  }
}

function updateMusicButton() {
  if (!musicToggle || !weddingMusic) return;

  musicToggle.textContent = weddingMusic.paused ? "♪" : "Ⅱ";
  musicToggle.setAttribute(
    "aria-label",
    weddingMusic.paused ? "Lancer la musique" : "Arrêter la musique"
  );
}

function switchLanguage(lang) {
  document.body.dataset.lang = lang;

  langButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.lang === lang);
  });
}

function createGoogleCalendarLinks() {
  const startDate = "20261028T170000";
  const endDate = "20261028T233000";

  const title = encodeURIComponent("Mariage Esther & Yossi");
  const details = encodeURIComponent("Kabalat Panim à 17h. Houppa à 17h30 précises.");
  const location = encodeURIComponent("Salle Sakoya, Maale HaHamisha, Israël");

  const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startDate}/${endDate}&details=${details}&location=${location}`;

  if (calendarLink) calendarLink.href = url;
  if (calendarLinkHe) calendarLinkHe.href = url;
}

function updateCountdown() {
  const now = new Date();
  const distance = weddingDate - now;

  const safeDistance = Math.max(distance, 0);

  const days = Math.floor(safeDistance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((safeDistance / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((safeDistance / (1000 * 60)) % 60);
  const seconds = Math.floor((safeDistance / 1000) % 60);

  setCountdownValue("days", days);
  setCountdownValue("hours", hours);
  setCountdownValue("minutes", minutes);
  setCountdownValue("seconds", seconds);

  setCountdownValue("daysHe", days);
  setCountdownValue("hoursHe", hours);
  setCountdownValue("minutesHe", minutes);
  setCountdownValue("secondsHe", seconds);
}

function setCountdownValue(id, value) {
  const element = document.getElementById(id);
  if (!element) return;

  element.textContent = String(value).padStart(2, "0");
}

function setupScrollReveal() {
  const elements = document.querySelectorAll(".reveal-on-scroll");

  if (!("IntersectionObserver" in window)) {
    elements.forEach((element) => element.classList.add("is-visible"));
    return;
  }

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
      threshold: 0.16,
      rootMargin: "0px 0px -40px 0px"
    }
  );

  elements.forEach((element) => observer.observe(element));
}

function revealVisibleElements() {
  document.querySelectorAll(".reveal-on-scroll").forEach((element) => {
    const rect = element.getBoundingClientRect();

    if (rect.top < window.innerHeight && rect.bottom > 0) {
      element.classList.add("is-visible");
    }
  });
}

function handleRsvpSubmit(event) {
  event.preventDefault();

  const currentLang = document.body.dataset.lang || "fr";
  const name = document.getElementById("guestName").value.trim();
  const guestCount = document.getElementById("guestCount").value;
  const guestMessage = document.getElementById("guestMessage").value.trim();
  const attendance = document.querySelector('input[name="attendance"]:checked')?.value || "yes";

  const attendanceFr =
    attendance === "yes"
      ? "Oui, je serai présent(e)"
      : "Non, je ne pourrai pas être présent(e)";

  const attendanceHe =
    attendance === "yes"
      ? "כן, אגיע"
      : "לא אוכל להגיע";

  let whatsappMessage = "";

  if (currentLang === "he") {
    whatsappMessage =
      `שלום, אני מאשר/ת את תשובתי לחתונה של אסתר & יוסי\n` +
      `שם: ${name}\n` +
      `הגעה: ${attendanceHe}\n` +
      `מספר משתתפים: ${guestCount}\n` +
      `הודעה לזוג: ${guestMessage || "-"}`;
  } else {
    whatsappMessage =
      `Bonjour, je confirme ma présence au mariage d'Esther & Yossi\n` +
      `Nom : ${name}\n` +
      `Présence : ${attendanceFr}\n` +
      `Nombre de personnes : ${guestCount}\n` +
      `Mot pour les mariés : ${guestMessage || "-"}`;
  }

  const encodedMessage = encodeURIComponent(whatsappMessage);
  window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, "_blank");
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

if (musicToggle) {
  musicToggle.addEventListener("click", toggleMusic);
}

if (weddingMusic) {
  weddingMusic.addEventListener("play", updateMusicButton);
  weddingMusic.addEventListener("pause", updateMusicButton);
}

langButtons.forEach((button) => {
  button.addEventListener("click", () => {
    switchLanguage(button.dataset.lang);
  });
});

if (rsvpForm) {
  rsvpForm.addEventListener("submit", handleRsvpSubmit);
}

createGoogleCalendarLinks();
updateCountdown();
setInterval(updateCountdown, 1000);
setupScrollReveal();
updateMusicButton();
