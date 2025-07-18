function salvarEIrParaLancamentos() {
    const mes = parseInt(document.getElementById("mes").value) || 1;
    const dataInicio = document.getElementById("dataInicio").value || "";
    const ticket = parseFloat(document.getElementById("ticket").value) || 0;
    const extra = parseFloat(document.getElementById("extra").value) || 0;
    localStorage.setItem("mes", mes);
    localStorage.setItem("dataInicio", dataInicio);
    localStorage.setItem("ticket", ticket);
    localStorage.setItem("extra", extra);
    window.location.href = "lancamentos.html";
}
function toggleDarkMode() {
    const body = document.body;
    const toggle = document.getElementById("darkModeToggle");
    body.classList.toggle("dark-mode");
    const isDarkMode = body.classList.contains("dark-mode");
    localStorage.setItem("darkMode", isDarkMode);
    toggle.checked = isDarkMode;
}
function carregarModoEscuro() {
    const isDarkMode = localStorage.getItem("darkMode") === "true";
    const body = document.body;
    if (isDarkMode) body.classList.add("dark-mode");
}
document.addEventListener("DOMContentLoaded", carregarModoEscuro);
