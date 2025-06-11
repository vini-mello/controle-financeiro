function exibirPeriodo() {
    const startDateStr = localStorage.getItem("dataInicio"); // Pega a data de início do LocalStorage
    const startDate = new Date(startDateStr);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 28); // Define o fim como 28 dias após o início
    const endDateAjustada = ajustarDiaUtilAnterior(endDate); // Ajusta para o dia útil anterior, se necessário
    const periodoDiv = document.getElementById("periodo");
    if (periodoDiv) {
        periodoDiv.innerHTML = `<p>Período: ${formatarData(startDateStr)} a ${formatarData(endDateAjustada.toISOString().slice(0, 10))}</p>`;
    }
}

// Função auxiliar para formatar a data como dd/mm/aaaa
function formatarData(dataStr) {
    const data = new Date(dataStr);
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0'); // +1 porque getMonth começa em 0
    const ano = data.getFullYear();
    return `${dia}/${mes}/${ano}`;
}

// Função auxiliar para ajustar para o dia útil anterior (supondo que existe no código)
function ajustarDiaUtilAnterior(data) {
    let diaAjustado = new Date(data);
    while (diaAjustado.getDay() === 0 || diaAjustado.getDay() === 6) { // 0 = domingo, 6 = sábado
        diaAjustado.setDate(diaAjustado.getDate() - 1);
    }
    return diaAjustado;
}
