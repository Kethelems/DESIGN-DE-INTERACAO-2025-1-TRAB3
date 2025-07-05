let headerElements = 1;
let menuItems = 1;
let galleryCards = 1;
let formFields = 1;
window.interactiveAPISection = "";
window.multipleAPISection = "";

import { initApiInteractive } from "./apiInteractive.js";
import { initApiMultiple } from "./apiMultiple.js";

// Executa o código quando o DOM estiver completamente carregado
document.addEventListener("DOMContentLoaded", () => {
  initApiInteractive();
  initApiMultiple();

  const firstElementType = document.querySelector('#header-elements .header-element .element-type');
  if (firstElementType) {
    const noneOption = document.createElement('option');
    noneOption.value = 'none';
    noneOption.textContent = 'Nenhum';
    firstElementType.insertBefore(noneOption, firstElementType.firstChild);
    toggleHeaderElementOptions(firstElementType);
  }
});

   //Atualiza visualização inicial
    updatePreview();
    // Adiciona event listeners para os botões principais
    document.getElementById('update-preview').addEventListener('click', updatePreview);
    document.getElementById('show-html').addEventListener('click', showHTML);
    document.getElementById('save-html').addEventListener('click', saveHTML);
    document.getElementById('load-html').addEventListener('click', loadHTML);
    document.getElementById('clear-storage').addEventListener('click', clearStorage);
     // Adiciona event listeners para os botões de adição de elementos
    document.getElementById('add-header-element').addEventListener('click', function () {
        addHeaderElement();
        updatePreview();
    });
    document.getElementById('add-menu-item').addEventListener('click', function () {
        addMenuItem();
        updatePreview();
    });
    document.getElementById('add-gallery-card').addEventListener('click', function () {
        addGalleryCard();
        updatePreview();
    });
    document.getElementById('add-form-field').addEventListener('click', function () {
        addFormField();
        updatePreview();
    });
     // Adiciona listeners para todos os inputs, selects e textareas para atualizar a visualização quando alterados
    document.querySelectorAll('input, select, textarea').forEach(el => {
        el.addEventListener('input', updatePreview);
        el.addEventListener('change', updatePreview);
    });
    // Adiciona listener para remover elementos do cabeçalho
    document.getElementById('header-elements').addEventListener('click', function(e) {
        if (e.target && e.target.classList.contains('remove-element')) {
            if (document.querySelectorAll('#header-elements .header-element').length > 1) {
                // Remove o item se houver mais de um
                e.target.closest('.header-element').remove();
            } else {
                const elementType = document.querySelector('#header-elements .header-element .element-type');
                elementType.value = 'none';
                toggleHeaderElementOptions(elementType);
            }
            updatePreview();
        }
    });
     // Adiciona listener para remover itens do menu
    document.getElementById('menu-items').addEventListener('click', function(e) {
        if (e.target && e.target.classList.contains('remove-menu-item')) {
            if (document.querySelectorAll('#menu-items .menu-item').length > 1) {
                e.target.closest('.menu-item').remove();
                updatePreview();
            } else {
                // Mostra alerta se tentar remover o último item
                alert('É necessário manter pelo menos um item de menu!');
            }
        }
    });
    // Adiciona listener para remover cards da galeria
    document.getElementById('gallery-cards').addEventListener('click', function(e) {
        if (e.target && e.target.classList.contains('remove-gallery-card')) {
            if (document.querySelectorAll('#gallery-cards .gallery-card').length > 1) {
                e.target.closest('.gallery-card').remove();
                updatePreview();
            } else {
                alert('É necessário manter pelo menos um card na galeria!');
            }
        }
    });
    // Adiciona listener para remover campos do formulário
    document.getElementById('form-fields').addEventListener('click', function(e) {
        if (e.target && e.target.classList.contains('remove-form-field')) {
            if (document.querySelectorAll('#form-fields .form-field').length > 1) {
                e.target.closest('.form-field').remove();
                updatePreview();
            } else {
                alert('É necessário manter pelo menos um campo no formulário!');
            }
        }
    });
     // Adiciona listener global para mudanças em selects de tipo de elemento
    document.addEventListener('change', function(e) {
        if (e.target && e.target.classList.contains('element-type')) {
         // Atualiza as opções visíveis com base no tipo de elemento selecionado
            toggleHeaderElementOptions(e.target);
            updatePreview();
        }
        if (e.target && e.target.classList.contains('field-type')) {
            toggleFormFieldOptions(e.target);
            updatePreview();
        }
    });
