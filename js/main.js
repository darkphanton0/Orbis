/* ==========================================================================
   ORBIS — main.js
   Comportamentos globais: header, menu mobile, WhatsApp e utilidades
   ========================================================================== */

"use strict";

/* --------------------------------------------------------------------------
   Configuração do site — EDITE AQUI
   -------------------------------------------------------------------------- */
const ORBIS_CONFIG = {
  // WhatsApp: apenas números, formato internacional (55 + DDD + número).
  // Exemplo: 5511999999999
  whatsappNumber: "SEU_NUMERO_AQUI",

  // Mensagem pré-preenchida nos links de WhatsApp
  whatsappMessage: "Olá! Vim pelo site da Orbis e gostaria de mais informações.",

  // E-mail de contato exibido no rodapé
  email: "SEU_EMAIL_AQUI",
};

/* Integrações só aparecem no site quando os dados acima forem preenchidos */
const WHATSAPP_CONFIGURED = /^\d{10,15}$/.test(
  String(ORBIS_CONFIG.whatsappNumber).replace(/\D/g, "")
);
const EMAIL_CONFIGURED = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(ORBIS_CONFIG.email);

/* --------------------------------------------------------------------------
   WhatsApp
   -------------------------------------------------------------------------- */
function buildWhatsAppUrl(customMessage) {
  const number = String(ORBIS_CONFIG.whatsappNumber).replace(/\D/g, "");
  const message = customMessage || ORBIS_CONFIG.whatsappMessage;
  return "https://wa.me/" + number + "?text=" + encodeURIComponent(message);
}

const WHATSAPP_ICON =
  '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>';

function initWhatsApp() {
  /* Links marcados com data-whatsapp — permanecem ocultos sem número configurado */
  document.querySelectorAll("a[data-whatsapp]").forEach((link) => {
    if (!WHATSAPP_CONFIGURED) return;
    link.href = buildWhatsAppUrl(link.dataset.whatsapp || undefined);
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.hidden = false;
  });

  /* Itens de contato do rodapé: trocam "A definir" por link quando configurados */
  document.querySelectorAll("[data-contact]").forEach((item) => {
    const type = item.dataset.contact;
    const showWhatsapp = type === "whatsapp" && WHATSAPP_CONFIGURED;
    const showEmail = type === "email" && EMAIL_CONFIGURED;
    if (!showWhatsapp && !showEmail) return;

    const link = document.createElement("a");
    if (showWhatsapp) {
      link.href = buildWhatsAppUrl();
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.textContent = "WhatsApp";
    } else {
      link.href = "mailto:" + ORBIS_CONFIG.email;
      link.textContent = ORBIS_CONFIG.email;
    }
    item.textContent = "";
    item.appendChild(link);
  });

  /* Botão flutuante — injetado apenas com o número configurado */
  if (!WHATSAPP_CONFIGURED || document.querySelector(".whatsapp-float")) return;

  const wrapper = document.createElement("div");
  wrapper.className = "whatsapp-float";
  wrapper.innerHTML =
    '<a class="whatsapp-float__btn" href="' +
    buildWhatsAppUrl() +
    '" target="_blank" rel="noopener noreferrer" aria-label="Falar com a Orbis no WhatsApp">' +
    WHATSAPP_ICON +
    '</a><span class="whatsapp-float__tooltip">Fale com a Orbis</span>';
  document.body.appendChild(wrapper);
}

/* --------------------------------------------------------------------------
   Header — estado ao rolar
   -------------------------------------------------------------------------- */
function initHeader() {
  const header = document.getElementById("header");
  if (!header) return;

  const update = () =>
    header.classList.toggle("header--scrolled", window.scrollY > 10);

  window.addEventListener("scroll", update, { passive: true });
  update();
}

/* --------------------------------------------------------------------------
   Menu mobile
   -------------------------------------------------------------------------- */
function initMobileMenu() {
  const toggle = document.querySelector(".header__toggle");
  const nav = document.getElementById("menu");
  const backdrop = document.querySelector(".nav-backdrop");
  if (!toggle || !nav || !backdrop) return;

  const label = toggle.querySelector("[data-toggle-label]");
  const desktopQuery = window.matchMedia("(min-width: 960px)");
  let isOpen = false;

  function openMenu() {
    isOpen = true;
    document.body.classList.add("nav-open", "no-scroll");
    toggle.setAttribute("aria-expanded", "true");
    if (label) label.textContent = "Fechar menu";
  }

  function closeMenu(focusToggle) {
    if (!isOpen) return;
    isOpen = false;
    document.body.classList.remove("nav-open", "no-scroll");
    toggle.setAttribute("aria-expanded", "false");
    if (label) label.textContent = "Abrir menu";
    if (focusToggle) toggle.focus();
  }

  toggle.addEventListener("click", () => {
    if (isOpen) {
      closeMenu(false);
    } else {
      openMenu();
    }
  });

  backdrop.addEventListener("click", () => closeMenu(false));

  /* Fecha o menu ao navegar */
  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => closeMenu(false));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && isOpen) closeMenu(true);
  });

  /* Volta ao estado fechado quando o layout muda para desktop */
  const onBreakpointChange = (event) => {
    if (event.matches) closeMenu(false);
  };
  if (typeof desktopQuery.addEventListener === "function") {
    desktopQuery.addEventListener("change", onBreakpointChange);
  }
}

/* --------------------------------------------------------------------------
   Rodapé — ano automático
   -------------------------------------------------------------------------- */
function initFooterYear() {
  const year = String(new Date().getFullYear());
  document.querySelectorAll("[data-footer-year]").forEach((el) => {
    el.textContent = year;
  });
}

/* --------------------------------------------------------------------------
   Inicialização
   -------------------------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  initHeader();
  initMobileMenu();
  initWhatsApp();
  initFooterYear();
});

