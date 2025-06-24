document.getElementById('configForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const dataInicio = document.getElementById('dataInicio').value;
    const dataFim = document.getElementById('dataFim').value;
    const ticket = document.getElementById('ticket').value;

    if (dataInicio && dataFim && ticket) {
        localStorage.setItem('dataInicio', dataInicio);
        localStorage.setItem('dataFim', dataFim);
        localStorage.setItem('ticket', ticket);
        localStorage.setItem('mes', new Date(dataInicio).getMonth() + 1); // Mes atual
        alert('Configurações salvas! Redirecionando para lançamentos...');
        window.location.href = 'lancamentos.html';
    } else {
        alert('Preencha todos os campos!');
    }
});