// Adiciona listener global para upload de imagens
document.addEventListener('change', function(e) {
    if (e.target && e.target.classList.contains('logo-upload')) {
        const file = e.target.files[0];
        if (file) {
           // Cria um FileReader para ler o arquivo como URL de dados
            const reader = new FileReader();
            reader.onload = function(event) {
                const parent = e.target.closest('.header-element');
                const preview = parent.querySelector('.logo-preview');
                if (preview) {
                    preview.src = event.target.result;
                    preview.style.display = 'block';
                    updatePreview();
                }
            };
            reader.readAsDataURL(file);
        }
    }
     // Upload de banner
    if (e.target && e.target.classList.contains('banner-upload')) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                const parent = e.target.closest('.header-element');
                const preview = parent.querySelector('.banner-preview');
                if (preview) {
                    preview.src = event.target.result;
                    preview.style.display = 'block';
                    updatePreview();
                }
            };
            reader.readAsDataURL(file);
        }
    }
    // Upload de imagem para o menu
    if (e.target && e.target.classList.contains('menu-image-upload')) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                const preview = document.getElementById('menu-image-preview');
                if (preview) {
                    preview.src = event.target.result;
                    preview.style.display = 'block';
                    updatePreview();
                }
            };
            reader.readAsDataURL(file);
        }
    }
       // Upload de imagem para a galeria
    if (e.target && e.target.classList.contains('gallery-image-upload')) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                const preview = document.querySelector('.gallery-image-preview');
                if (preview) {
                    preview.src = event.target.result;
                    preview.style.display = 'block';
                    window.galleryUploadedImage = event.target.result;
                    const galleryImageSelects = document.querySelectorAll('.gallery-image');
                    galleryImageSelects.forEach(select => {
                        let exists = false;
                        for (let i = 0; i < select.options.length; i++) {
                            if (select.options[i].value === 'uploaded') {
                                exists = true;
                                break;
                            }
                        }
                        if (!exists) {
                            const option = document.createElement('option');
                            option.value = 'uploaded';
                            option.text = 'Imagem Enviada';
                            select.add(option);
                        }
                    });
                    updatePreview();
                }
            };
            reader.readAsDataURL(file);
        }
    }
});
// Função para alternar a visibilidade das opções com base no tipo de elemento de cabeçalho selecionado
function toggleHeaderElementOptions(selectElement) {
  const parent = selectElement.closest('.header-element');
  const logoOptions = parent.querySelector('.logo-options');
  const titleOptions = parent.querySelector('.title-options');
  const bannerOptions = parent.querySelector('.banner-options');
  // Esconde todas as opções inicialmente
  if (logoOptions) logoOptions.classList.add('d-none');
  if (titleOptions) titleOptions.classList.add('d-none');
  if (bannerOptions) bannerOptions.classList.add('d-none');
 // Esconde também as prévias de imagens
  const logoPreview = parent.querySelector('.logo-preview');
  const bannerPreview = parent.querySelector('.banner-preview');
  if (logoPreview) logoPreview.style.display = 'none';
  if (bannerPreview) bannerPreview.style.display = 'none';

  if (selectElement.value === 'logo') {
      if (logoOptions) logoOptions.classList.remove('d-none');
  } else if (selectElement.value === 'title') {
      if (titleOptions) titleOptions.classList.remove('d-none');
  } else if (selectElement.value === 'banner') {
      if (bannerOptions) bannerOptions.classList.remove('d-none');
  }
}
// Função para atualizar a visualização da página combinando todos os elementos
function updatePreview() {
        const header = generateHeaderHTML();
        const menu = generateMenuHTML();
        const gallery = generateGalleryHTML();
        const form = generateFormHTML();
        const interactiveAPI = window.interactiveAPISection || ''; 
        const multipleAPIs = window.multipleAPISection || '';  
        const footer = generateFooterHTML();
        // Concatena todas as seções na ordem desejada
        document.getElementById('page-preview').innerHTML = header + menu + gallery + interactiveAPI + multipleAPIs + form + footer;
    }
