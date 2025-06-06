document.addEventListener("DOMContentLoaded", () => {
    carregarModoEscuro();
    exibirPeriodo();
    exibirSemanas();
});

let startDateStr = localStorage.getItem("dataInicio");
let startDate = new Date(startDateStr);
let endDate = new Date(startDate);
endDate.setDate(endDate.getDate() + 29); // Período até o dia anterior ao próximo pagamento (~30 dias)
let endDateStr = endDate.toISOString().slice(0,10);
let ticket = parseFloat(localStorage.getItem("ticket")) || 1230.72; // Valor padrão da planilha
let weeklyTarget = ticket / 4; // Meta semanal fixa, como na planilha (307,68)
let gastos = JSON.parse(localStorage.getItem("gastos")) || [];

function adicionarGasto() {
    const data = document.getElementById("data").value;
    const valor = parseFloat(document.getElementById("valor").value);
    const local = document.getElementById("local").value;

    if (!data || isNaN(valor) || !local) {
        alert("Por favor, preencha todos os campos corretamente.");
        return;
    }

    const gasto = { data, valor, local };
    gastos.push(gasto);
    localStorage.setItem("gastos", JSON.stringify(gastos));
    location.reload();
}

function exibirPeriodo() {
    const periodoDiv = document.getElementById("periodo");
    periodoDiv.innerHTML = `<p>Período: ${startDateStr} a ${endDateStr}</p>`;
}

function exibirSemanas() {
    const semanasDiv = document.getElementById("semanas");
    semanasDiv.innerHTML = "";

    const daysInPeriod = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
    const numberOfWeeks = Math.ceil(daysInPeriod / 7);

    for (let k = 1; k <= numberOfWeeks; k++) {
        const weekStart = new Date(startDate);
        weekStart.setDate(startDate.getDate() + 7 * (k - 1));
        const weekStartStr = weekStart.toISOString().slice(0,10);

        const weekEnd = new Date(startDate);
        weekEnd.setDate(startDate.getDate() + 7 * k - 1);
        if (weekEnd > endDate) weekEnd = endDate;
        const weekEndStr = weekEnd.toISOString().slice(0,10);

        const gastosSemana = gastos.filter(gasto => gasto.data >= weekStartStr && gasto.data <= weekEndStr);
        const totalSpent = gastosSemana.reduce((sum, gasto) => sum + gasto.valor, 0);
        const balance = weeklyTarget - totalSpent;

        const weekDiv = document.createElement("div");
        weekDiv.className = "semana";
        weekDiv.innerHTML = `
            <h2>Semana ${k}: ${weekStartStr} a ${weekEndStr}</h2>
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
                    ${gastosSemana.map(gasto => `<tr><td>${gasto.data}</td><td>${gasto.valor.toFixed(2)}</td><td>${gasto.local}</td></tr>`).join('')}
                </tbody>
            </table>
            <p class="total">Total Gasto da Semana: R$ ${totalSpent.toFixed(2)}</p>
            <p class="saldo">Saldo da Semana: R$ ${balance.toFixed(2)}</p>
            <p class="fechamento">Data de Fechamento: ${weekEndStr}</p>
        `;
        semanasDiv.appendChild(weekDiv);
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
    if (isDarkMode) {
        body.classList.add("dark-mode");
        toggle.checked = true;
    }
}
