// Carrega os gastos do LocalStorage ou inicializa um array vazio
let gastos = JSON.parse(localStorage.getItem('gastos')) || [];
let editingIndex = -1;

// Função para formatar data no formato dd-mm
function formatDate(dateStr) {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${day}-${month}`;
}

// Função para calcular a data final do período (dia 23 do próximo mês)
function calcularEndDate(startDate) {
    let endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);
    endDate.setDate(23);
    // Ajustar para o dia útil anterior se for fim de semana
    while (endDate.getDay() === 0 || endDate.getDay() === 6) {
        endDate.setDate(endDate.getDate() - 1);
    }
    return endDate;
}

// Função para atualizar o datalist de locais
function updateLocaisList() {
    const locais = [...new Set(gastos.map(gasto => gasto.local))];
    const datalist = document.getElementById('locaisList');
    datalist.innerHTML = '';
    locais.forEach(local => {
        const option = document.createElement('option');
        option.value = local;
        datalist.appendChild(option);
    });
}

// Exibir os gastos na tabela
function exibirGastos() {
    const tbody = document.querySelector('#tabelaLancamentos tbody');
    tbody.innerHTML = '';
    gastos.forEach((gasto, index) => {
        const linha = document.createElement('tr');
        linha.innerHTML = `
            <td>${formatDate(gasto.data)}</td>
            <td>${gasto.valor.toFixed(2)}</td>
            <td>${gasto.local}</td>
            <td><button onclick="editarGasto(${index})"><img src="edit-icon.png" alt="Editar" style="width: 20px;"></button></td>
        `;
        tbody.appendChild(linha);
    });
    updateLocaisList();
}

// Adicionar um novo gasto
function adicionarGasto() {
    const data = document.getElementById('data').value;
    const valor = parseFloat(document.getElementById('valor').value);
    const local = document.getElementById('local').value;
    if (data && !isNaN(valor) && local) {
        gastos.push({ data, valor, local });
        localStorage.setItem('gastos', JSON.stringify(gastos));
        exibirGastos();
        document.getElementById('formLancamento').reset();
    } else {
        alert('Por favor, preencha todos os campos corretamente.');
    }
}

// Editar um gasto existente
function editarGasto(index) {
    editingIndex = index;
    const gasto = gastos[index];
    document.getElementById('editData').value = gasto.data;
    document.getElementById('editValor').value = gasto.valor;
    document.getElementById('editLocal').value = gasto.local;
    document.getElementById('editModal').style.display = 'block';
}

// Salvar a edição do gasto
function salvarEdicao() {
    if (editingIndex >= 0) {
        const data = document.getElementById('editData').value;
        const valor = parseFloat(document.getElementById('editValor').value);
        const local = document.getElementById('editLocal').value;
        if (data && !isNaN(valor) && local) {
            gastos[editingIndex] = { data, valor, local };
            localStorage.setItem('gastos', JSON.stringify(gastos));
            document.getElementById('editModal').style.display = 'none';
            editingIndex = -1;
            exibirGastos();
        } else {
            alert('Por favor, preencha todos os campos corretamente.');
        }
    }
}

// Cancelar a edição
function cancelarEdicao() {
    document.getElementById('editModal').style.display = 'none';
    editingIndex = -1;
}

// Exibir o período na página
function exibirPeriodo() {
    const startDateStr = localStorage.getItem('dataInicio') || '2025-05-22';
    const startDate = new Date(startDateStr);
    const endDate = calcularEndDate(startDate);
    document.getElementById('periodo').textContent = `Período: ${formatDate(startDateStr)} a ${formatDate(endDate.toISOString().slice(0, 10))}`;
}

// Carregar a página
document.addEventListener('DOMContentLoaded', () => {
    exibirGastos();
    exibirPeriodo();
    document.getElementById('formLancamento').addEventListener('submit', (e) => {
        e.preventDefault();
        adicionarGasto();
    });
});