// Função para salvar o HTML completo no localStorage
function saveHTML() {
    const preview = document.getElementById('page-preview').innerHTML;
      // Define o estilo da página
    const pageStyle = `
    body {
        background: ${document.getElementById('page-bg-color').value};
        color: ${document.getElementById('page-text-color').value};
        font-family: ${document.getElementById('page-font-family').value};
        max-width: ${Math.min(2000, Math.max(600, parseInt(document.getElementById('page-max-width').value) || 1200))}px;
        margin: 0 auto;
    }`;
     // Define estilos adicionais para a interface de edição
    const extraStyles = `
    .editor-panel {
      background-color: #f5f5f5;
      padding: 20px;
      border-radius: 10px;
      margin-bottom: 20px;
    }
    .preview-panel {
      border: 1px solid #ddd;
      padding: 20px;
      border-radius: 10px;
      background-color: #fff;
      min-height: 400px;
    }
    .code-panel {
      background-color: #f5f5f5;
      padding: 20px;
      border-radius: 10px;
      margin-top: 20px;
      white-space: pre-wrap;
      max-height: 500px;
      overflow-y: auto;
    }
    .tab-content {
      padding: 20px;
      border: 1px solid #ddd;
      border-top: none;
      border-radius: 0 0 10px 10px;
    }
    .nav-tabs {
      margin-bottom: 0;
    }
    .color-picker {
      height: 40px;
    }
    .header-element, .menu-item, .gallery-card, .form-field {
      border: 1px solid #ddd;
      padding: 10px;
      margin-bottom: 10px;
      border-radius: 5px;
    }
    .preview-header, .preview-menu, .preview-gallery, .preview-form, .preview-footer {
      margin-bottom: 20px;
      padding: 10px;
      border: 1px dashed #ccc;
    }
    img {
      max-width: 100%;
      height: auto;
      display: block;
    }
    h1, h2, h3, p, footer {
      word-break: break-word;
    }`;
    // Constrói o HTML completo
    const fullHTML = `<!DOCTYPE html>
  <html lang="pt-br">
  <head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Título da Página</title>
  <style>
  ${pageStyle}
  ${extraStyles}
  </style>
  </head>
  <body>
  ${preview}
  </body>
  </html>`;
    // Salva no localStorage
    localStorage.setItem('savedHTML', fullHTML);
    alert("HTML com CSS embutido salvo no localStorage!");
  }
  // Função para carregar o HTML salvo no localStorage
  function loadHTML() {
    const savedHTML = localStorage.getItem('savedHTML');
    // Mostra o código HTML salvo
    if (savedHTML) {
      document.getElementById('html-code').classList.remove('d-none');
      document.getElementById('html-code-content').textContent = savedHTML;
    } else {
      alert("Nenhum HTML salvo encontrado.");
    }
  }
  // Função para limpar o HTML salvo no localStorage
  function clearStorage() {
    localStorage.removeItem('savedHTML');
    alert("LocalStorage limpo!");
  }
  // Função para mostrar o HTML atual sem CSS embutido
  function showHTML() {
    const preview = document.getElementById('page-preview').innerHTML;
    const fullHTML = `<!DOCTYPE html>
  <html lang="pt-br">
  <head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Título da Página</title>
  </head>
  <body>
  ${preview}
  </body>
  </html>`;
    document.getElementById('html-code').classList.remove('d-none');
    document.getElementById('html-code-content').textContent = fullHTML;
  }
  
