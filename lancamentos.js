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
let metaSemanal = ticket / 4; // Ajustar para o número correto de semanas depois
let saldoTicket = ticket;
let saldoExtra = extra;

// Função para formatar data como dd/mm
function formatarData(dataStr) {
    const data = new Date(dataStr);
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    return `${dia}/${mes}`;
}

// Função para verificar se é dia útil (exclui sábados e domingos)
function isDiaUtil(data) {
    const diaSemana = data.getDay();
    return diaSemana !== 0 && diaSemana !== 6;
}

// Ajustar para o dia útil anterior se necessário
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
    if (dataGasto.getMonth() + 1 !== mes) {
        alert("Este gasto não pertence ao mês selecionado!");
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
    exibirSemanas(); // Atualizar semanas após adicionar gasto
}

function carregarGastos() {
    const corpoTabela = document.getElementById("corpoTabela");
    corpoTabela.innerHTML = "";
    gastos.filter(gasto => {
        const data = new Date(gasto.data);
        return data.getMonth() + 1 === mes;
    }).forEach(gasto => {
        const linha = document.createElement("tr");
        linha.innerHTML = `<td>${formatarData(gasto.data)}</td><td>${gasto.valor.toFixed(2)}</td><td>${gasto.local}</td>`;
        corpoTabela.appendChild(linha);
    });
}

function atualizarSaldos() {
    const saldoMensal = saldoTicket + saldoExtra;
    document.getElementById("metaSemanal").textContent = metaSemanal.toFixed(2);
    document.getElementById("saldoTicket").textContent = saldoTicket.toFixed(2);
    document.getElementById("saldoExtra").textContent = saldoExtra.toFixed(2);
    document.getElementById("saldoMensal").textContent = saldoMensal.toFixed(2);
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
    if (isDarkMode) {
        body.classList.add("dark-mode");
        toggle.checked = true;
    }
}

function exibirPeriodo() {
    const startDate = new Date(localStorage.getItem("dataInicio") || new Date().toISOString().slice(0, 10));
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 28); // Período de 28 dias até o próximo pagamento
    const endDateAjustada = ajustarDiaUtilAnterior(endDate); // Ajustar apenas o fim
    const periodoDiv = document.getElementById("periodo");
    if (periodoDiv) {
        periodoDiv.innerHTML = `<p>Período: ${formatarData(startDate.toISOString().slice(0, 10))} a ${formatarData(endDateAjustada.toISOString().slice(0, 10))}</p>`;
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

    const startDate = new Date(localStorage.getItem("dataInicio") || new Date().toISOString().slice(0, 10));
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 28);
    const endDateAjustada = ajustarDiaUtilAnterior(endDate);
    const daysInPeriod = Math.ceil((endDateAjustada - startDate) / (1000 * 60 * 60 * 24)) + 1;
    const numberOfWeeks = Math.ceil(daysInPeriod / 7);
    const weeklyTarget = ticket / numberOfWeeks;

    for (let k = 0; k < numberOfWeeks; k++) {
        const weekStart = new Date(startDate);
        weekStart.setDate(startDate.getDate() + 7 * k);
        const weekStartStr = weekStart.toISOString().slice(0, 10);

        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + 6);
        if (weekEnd > endDateAjustada) weekEnd = endDateAjustada;
        const weekEndStr = weekEnd.toISOString().slice(0, 10);

        const gastosSemana = gastos.filter(gasto => {
            const dataGasto = new Date(gasto.data);
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
