export function initApiInteractive() {
  const tabList = document.getElementById("editorTabs");
  const tabContent = document.getElementById("editorTabsContent");

  // Cria aba
  const li = document.createElement("li");
  li.classList.add("nav-item");
  li.innerHTML = `
    <button class="nav-link" id="api-interactive-tab" data-bs-toggle="tab" data-bs-target="#api-interactive" type="button" role="tab" aria-controls="api-interactive" aria-selected="false">
      API Interativa
    </button>`;
  tabList.appendChild(li);

  // Cria conteúdo da aba
  const div = document.createElement("div");
  div.classList.add("tab-pane", "fade");
  div.id = "api-interactive";
  div.role = "tabpanel";
  div.setAttribute("aria-labelledby", "api-interactive-tab");
  div.innerHTML = `
    <h3>API Interativa</h3>
    <input type="text" id="api-input" class="form-control mb-2" placeholder="Digite ID de Post (1-100)">
    <button id="api-btn" class="btn btn-primary mb-2">Buscar Post</button>
    <div id="api-result"></div>`;
  tabContent.appendChild(div);

  // Evento do botão
  document.addEventListener("click", async (e) => {
    if (e.target && e.target.id === "api-btn") {
      const id = document.getElementById("api-input").value.trim();
      const resultDiv = document.getElementById("api-result");

      // Validação
      if (!id || isNaN(id) || id < 1 || id > 100) {
        resultDiv.innerHTML = "Por favor, insira um ID válido entre 1 e 100.";
        return;
      }

      resultDiv.innerHTML = "Carregando...";

      try {
        const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`);
        if (!res.ok) throw new Error("Erro na API");

        const data = await res.json();

        // Mostra no painel da aba
        resultDiv.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;

        // Cria a seção visual na página gerada
        const sectionHTML = `
          <section style="background:#eef; padding:15px; border:1px solid #ccd;">
            <h3 style="color:#333;">Post Carregado da API</h3>
            <p><strong>ID:</strong> ${data.id}</p>
            <p><strong>Título:</strong> ${data.title}</p>
            <p><strong>Conteúdo:</strong> ${data.body}</p>
          </section>`;

        // Armazena em variável global (usada no updatePreview)
        window.interactiveAPISection = sectionHTML;

        // Atualiza visualização
        if (typeof updatePreview === "function") updatePreview();

      } catch (error) {
        resultDiv.innerHTML = `Erro: ${error.message}`;
        window.interactiveAPISection = ""; // Limpa a seção em caso de erro
      }
    }
  });
}