// Função para gerar o HTML do cabeçalho
function generateHeaderHTML() {
  const bgColor = document.getElementById('header-bg-color').value;
  const padding = document.getElementById('header-padding').value;
  const direction = document.getElementById('header-flex-direction').value;
  const justify = document.getElementById('header-justify-content').value;
  // Obtém todos os elementos do cabeçalho
  const elements = document.querySelectorAll('#header-elements .header-element');
  let content = '';
   // Verifica se todos os elementos estão definidos como "none"
  let allNone = true;
  elements.forEach(el => {
      const type = el.querySelector('.element-type').value;
      if (type !== 'none') {
          allNone = false;
      }
  });
 // Se todos forem "none", retorna vazio (sem cabeçalho)
  if (allNone) {
      return '';
  }
  // Processa cada elemento do cabeçalho
  elements.forEach(el => {
      const type = el.querySelector('.element-type').value;
      
      if (type === 'none') {
          return;
      }

      if (type === 'logo') {
          const logoPreview = el.querySelector('.logo-preview');
          const hasUploadedLogo = logoPreview && logoPreview.style.display !== 'none' && logoPreview.src;
          
          if (hasUploadedLogo) {
              const widthInput = el.querySelector('.logo-width').value;
              const width = Math.min(500, Math.max(50, parseInt(widthInput) || 200));
              content += `<img src="${logoPreview.src}" style="width:${width}px;" alt="Logo">`;
          } else {
              const url = el.querySelector('.logo-url').value;
              const widthInput = el.querySelector('.logo-width').value;
              const width = Math.min(500, Math.max(50, parseInt(widthInput) || 200));
              content += `<img src="${url}" style="width:${width}px;" alt="Logo">`;
          }
      } else if (type === 'title') {
          const text = el.querySelector('.title-text').value;
          const color = el.querySelector('.title-color').value;
          const sizeInput = el.querySelector('.title-size').value;
              const size = Math.min(72, Math.max(12, parseInt(sizeInput) || 36));
          content += `<h1 style="color:${color}; font-size:${size}px;">${text}</h1>`;
      } else if (type === 'banner') {
          const bannerPreview = el.querySelector('.banner-preview');
          const hasUploadedBanner = bannerPreview && bannerPreview.style.display !== 'none' && bannerPreview.src;
          
          if (hasUploadedBanner) {
              const heightInput = el.querySelector('.banner-height').value;
              const height = Math.min(300, Math.max(50, parseInt(heightInput) || 150));
              content += `<img src="${bannerPreview.src}" style="height:${height}px; width:100%;" alt="Banner">`;
          } else {
              const url = el.querySelector('.banner-url').value;
              const heightInput = el.querySelector('.banner-height').value;
              const height = Math.min(300, Math.max(50, parseInt(heightInput) || 150));
              content += `<img src="${url}" style="height:${height}px; width:100%;" alt="Banner">`;
          }
      }
  });
  
  if (!content) {
      return '';
  }
   // Retorna o HTML do cabeçalho com o conteúdo
  return `<header style="background:${bgColor}; padding:${padding}px; display:flex; flex-direction:${direction}; justify-content:${justify}; align-items:center; gap:10px;">${content}</header>`;
}

