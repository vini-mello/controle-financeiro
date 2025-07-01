document.addEventListener("DOMContentLoaded", () => {
    carregarGastos();
    atualizarSaldos();
    carregarModoEscuro();
    exibirPeriodo();
    exibirSemanas();
});

let ticket = parseFloat(localStorage.getItem("ticket")) || 0;
let dataInicio = localStorage.getItem("dataInicio");
let dataFim = localStorage.getItem("dataFim");
let mes = parseInt(localStorage.getItem("mes")) || 1;
let gastos = JSON.parse(localStorage.getItem("gastos")) || [];
let metaSemanal = ticket / 4; // Ajustar conforme número de semanas
let saldoTicket = ticket;

// Função para formatar data como dd/mm/yyyy
function formatarData(dataStr) {
    return dataStr.split('-').reverse().join('/'); // Ex.: "2025-06-24" -> "24/06/2025"
}

function calcularSemanas(inicio, fim) {
    const diffTime = Math.abs(new Date(fim) - new Date(inicio));
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.ceil(diffDays / 7);
}

function adicionarGasto() {
    const data = document.getElementById("data").value; // Usa a data como string
    const valor = parseFloat(document.getElementById("valor").value);
    const local = document.getElementById("local").value;

    if (!data || isNaN(valor) || !local) {
        alert("Por favor, preencha todos os campos corretamente.");
        return;
    }

    // Validação do período usando strings de data
    if (data < dataInicio || data > dataFim) {
        alert("Este gasto não pertence ao período selecionado!");
        return;
    }

    if (saldoTicket >= valor) {
        saldoTicket -= valor;
    } else {
        alert("Saldo insuficiente!");
        return;
    }

    const gasto = { data, valor, local }; // Salva a data como inserida
    gastos.push(gasto);
    localStorage.setItem("gastos", JSON.stringify(gastos));
    carregarGastos();
    atualizarSaldos();
    exibirSemanas();
}

function carregarGastos() {
    const corpoTabela = document.getElementById("corpoTabela");
    if (!corpoTabela) return;

    corpoTabela.innerHTML = "";
    gastos.forEach(gasto => {
        const linha = document.createElement("tr");
        linha.innerHTML = `
            <td>${formatarData(gasto.data)}</td>
            <td>${gasto.valor.toFixed(2)}</td>
            <td>${gasto.local}</td>
        `;
        corpoTabela.appendChild(linha);
    });
}

function atualizarSaldos() {
    const saldosDiv = document.querySelector(".saldos");
    if (saldosDiv) {
        saldosDiv.innerHTML = `
            <h2>Saldos</h2>
            <p>Meta Semanal: R$ ${metaSemanal.toFixed(2)}</p>
            <p>Saldo Ticket: R$ ${saldoTicket.toFixed(2)}</p>
        `;
    }
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
    const toggle = document.getElementById("darkModeToggle");
    if (toggle && isDarkMode) {
        body.classList.add("dark-mode");
        toggle.checked = true;
    }
}

function exibirPeriodo() {
    const periodoDiv = document.getElementById("periodo");
    if (periodoDiv && dataInicio && dataFim) {
        periodoDiv.innerHTML = `<p>Período: ${formatarData(dataInicio)} a ${formatarData(dataFim)}</p>`;
    }
}

function exibirSemanas() {
    const semanasDiv = document.getElementById("semanas");
    if (!semanasDiv) {
        const container = document.querySelector(".container");
        semanasDiv = document.createElement("div");
        semanasDiv.id = "semanas";
        container.insertBefore(semanasDiv, document.querySelector(".saldos"));
    }
    semanasDiv.innerHTML = "";

    const numeroSemanas = calcularSemanas(dataInicio, dataFim);
    metaSemanal = ticket / numeroSemanas; // Ajusta a meta semanal
    const diffDays = Math.ceil((new Date(dataFim) - new Date(dataInicio)) / (1000 * 60 * 60 * 24));
    const diasPorSemana = Math.floor(diffDays / numeroSemanas);

    for (let k = 0; k < numeroSemanas; k++) {
        const weekStart = new Date(dataInicio);
        weekStart.setDate(weekStart.getDate() + k * diasPorSemana);
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + diasPorSemana - 1);
        if (weekEnd > new Date(dataFim)) weekEnd.setDate(new Date(dataFim).getDate());

        const weekStartStr = weekStart.toISOString().slice(0, 10);
        const weekEndStr = weekEnd.toISOString().slice(0, 10);

        const gastosSemana = gastos.filter(gasto => {
            const dataGasto = new Date(gasto.data);
            return dataGasto >= weekStart && dataGasto <= weekEnd;
        });
        const totalSpent = gastosSemana.reduce((sum, gasto) => sum + gasto.valor, 0);
        const balance = (metaSemanal * (k + 1) / numeroSemanas) - totalSpent;

        const weekDiv = document.createElement("div");
        weekDiv.className = "semana";
        weekDiv.innerHTML = `
            <h3>Semana ${k + 1}: ${formatarData(weekStartStr)} a ${formatarData(weekEndStr)}</h3>
            <p>Meta Semanal: R$ ${metaSemanal.toFixed(2)}</p>
            <table>
                <thead><tr><th>Data</th><th>Valor (R$)</th><th>Local</th></tr></thead>
                <tbody>
                    ${gastosSemana.map(gasto => `
                        <tr><td>${formatarData(gasto.data)}</td><td>${gasto.valor.toFixed(2)}</td><td>${gasto.local}</td></tr>
                    `).join('') || '<tr><td colspan="3">Nenhum lançamento</td></tr>'}
                </tbody>
            </table>
            <p>Total Gasto: R$ ${totalSpent.toFixed(2)}</p>
            <p>Saldo: R$ ${balance.toFixed(2)}</p>
        `;
        semanasDiv.appendChild(weekDiv);
    }
}
