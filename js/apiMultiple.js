export function initApiMultiple() {
  const tabList = document.getElementById("editorTabs");
  const tabContent = document.getElementById("editorTabsContent");

  // Cria aba
  const li = document.createElement("li");
  li.classList.add("nav-item");
  li.innerHTML = `
    <button class="nav-link" id="api-multiple-tab" data-bs-toggle="tab" data-bs-target="#api-multiple" type="button" role="tab" aria-controls="api-multiple" aria-selected="false">
      APIs Múltiplas
    </button>`;
  tabList.appendChild(li);

  // Cria conteúdo
  const div = document.createElement("div");
  div.classList.add("tab-pane", "fade");
  div.id = "api-multiple";
  div.role = "tabpanel";
  div.setAttribute("aria-labelledby", "api-multiple-tab");
  div.innerHTML = `
    <h3>APIs Múltiplas</h3>
    <button id="api-multiple-btn" class="btn btn-primary mb-2">Carregar Dados</button>
    <div id="api-multiple-result"></div>`;
  tabContent.appendChild(div);

  // Evento do botão
  document.addEventListener("click", async (e) => {
    if (e.target && e.target.id === "api-multiple-btn") {
      const resultDiv = document.getElementById("api-multiple-result");
      resultDiv.innerHTML = "Carregando...";

      try {
        // Chamadas para múltiplas APIs
        // ATENÇÃO: 'starWars' foi substituído por 'exchangeRates'
        const [user, exchangeRates, cep, fipeBrands] = await Promise.all([
          fetch("https://jsonplaceholder.typicode.com/users/1").then(r => {
            if (!r.ok) throw new Error("Erro na API jsonplaceholder");
            return r.json();
          }),
          // NOVA API DE COTAÇÃO DE MOEDAS SUBSTITUINDO A SWAPI
          fetch("https://api.exchangerate-api.com/v4/latest/USD").then(r => {
            if (!r.ok) throw new Error("Erro na API de Cotação de Moedas");
            return r.json();
          }),
          fetch("https://brasilapi.com.br/api/cep/v1/01001000").then(r => {
            if (!r.ok) throw new Error("Erro na API BrasilAPI");
            return r.json();
          }),
          fetch("https://parallelum.com.br/fipe/api/v1/carros/marcas").then(r => {
            if (!r.ok) throw new Error("Erro na API FIPE");
            return r.json();
          })
        ]);

        // Exibindo os resultados no painel de configuração
        resultDiv.innerHTML = `
          <h5>Usuário (jsonplaceholder)</h5>
          <pre>${JSON.stringify(user, null, 2)}</pre>
          <h5>Cotação de Moedas (ExchangeRate-API)</h5>
          <pre>${JSON.stringify(exchangeRates, null, 2)}</pre>
          <h5>Endereço via CEP (BrasilAPI)</h5>
          <pre>${JSON.stringify(cep, null, 2)}</pre>
          <h5>Marcas de Carros (API FIPE)</h5>
          <pre>${JSON.stringify(fipeBrands.slice(0, 5), null, 2)}</pre>
        `;

        // Cria a seção para ser exibida na página gerada
        const html = `
          <section style="background:#efe; padding:15px; border:1px solid #ccc;">
            <h3>Dados Carregados de Múltiplas APIs</h3>
            <h4>Usuário</h4>
            <p><strong>Nome:</strong> ${user.name}</p>
            <p><strong>Email:</strong> ${user.email}</p>
            <h4>Cotações de Moedas (Base USD)</h4>
            <p><strong>USD para BRL:</strong> ${exchangeRates.rates.BRL ? exchangeRates.rates.BRL.toFixed(4) : 'N/A'}</p>
            <p><strong>USD para EUR:</strong> ${exchangeRates.rates.EUR ? exchangeRates.rates.EUR.toFixed(4) : 'N/A'}</p>
            <p><strong>USD para JPY:</strong> ${exchangeRates.rates.JPY ? exchangeRates.rates.JPY.toFixed(4) : 'N/A'}</p>
            <h4>CEP</h4>
            <p><strong>CEP:</strong> ${cep.cep}</p>
            <p><strong>Localidade:</strong> ${cep.city} - ${cep.state}</p>
            <h4>Marcas de Carros (API FIPE)</h4>
            <ul>
              ${fipeBrands.slice(0, 3).map(brand => `<li>${brand.nome}</li>`).join('')}
              ${fipeBrands.length > 3 ? '<li>...</li>' : ''}
            </ul>
          </section>`;

        // Armazena na variável global
        window.multipleAPISection = html;

        // Atualiza visualização
        if (typeof updatePreview === "function") updatePreview();

      } catch (err) {
        resultDiv.innerHTML = "Erro ao carregar APIs: " + err.message;
        window.multipleAPISection = ""; // Limpa a seção em caso de erro
      }
    }
  });
}
