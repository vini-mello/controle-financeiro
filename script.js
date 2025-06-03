// Carregar dados do LocalStorage ao iniciar
let ticket = parseFloat(localStorage.getItem('ticket')) || 0;
let extra = parseFloat(localStorage.getItem('extra')) || 0;
let semanas = parseInt(localStorage.getItem('semanas')) || 4;
let gastos = JSON.parse(localStorage.getItem('gastos')) || [];
let gastosSemanaAtual = JSON.parse(localStorage.getItem('gastosSemanaAtual')) || 0;

let metaSemanal = ticket / semanas;
let saldoTicket = ticket;
let saldoExtra = extra;
let semanaAtual = Math.floor((new Date().getDate() - 1) / 7) + 1; // Semana aproximada

// Atualizar interface com valores iniciais
atualizarSaldos();
carregarGastos();

function definirValores() {
    ticket = parseFloat(document.getElementById('ticketInput').value) || 0;
    extra = parseFloat(document.getElementById('extraInput').value) || 0;
    semanas = parseInt(document.getElementById('semanasInput').value) || 4;

    metaSemanal = ticket / semanas;
    saldoTicket = ticket;
    saldoExtra = extra;
    gastos = [];
    gastosSemanaAtual = 0;

    // Salvar no LocalStorage
    localStorage.setItem('ticket', ticket);
    localStorage.setItem('extra', extra);
    localStorage.setItem('semanas', semanas);
    localStorage.setItem('gastos', JSON.stringify(gastos));
    localStorage.setItem('gastosSemanaAtual', gastosSemanaAtual);

    atualizarSaldos();
    carregarGastos();
}

function zerarDados() {
    if (confirm('Tem certeza que deseja zerar todos os dados?')) {
        ticket = 0;
        extra = 0;
        semanas = 4;
        gastos = [];
        gastosSemanaAtual = 0;
        metaSemanal = 0;
        saldoTicket = 0;
        saldoExtra = 0;

        localStorage.clear();

        atualizarSaldos();
        carregarGastos();
    }
}

function adicionarGasto() {
    const data = document.getElementById('dataInput').value;
    const valor = parseFloat(document.getElementById('valorInput').value) || 0;
    const local = document.getElementById('localInput').value;

    if (!data || !valor || !local) {
        alert('Preencha todos os campos!');
        return;
    }

    const dataObj = new Date(data);
    const semanaGasto = Math.floor((dataObj.getDate() - 1) / 7) + 1;

    // Priorizar o ticket
    if (saldoTicket >= valor) {
        saldoTicket -= valor;
    } else {
        const resto = valor - saldoTicket;
        saldoTicket = 0;
        saldoExtra -= resto;
    }

    gastos.push({ data, valor, local, semana: semanaGasto });
    gastosSemanaAtual += valor;
    localStorage.setItem('gastos', JSON.stringify(gastos));
    localStorage.setItem('gastosSemanaAtual', gastosSemanaAtual);

    atualizarSaldos();
    carregarGastos();

    // Limpar formulário
    document.getElementById('dataInput').value = '';
    document.getElementById('valorInput').value = '';
    document.getElementById('localInput').value = '';
}

function atualizarSaldos() {
    const saldoSemanal = metaSemanal - gastosSemanaAtual;
    const saldoMensal = saldoTicket + saldoExtra;

    document.getElementById('metaSemanal').textContent = metaSemanal.toFixed(2);
    document.getElementById('saldoSemanal').textContent = saldoSemanal.toFixed(2);
    document.getElementById('saldoTicket').textContent = saldoTicket.toFixed(2);
    document.getElementById('saldoExtra').textContent = saldoExtra.toFixed(2);
    document.getElementById('saldoMensal').textContent = saldoMensal.toFixed(2);

    const statusMensal = document.getElementById('statusMensal');
    if (saldoMensal < 0) {
        statusMensal.textContent = '(Déficit)';
        statusMensal.className = 'saldo-negativo';
    } else {
        statusMensal.textContent = '(Sobra)';
        statusMensal.className = 'saldo-positivo';
    }
}

function carregarGastos() {
    const tbody = document.getElementById('gastosBody');
    tbody.innerHTML = '';
    gastos.forEach(gasto => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${gasto.data}</td>
            <td>${gasto.valor.toFixed(2)}</td>
            <td>${gasto.local}</td>
        `;
        tbody.appendChild(row);
    });
}
