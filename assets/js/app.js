
"use strict";

/*
 * CONFIGURAZIONE
 * Sostituisci con l'indirizzo email ufficiale dell'azienda.
 */
const CONTACT_EMAIL = "info@cesargreen.net";

document.addEventListener("DOMContentLoaded", () => {
  initRevealAnimations();
  initFooter();
  initContactForm();
});

/* Animazioni di ingresso */

function initRevealAnimations() {
  const elements = document.querySelectorAll(".reveal");

  if (!("IntersectionObserver" in window)) {
    elements.forEach(el => el.classList.add("visible"));
    return;
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    });
  }, {
    threshold: 0.08,
    rootMargin: "0px 0px -35px 0px"
  });

  elements.forEach(el => observer.observe(el));
}

/* Footer */

function initFooter() {
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
}

/* Modulo contatti */

function initContactForm() {
  const form = document.getElementById("contactForm");
  if (!form) return;

  const gmailButton = document.getElementById("gmailButton");
  const status = document.getElementById("formStatus");

  const configuredEmail =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(CONTACT_EMAIL);

  function showStatus(message) {
    if (status) status.textContent = message;
  }

  function getEmailData() {
    if (!form.reportValidity()) return null;

    if (!configuredEmail) {
      showStatus(t("configureEmail"));
      return null;
    }

    const data = new FormData(form);
    const firstName = String(data.get("firstName") || "").trim();
    const lastName = String(data.get("lastName") || "").trim();
    const email = String(data.get("email") || "").trim();
    const company = String(data.get("company") || "").trim();
    const message = String(data.get("message") || "").trim();
    const subjectType = String(data.get("subject") || "");

    const subjectKeys = {
      general: "subjectGeneral",
      image: "subjectImage",
      usb: "subjectUsb",
      business: "subjectBusiness"
    };

    const subjectText = t(subjectKeys[subjectType] || "subjectGeneral");

    const subject = `CESAR GREEN — ${subjectText}`;

    const body = [
      `Name: ${firstName} ${lastName}`,
      `Email: ${email}`,
      `Company: ${company || "—"}`,
      `Subject: ${subjectText}`,
      "",
      "Message:",
      message
    ].join("\n");

    return { subject, body };
  }

  form.addEventListener("submit", event => {
    event.preventDefault();

    const emailData = getEmailData();
    if (!emailData) return;

    const url =
      `mailto:${CONTACT_EMAIL}` +
      `?subject=${encodeURIComponent(emailData.subject)}` +
      `&body=${encodeURIComponent(emailData.body)}`;

    showStatus(t("emailPrepared"));

    window.location.href = url;
  });

  gmailButton?.addEventListener("click", () => {
    const emailData = getEmailData();
    if (!emailData) return;

    const params = new URLSearchParams({
      view: "cm",
      fs: "1",
      to: CONTACT_EMAIL,
      su: emailData.subject,
      body: emailData.body
    });

    const gmailUrl =
      `https://mail.google.com/mail/?${params.toString()}`;

    const opened = window.open(
      gmailUrl,
      "_blank",
      "noopener,noreferrer"
    );

    if (!opened) {
      showStatus(t("gmailBlocked"));
    }
  });

  document.addEventListener("languagechange", () => {
    showStatus("");
  });
}
