document.getElementById('configForm').addEventListener('submit', function(e) {
      e.preventDefault();
      const mes = document.getElementById('mes').value;
      const dataInicio = document.getElementById('dataInicio').value;
      const dataFim = document.getElementById('dataFim').value;
      const ticket = document.getElementById('ticket').value;
      const dataInicioInput = document.getElementById('dataInicio');
      const dataFimInput = document.getElementById('dataFim');

      // Remove qualquer estilo de erro anterior
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

  function toggleDarkMode() {
      const body = document.body;
      const toggle = document.getElementById("darkModeToggle");
      body.classList.toggle("dark-mode");
      const isDarkMode = body.classList.contains("dark-mode");
      localStorage.setItem("darkMode", isDarkMode);
      toggle.checked = isDarkMode;
  }
