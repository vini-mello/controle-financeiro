document.addEventListener("DOMContentLoaded", () => {
    exibirPeriodo();
    exibirSemanas();
});

let startDateStr = localStorage.getItem("dataInicio"); // Ex.: "2025-04-24"
let startDate = new Date(startDateStr);
let endDate = new Date(startDate);
endDate.setDate(endDate.getDate() + 28); // 28 dias até o próximo pagamento (ajustável)
let endDateStr = endDate.toISOString().slice(0, 10);
let ticket = parseFloat(localStorage.getItem("ticket")) || 1230.72; // Valor do ticket
let gastos = JSON.parse(localStorage.getItem("gastos")) || [];

// Função para adicionar um gasto
function adicionarGasto() {
    const data = document.getElementById("data").value;
    const valor = parseFloat(document.getElementById("valor").value);
    const local = document.getElementById("local").value;

    if (!data || isNaN(valor) || !local) {
        alert("Preencha todos os campos corretamente.");
        return;
    }

    const gasto = { data, valor, local };
    gastos.push(gasto);
    localStorage.setItem("gastos", JSON.stringify(gastos));
    location.reload();
}

// Exibir o período na página
function exibirPeriodo() {
    const periodoDiv = document.getElementById("periodo");
    periodoDiv.innerHTML = `<p>Período: ${startDateStr} a ${endDateStr}</p>`;
}

// Calcular e exibir as semanas
function exibirSemanas() {
    const semanasDiv = document.getElementById("semanas");
    semanasDiv.innerHTML = "";

    // Calcular o número de dias no período
    const daysInPeriod = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
    const numberOfWeeks = Math.ceil(daysInPeriod / 7);
    const weeklyTarget = ticket / numberOfWeeks; // Meta semanal

    // Loop para cada semana
    for (let k = 0; k < numberOfWeeks; k++) {
        const weekStart = new Date(startDate);
        weekStart.setDate(startDate.getDate() + 7 * k);
        const weekStartStr = weekStart.toISOString().slice(0, 10);

        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + 6);
        if (weekEnd > endDate) weekEnd = endDate; // Não ultrapassar o fim do período
        const weekEndStr = weekEnd.toISOString().slice(0, 10);

        // Filtrar gastos da semana
        const gastosSemana = gastos.filter(gasto => 
            gasto.data >= weekStartStr && gasto.data <= weekEndStr
        );
        const totalSpent = gastosSemana.reduce((sum, gasto) => sum + gasto.valor, 0);
        const balance = weeklyTarget - totalSpent;

        // Criar a seção da semana na página
        const weekDiv = document.createElement("div");
        weekDiv.className = "semana";
        weekDiv.innerHTML = `
            <h2>Semana ${k + 1}: ${weekStartStr} a ${weekEndStr}</h2>
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
                                <td>${gasto.data}</td>
                                <td>${gasto.valor.toFixed(2)}</td>
                                <td>${gasto.local}</td>
                            </tr>
                        `).join('')
                        : '<tr><td colspan="3">Nenhum lançamento</td></tr>'
                    }
                </tbody>
            </table>
            <p class="total">Total Gasto da Semana: R$ ${totalSpent.toFixed(2)}</p>
            <p class="saldo">Saldo da Semana: R$ ${balance.toFixed(2)}</p>
            <p class="fechamento">Data de Fechamento: ${weekEndStr}</p>
        `;
        semanasDiv.appendChild(weekDiv);
    }
}
