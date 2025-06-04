document.addEventListener('DOMContentLoaded', () => {
    carregarGastos();
    carregarModoEscuro();
});

function adicionarGasto() {
    const data = document.getElementById('data').value;
    const valor = parseFloat(document.getElementById('valor').value);
    const local = document.getElementById('local').value;

    if (!data || isNaN(valor) || !local) {
        alert('Por favor, preencha todos os campos corretamente.');
        return;
    }

    const gasto = { data, valor, local };
    let gastos = JSON.parse(localStorage.getItem('gastos')) || [];
    gastos.push(gasto);
    localStorage.setItem('gastos', JSON.stringify(gastos));

    carregarGastos();

    document.getElementById('data').value = '';
    document.getElementById('valor').value = '';
    document.getElementById('local').value = '';
}

function carregarGastos() {
    const corpoTabela = document.getElementById('corpoTabela');
    corpoTabela.innerHTML = '';

    const gastos = JSON.parse(localStorage.getItem('gastos')) || [];

    gastos.forEach(gasto => {
        const linha = document.createElement('tr');
        linha.innerHTML = `
            <td>${gasto.data}</td>
            <td>${gasto.valor.toFixed(2)}</td>
            <td>${gasto.local}</td>
        `;
        corpoTabela.appendChild(linha);
    });
}

function toggleDarkMode() {
    const body = document.body;
    body.classList.toggle('dark-mode');

    const isDarkMode = body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDarkMode);

    const button = document.getElementById('toggleDarkMode');
    button.textContent = isDarkMode ? 'Desativar Modo Escuro' : 'Ativar Modo Escuro';
}

function carregarModoEscuro() {
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    const body = document.body;
    const button = document.getElementById('toggleDarkMode');

    if (isDarkMode) {
        body.classList.add('dark-mode');
        button.textContent = 'Desativar Modo Escuro';
    } else {
        button.textContent = 'Ativar Modo Escuro';
    }
}
