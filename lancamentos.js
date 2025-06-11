document.addEventListener("DOMContentLoaded", () => {
    carregarGastos();
    atualizarSaldos();
    carregarModoEscuro();
    exibirPeriodo();
    exibirSemanas();
});

let ticket = parseFloat(localStorage.getItem("ticket")) || 0;
let extra = parseFloat(localStorage.getItem("extra")) || 0;
let dataInicio = localStorage.getItem("dataInicio");
let mes = parseInt(localStorage.getItem("mes")) || 1;
let gastos = JSON.parse(localStorage.getItem("gastos")) || [];
let metaSemanal = (ticket + extra) / 4; // Meta semanal baseada em ticket + extra dividido por 4
let saldoTicket = ticket;
let saldoExtra = extra;

// Função para formatar data como dd/mm/aaaa
function formatarData(dataStr) {
    const data = new Date(dataStr);
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = data.getFullYear();
    return `${dia}/${mes}/${ano}`;
}

// Função para verificar se é dia útil (exclui sábados e domingos)
function isDiaUtil(data) {
    const diaSemana = data.getDay();
    return diaSemana !== 0 && diaSemana !== 6;
}

// Ajustar para o dia útil anterior se necessário (opcional, não será usado no cálculo do período)
function ajustarDiaUtilAnterior(data) {
    let dataAjustada = new Date(data);
    while (!isDiaUtil(dataAjustada)) {
        dataAjustada.setDate(dataAjustada.getDate() - 1);
    }
    return dataAjustada;
}

function adicionarGasto() {
    const data = document.getElementById("data").value;
    const valor = parseFloat(document.getElementById("valor").value);
    const local = document.getElementById("local").value;

    if (!data || isNaN(valor) || !local) {
        alert("Por favor, preencha todos os campos corretamente.");
        return;
    }

    const dataGasto = new Date(data);
    const startDate = new Date(localStorage.getItem("dataInicio"));
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 28);

    if (dataGasto < startDate || dataGasto > endDate) {
        alert("Este gasto não pertence ao período selecionado!");
        return;
    }

    if (saldoTicket >= valor) {
        saldoTicket -= valor;
    } else {
        const resto = valor - saldoTicket;
        saldoTicket = 0;
        saldoExtra -= resto;
    }

    const gasto = { data, valor, local };
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
    const startDate = new Date(localStorage.getItem("dataInicio") + "T00:00:00"); // Forçar horário inicial
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 28);

    gastos.filter(gasto => {
        const data = new Date(gasto.data + "T00:00:00"); // Garantir consistência
        return data >= startDate && data <= endDate;
    }).forEach(gasto => {
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
        const saldoMensal = saldoTicket + saldoExtra;
        saldosDiv.innerHTML = `
            <h2>Saldos</h2>
            <p>Meta Semanal: R$ ${metaSemanal.toFixed(2)}</p>
            <p>Saldo Ticket: R$ ${saldoTicket.toFixed(2)}</p>
            <p>Saldo Extra: R$ ${saldoExtra.toFixed(2)}</p>
            <p>Saldo Total Mensal: R$ ${saldoMensal.toFixed(2)}</p>
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
    const startDateStr = localStorage.getItem("dataInicio");
    if (!startDateStr) {
        console.error("Data de início não encontrada no LocalStorage.");
        return;
    }
    const startDate = new Date(startDateStr + "T00:00:00"); // Forçar horário inicial para evitar deslocamento
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 28); // Calcula exatamente 28 dias
    console.log("Data de início raw:", startDateStr); // Log para depuração
    console.log("Período calculado:", formatarData(startDate.toISOString()) + " a " + formatarData(endDate.toISOString()));
    const periodoDiv = document.getElementById("periodo");
    if (periodoDiv) {
        periodoDiv.innerHTML = `<p>Período: ${formatarData(startDate.toISOString())} a ${formatarData(endDate.toISOString())}</p>`;
    } else {
        console.error("Elemento #periodo não encontrado no HTML.");
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

    const startDateStr = localStorage.getItem("dataInicio") || new Date().toISOString().slice(0, 10);
    const startDate = new Date(startDateStr + "T00:00:00");
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 28);
    const numberOfWeeks = 4; // Forçar 4 semanas
    const weeklyTarget = (ticket + extra) / numberOfWeeks;

    for (let k = 0; k < numberOfWeeks; k++) {
        const weekStart = new Date(startDate);
        weekStart.setDate(startDate.getDate() + 7 * k);
        const weekStartStr = weekStart.toISOString().slice(0, 10);

        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + 6);
        if (weekEnd > endDate) weekEnd = endDate;
        const weekEndStr = weekEnd.toISOString().slice(0, 10);

        const gastosSemana = gastos.filter(gasto => {
            const dataGasto = new Date(gasto.data + "T00:00:00");
            return dataGasto >= weekStart && dataGasto <= weekEnd;
        });
        const totalSpent = gastosSemana.reduce((sum, gasto) => sum + gasto.valor, 0);
        const balance = weeklyTarget - totalSpent;

        const weekDiv = document.createElement("div");
        weekDiv.className = "semana";
        weekDiv.innerHTML = `
            <h3>Semana ${k + 1}: ${formatarData(weekStartStr)} a ${formatarData(weekEndStr)}</h3>
            <p>Meta Semanal: R$ ${weeklyTarget.toFixed(2)}</p>
            <table>
                <thead>
                    <tr>
                        <th>Data</th>
                        <th>Valor (R$)</th>
                        <th>Local</th>
                    </tr>
                </thead>
                <tbody>
                    ${gastosSemana.length > 0 
                        ? gastosSemana.map(gasto => `
                            <tr>
                                <td>${formatarData(gasto.data)}</td>
                                <td>${gasto.valor.toFixed(2)}</td>
                                <td>${gasto.local}</td>
                            </tr>
                        `).join('')
                        : '<tr><td colspan="3">Nenhum lançamento</td></tr>'
                    }
                </tbody>
            </table>
            <p>Total Gasto da Semana: R$ ${totalSpent.toFixed(2)}</p>
            <p>Saldo da Semana: R$ ${balance.toFixed(2)}</p>
            <p>Data de Fechamento: ${formatarData(weekEndStr)}</p>
        `;
        semanasDiv.appendChild(weekDiv);
    }
}