function generateMenuHTML() {
  const bgColor = document.getElementById('menu-bg-color').value;
  const itemBgColor = document.getElementById('menu-item-bg-color').value;
  const textColor = document.getElementById('menu-text-color').value;
  const padding = document.getElementById('menu-padding').value;
  const itemPadding = document.getElementById('menu-item-padding').value;
  const orientation = document.getElementById('menu-orientation').value;
  const imgUrl = document.getElementById('menu-image-url').value;
  const imgPos = document.getElementById('menu-image-position').value;
  
  const menuImagePreview = document.getElementById('menu-image-preview');
  const hasUploadedMenuImage = menuImagePreview && menuImagePreview.style.display !== 'none' && menuImagePreview.src;
  const finalImageUrl = hasUploadedMenuImage ? menuImagePreview.src : imgUrl;

  const items = document.querySelectorAll('#menu-items .menu-item');
  let listItems = '';
  items.forEach(item => {
      const text = item.querySelector('.menu-item-text').value;
      const link = item.querySelector('.menu-item-link').value;
       // Cria a tag de imagem se houver URL
      listItems += `<li style="background:${itemBgColor}; padding:${itemPadding}px; margin:2px;"><a href="${link}" style="color:${textColor}; text-decoration:none;">${text}</a></li>`;
  });

  const imgTag = finalImageUrl ? `<img src="${finalImageUrl}" alt="Menu image" style="max-width:100%; height:auto; margin-bottom:10px;">` : '';
  const finalList = `<ul style="list-style:none; display:flex; flex-direction:${orientation === 'horizontal' ? 'row' : 'column'}; gap:5px; padding:0; margin:0;">${listItems}</ul>`;

  return `<nav style="background:${bgColor}; padding:${padding}px;">${imgPos === 'top' ? imgTag + finalList : finalList + imgTag}</nav>`;
}
// Função para gerar o HTML da galeria
function generateGalleryHTML() {
  const bgColor = document.getElementById('gallery-bg-color').value;
  const padding = document.getElementById('gallery-padding').value;
  const cardBg = document.getElementById('gallery-card-bg-color').value;
  const borderColor = document.getElementById('gallery-card-border-color').value;
  const textColor = document.getElementById('gallery-card-text-color').value;
  const columns = document.getElementById('gallery-columns').value;
  
  const cards = document.querySelectorAll('#gallery-cards .gallery-card');
  let cardsHTML = '';
  cards.forEach(card => {
      const imgSelect = card.querySelector('.gallery-image');
      const imgValue = imgSelect.value;
      let imgUrl = imgValue;
      // Usa a imagem carregada se selecionada
      if (imgValue === 'uploaded' && window.galleryUploadedImage) {
          imgUrl = window.galleryUploadedImage;
      }
      
      const title = card.querySelector('.gallery-title').value;
      const desc = card.querySelector('.gallery-description').value;
      cardsHTML += `<div style="border:1px solid ${borderColor}; background:${cardBg}; color:${textColor}; padding:10px;">
                      <img src="${imgUrl}" alt="" style="width:100%;"><h3>${title}</h3><p>${desc}</p></div>`;
  });
 // Retorna o HTML da galeria com os cards em grid
  return `<section style="background:${bgColor}; padding:${padding}px;">
              <div style="display:grid; grid-template-columns: repeat(${columns}, 1fr); gap:10px;">${cardsHTML}</div>
          </section>`;
}
// Função para gerar o HTML do formulário
function generateFormHTML() {
    const title = document.getElementById('form-title').value;
    const bgColor = document.getElementById('form-bg-color').value;
    const padding = document.getElementById('form-padding').value;
    const borderColor = document.getElementById('form-border-color').value;
    const textColor = document.getElementById('form-text-color').value;
    // Inicia o HTML com o título e abertura da tag form
    const fields = document.querySelectorAll('#form-fields .form-field');
    let formHTML = `<h3 style="color:${textColor};">${title}</h3><form style="color:${textColor};">`;
    // Processa cada campo do formulário
    fields.forEach(field => {
        const label = field.querySelector('.field-label').value;
        const type = field.querySelector('.field-type').value;
        const required = field.querySelector('.field-required').value === "true" ? "required" : "";
        // Cria HTML diferente com base no tipo de campo
        if (type === "select") {
            const options = field.querySelector('.select-options-values').value.split(",").map(opt => `<option>${opt.trim()}</option>`).join("");
            formHTML += `<label>${label}</label><select ${required}>${options}</select><br>`;
        } else if (type === "radio") {
            const options = field.querySelector('.radio-options-values').value.split(",").map(opt => `<label><input type="radio" name="${label}" ${required}> ${opt.trim()}</label>`).join(" ");
            formHTML += `<p>${label}:</p>${options}<br>`;
        } else if (type === "textarea") {
            formHTML += `<label>${label}</label><textarea ${required}></textarea><br>`;
        } else {
            formHTML += `<label>${label}</label><input type="${type}" ${required}><br>`;
        }
    });

    formHTML += `<button type="submit">Enviar</button>`;
    formHTML += `</form>`;
    // Retorna o HTML do formulário dentro de uma seção
    return `<section style="background:${bgColor}; border:1px solid ${borderColor}; padding:${padding}px;">${formHTML}</section>`;
}
// Função para gerar o HTML do rodapé
function generateFooterHTML() {
    const bgColor = document.getElementById('footer-bg-color').value;
    const textColor = document.getElementById('footer-text-color').value;
    const paddingInput = document.getElementById('footer-padding').value;
    const padding = Math.min(50, Math.max(0, parseInt(paddingInput) || 20));
    const align = document.getElementById('footer-text-align').value;
    const fontSizeInput = document.getElementById('footer-font-size').value;
    const fontSize = Math.min(24, Math.max(10, parseInt(fontSizeInput) || 14));
    const text = document.getElementById('footer-text').value;

    return `<footer style="background:${bgColor}; color:${textColor}; padding:${padding}px; text-align:${align}; font-size:${fontSize}px;">${text}</footer>`;
}

