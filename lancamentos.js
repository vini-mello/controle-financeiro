document.addEventListener("DOMContentLoaded", () => {
      carregarGastos();
      atualizarSaldos();
      carregarModoEscuro();
      exibirPeriodo();
      exibirSemanas();
      adicionarBotaoExportar();
  });

  let ticket = parseFloat(localStorage.getItem("ticket")) || 0;
  let dataInicio = localStorage.getItem("dataInicio");
  let dataFim = localStorage.getItem("dataFim");
  let mes = parseInt(localStorage.getItem("mes")) || 1;
  let gastos = JSON.parse(localStorage.getItem("gastos")) || [];
  let metaSemanal = ticket / 4;
  let saldoTicket = ticket;

  // Função para formatar data como dd/mm/yyyy
  function formatarData(dataStr) {
      const [ano, mes, dia] = dataStr.split('-');
      return `${dia}/${mes}/${ano}`;
  }

  function calcularSemanas(inicio, fim) {
      const diffTime = Math.abs(new Date(fim) - new Date(inicio));
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return Math.ceil(diffDays / 7);
  }

  function adicionarGasto() {
      const data = document.getElementById("data").value;
      const valor = parseFloat(document.getElementById("valor").value);
      const local = document.getElementById("local").value;

      if (!data || isNaN(valor) || !local) {
          alert("Por favor, preencha todos os campos corretamente.");
          return;
      }

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

      const gasto = { data, valor, local };
      gastos.push(gasto);
      localStorage.setItem("gastos", JSON.stringify(gastos));
      limparCampos();
      carregarGastos();
      atualizarSaldos();
      exibirSemanas();
  }

  function limparCampos() {
      document.getElementById("data").value = "";
      document.getElementById("valor").value = "";
      document.getElementById("local").value = "";
  }

  document.getElementById("local").addEventListener("keypress", function(e) {
      if (e.key === "Enter") {
          e.preventDefault();
          adicionarGasto();
      }
  });

  function carregarGastos() {
      // Função mantida para compatibilidade
  }

  function excluirGasto(index) {
      if (confirm("Tem certeza que deseja excluir este gasto?")) {
          gastos.splice(index, 1);
          localStorage.setItem("gastos", JSON.stringify(gastos));
          carregarGastos();
          atualizarSaldos();
          exibirSemanas();
      }
  }

  function editarGasto(index) {
      const gasto = gastos[index];
      const novaData = prompt("Nova data (AAAA-MM-DD):", gasto.data);
      const novoValor = parseFloat(prompt("Novo valor (R$):", gasto.valor));
      const novoLocal = prompt("Novo local:", gasto.local);

      if (novaData && !isNaN(novoValor) && novoLocal) {
          if (new Date(novaData) < new Date(dataInicio) || new Date(novaData) > new Date(dataFim)) {
              alert("A data deve estar dentro do período selecionado!");
              return;
          }

          const diferenca = novoValor - gasto.valor;
          if (saldoTicket + gasto.valor >= novoValor) {
              saldoTicket -= diferenca;
          } else {
              alert("Saldo insuficiente para o novo valor!");
              return;
          }

          gastos[index] = { data: novaData, valor: novoValor, local: novoLocal };
          localStorage.setItem("gastos", JSON.stringify(gastos));
          exibirSemanas();
      }
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
      console.log("Modo escuro ativado:", isDarkMode); // Log para depuração
  }

  function carregarModoEscuro() {
      const isDarkMode = localStorage.getItem("darkMode") === "true";
      const body = document.body;
      const toggle = document.getElementById("darkModeToggle");
      if (toggle && isDarkMode) {
          body.classList.add("dark-mode");
          toggle.checked = true;
      }
      console.log("Modo escuro carregado:", isDarkMode); // Log para depuração
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
      metaSemanal = ticket / numeroSemanas;
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
              <table class="week-table">
                  <thead><tr><th>Data</th><th>Valor (R$)</th><th>Local</th><th>Ação</th></tr></thead>
                  <tbody>
                      ${gastosSemana.map((gasto, index) => `
                          <tr>
                              <td>${formatarData(gasto.data)}</td>
                              <td>${gasto.valor.toFixed(2)}</td>
                              <td>${gasto.local}</td>
                              <td>
                                  <button onclick="editarGasto(${gastos.indexOf(gasto)})">Editar</button>
                                  <button onclick="excluirGasto(${gastos.indexOf(gasto)})">Excluir</button>
                              </td>
                          </tr>
                      `).join('') || '<tr><td colspan="4">Nenhum lançamento</td></tr>'}
                  </tbody>
              </table>
              <p>Total Gasto: R$ ${totalSpent.toFixed(2)}</p>
              <p>Saldo: R$ ${balance.toFixed(2)}</p>
          `;
          semanasDiv.appendChild(weekDiv);
      }
  }

  function adicionarBotaoExportar() {
      const container = document.querySelector(".container");
      const botao = document.createElement("button");
      botao.textContent = "Exportar para CSV";
      botao.onclick = exportarCSV;
      container.insertBefore(botao, container.firstChild);
  }

  function exportarCSV() {
      const csv = [
          ["Data", "Valor (R$)", "Local"],
          ...gastos.map(gasto => [formatarData(gasto.data), gasto.valor.toFixed(2), gasto.local])
      ].map(row => row.join(",")).join("\n");
      const blob = new Blob([csv], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `gastos_${formatarData(dataInicio).replace(/\//g, '-')}_a_${formatarData(dataFim).replace(/\//g, '-')}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
  }
