document.getElementById('configForm').addEventListener('submit', function(e) {
      e.preventDefault();
      const mes = document.getElementById('mes').value;
      const dataInicio = document.getElementById('dataInicio').value;
      const dataFim = document.getElementById('dataFim').value;
      const ticket = document.getElementById('ticket').value;
      const dataInicioInput = document.getElementById('dataInicio');
      const dataFimInput = document.getElementById('dataFim');

      dataInicioInput.style.borderColor = '';
      dataFimInput.style.borderColor = '';

      if (mes && dataInicio && dataFim && ticket) {
          if (new Date(dataInicio) >= new Date(dataFim)) {
              alert('O Fim do Período deve ser posterior ao Início do Período!');
              dataFimInput.style.borderColor = 'red';
              return;
          }
          localStorage.setItem('mes', mes);
          localStorage.setItem('dataInicio', dataInicio);
          localStorage.setItem('dataFim', dataFim);
          localStorage.setItem('ticket', ticket);
          alert('Configurações salvas! Redirecionando para lançamentos...');
          window.location.href = 'lancamentos.html';
      } else {
          alert('Preencha todos os campos!');
      }
  });

  document.getElementById('goToLancamentos').addEventListener('click', function() {
      const mes = document.getElementById('mes').value;
      if (mes) {
          localStorage.setItem('mes', mes);
          // Redireciona para lançamentos com o mês selecionado (período e ticket permanecem os últimos salvos)
          window.location.href = 'lancamentos.html';
      } else {
          alert('Selecione um mês!');
      }
  });

  function toggleDarkMode() {
      const body = document.body;
      const toggle = document.getElementById("darkModeToggle");
      body.classList.toggle("dark-mode");
      const isDarkMode = body.classList.contains("dark-mode");
      localStorage.setItem("darkMode", isDarkMode);
      toggle.checked = isDarkMode;
  }