function addMenuItem() {
    menuItems++;
    const container = document.getElementById('menu-items');
    const clone = container.firstElementChild.cloneNode(true);
    
    clone.querySelector('.menu-item-text').value = 'Item ' + menuItems;
    clone.querySelector('.menu-item-link').value = '#';
    // Adiciona o novo item ao container
    container.appendChild(clone);
}
// Função para adicionar um novo card de galeria
function addGalleryCard() {
    galleryCards++;
    const container = document.getElementById('gallery-cards');
    const clone = container.firstElementChild.cloneNode(true);
  
    clone.querySelector('.gallery-title').value = 'Card ' + galleryCards;
    clone.querySelector('.gallery-description').value = 'Descrição do card ' + galleryCards;
    
    container.appendChild(clone);
}
// Função para adicionar um novo campo ao formulário
function addFormField() {
    formFields++;
    const container = document.getElementById('form-fields');
    const clone = container.firstElementChild.cloneNode(true);
    
    clone.querySelector('.field-label').value = 'Campo ' + formFields;
    
    const fieldType = clone.querySelector('.field-type');
    fieldType.value = 'text'; 
    
    const selectOptions = clone.querySelector('.select-options');
    const radioOptions = clone.querySelector('.radio-options');
    if (selectOptions) selectOptions.classList.add('d-none');
    if (radioOptions) radioOptions.classList.add('d-none');
    
    container.appendChild(clone);
}
// Função para adicionar um novo elemento ao cabeçalho
function addHeaderElement() {
    // Limita o número máximo de elementos a 3
    if (document.querySelectorAll('#header-elements .header-element').length >= 3) {
        alert('Máximo de 3 elementos permitidos no cabeçalho!');
        return;
    }
    
    headerElements++;
    const container = document.getElementById('header-elements');
    const clone = container.firstElementChild.cloneNode(true);
    
    const elementType = clone.querySelector('.element-type');
    
    let hasNoneOption = false;
    for (let i = 0; i < elementType.options.length; i++) {
        if (elementType.options[i].value === 'none') {
            hasNoneOption = true;
            break;
        }
    }
    
    if (!hasNoneOption) {
        const noneOption = document.createElement('option');
        noneOption.value = 'none';
        noneOption.textContent = 'Nenhum';
        elementType.insertBefore(noneOption, elementType.firstChild);
    }
    
    elementType.value = 'logo';

    const logoOptions = clone.querySelector('.logo-options');
    const titleOptions = clone.querySelector('.title-options');
    const bannerOptions = clone.querySelector('.banner-options');
    
    logoOptions.classList.remove('d-none');
    titleOptions.classList.add('d-none');
    bannerOptions.classList.add('d-none');
    
    container.appendChild(clone);
}

function toggleFormFieldOptions(selectElement) {
    const parent = selectElement.closest('.form-field');
    const selectOptions = parent.querySelector('.select-options');
    const radioOptions = parent.querySelector('.radio-options');
    
    if (selectOptions) selectOptions.classList.add('d-none');
    if (radioOptions) radioOptions.classList.add('d-none');

    if (selectElement.value === 'select' && selectOptions) {
        selectOptions.classList.remove('d-none');
    } else if (selectElement.value === 'radio' && radioOptions) {
        radioOptions.classList.remove('d-none');
    }
}
