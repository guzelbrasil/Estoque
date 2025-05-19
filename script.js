// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyCSObisT9tnm6TM9gzRH782YAebfTzsp2U",
  authDomain: "estoqueguzel.firebaseapp.com",
  databaseURL: "https://estoqueguzel-default-rtdb.firebaseio.com",
  projectId: "estoqueguzel",
  storageBucket: "estoqueguzel.firebasestorage.app",
  messagingSenderId: "933342103585",
  appId: "1:933342103585:web:cba330f76f53821b367b60",
  measurementId: "G-KBSGPWQG8E"
};

// Inicializa Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// Dados iniciais para popular a base, caso esteja vazia
const dadosIniciais = {
  tintas: {
    "Branco": 50,
    "Preto": 30,
    "Azul Royal": 20,
    "Vermelho": 15,
  },
  malhas: {
    "HELANCA": 100,
    "DRY 180 PLUS EF": 80,
    "DRY 180 EF": 75,
    "DRY SOFT": 60,
    "DRY FLEX UV": 40,
    "JIMP DRY LARGE": 25,
    "JIMP DRY": 30,
    "MANCHESTER": 55,
    "ABSTRACT": 10,
    "ACTION": 8,
    "EURO": 20,
    "CHIMPA": 5,
    "HELANCA FLANELADA": 35,
    "DRY UV EMATEX": 22,
    "DRY 100 EMATEX": 45,
    "GABARDINE": 38,
    "FURADINHO": 15,
    "NBA": 12,
    "NBA (FURADINHO)": 6,
    "OXFORD": 50,
    "OXFORDINE": 40,
    "QUADRADINHO": 9,
    "TECTEL": 7,
    "BORA-BORA": 18,
    "PP 100% POLY": 28
  },
  papeis: {
    "Sulfite A4": 1000,
    "Couche 120g": 500,
    "Reciclado": 300,
    "Cartolina": 150,
  }
};

// Popula a base se estiver vazia
function popularDadosSeVazio() {
  db.ref('/').once('value').then(snapshot => {
    if (!snapshot.exists()) {
      db.ref('/').set(dadosIniciais);
    }
  });
}

// Renderiza lista com inputs editáveis dentro do form
function renderizarListaComInputs(categoria, ulId) {
  const listaEl = document.getElementById(ulId);

  db.ref(categoria).on('value', snapshot => {
    const dados = snapshot.val() || {};
    listaEl.innerHTML = ''; // limpa lista

    for (const item in dados) {
      const quantidade = dados[item];
      const li = document.createElement('li');

      // Label com nome do item
      const label = document.createElement('label');
      label.htmlFor = `${categoria}-${item}`;
      label.textContent = item;

      // Input number editável
      const input = document.createElement('input');
      input.type = 'number';
      input.id = `${categoria}-${item}`;
      input.name = item;
      input.min = 0;
      input.value = quantidade;

      li.appendChild(label);
      li.appendChild(input);
      listaEl.appendChild(li);
    }
  });
}

// Função para salvar as alterações no Firebase (categoria)
function salvarAlteracoes(event, categoria) {
  event.preventDefault();
  const form = event.target;
  const dadosAtualizados = {};

  // coleta todos os inputs do form
  const inputs = form.querySelectorAll('input[type="number"]');
  inputs.forEach(input => {
    const nomeItem = input.name;
    let valor = parseInt(input.value);
    if (isNaN(valor) || valor < 0) valor = 0; // valida
    dadosAtualizados[nomeItem] = valor;
  });

  // Atualiza no Firebase
  db.ref(categoria).set(dadosAtualizados)
    .then(() => alert(`Estoque de ${categoria} atualizado com sucesso!`))
    .catch(err => alert('Erro ao atualizar estoque: ' + err.message));
}

// Inicialização
popularDadosSeVazio();

renderizarListaComInputs('tintas', 'lista-tintas');
renderizarListaComInputs('malhas', 'lista-malhas');
renderizarListaComInputs('papeis', 'lista-papeis');

// Adiciona eventos para salvar cada categoria
document.getElementById('form-tintas').addEventListener('submit', e => salvarAlteracoes(e, 'tintas'));
document.getElementById('form-malhas').addEventListener('submit', e => salvarAlteracoes(e, 'malhas'));
document.getElementById('form-papeis').addEventListener('submit', e => salvarAlteracoes(e, 'papeis'));