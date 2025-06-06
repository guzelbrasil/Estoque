const firebaseConfig = {
  apiKey: "AIzaSyCSObisT9tnm6TM9gzRH782YAebfTzsp2U",
  authDomain: "estoqueguzel.firebaseapp.com",
  databaseURL: "https://estoqueguzel-default-rtdb.firebaseio.com",
  projectId: "estoqueguzel",
  storageBucket: "estoqueguzel.appspot.com",
  messagingSenderId: "933342103585",
  appId: "1:933342103585:web:cba330f76f53821b367b60",
  measurementId: "G-KBSGPWQG8E"
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();

const malhas = [
  "HELANCA", "DRY 180 PLUS", "DRY 180 1,60", "DRY SOFT", "JIMP DRY", "JIMP DRY 1,60",
  "MANCHESTER", "ABSTRACT 1,70", "ACTION", "GABARDINE 1,50", "CHIMPA 1,60", "HELANCA FLANELADA 1,50",
  "FURADINHO 1,75", "NBA 1,60", "NBA (FURADINHO) 1,40", "OXFORD 1,40", "DRY UV 1,60", "DRY 100",
  "OXFORDINE 1,40", "QUADRADINHO 1,40", "BORA BORA 1,60", "PUNHO DRY", "PUNHO FIRME", "PP 100% POLY"
];

const meioes = [
  "ADT - KANXA PRETO", "ADT - KANXA BRANCO", "ADT - KANXA AZ ROYAL", "ADT - KANXA AZ MARINHO",
  "ADT - KANXA AMARELO", "ADT - KANXA VERMELHO", "ADT - KANXA VERDE", "ADT - KANXA VERDE E PRETO",
  "ADT - KANXA VERMELHO E BRANCO", "ADT - KANXA AZ CLARO", "JUV - KANXA PRETO", "JUV - KANXA BRANCO",
  "JUV - KANXA AZ ROYAL", "JUV - KANXA AZ MARINHO", "JUV - KANXA AMARELO", "JUV - KANXA VERMELHO",
  "JUV - KANXA VERDE", "JUV - KANXA LARANJA", "INF - KANXA PRETO", "INF - KANXA BRANCO",
  "INF - KANXA AZ ROYAL", "INF - KANXA AZ MARINHO", "INF - KANXA AMARELO", "INF - KANXA VERMELHO",
  "INF - KANXA VERDE", "INF - KANXA LARANJA", "ADT - FINTA PRETO", "ADT - FINTA BRANCO",
  "ADT - FINTA AZ ROYAL", "ADT - FINTA AZ MARINHO", "ADT - FINTA AMARELO", "ADT - FINTA VERMELHO",
  "ADT - FINTA VERDE", "JUV - FINTA PRETO", "JUV - FINTA BRANCO", "JUV - FINTA AZ ROYAL",
  "JUV - FINTA AZ MARINHO", "JUV - FINTA AMARELO", "JUV - FINTA VERMELHO", "JUV - FINTA VERDE",
  "INF - FINTA PRETO", "INF - FINTA BRANCO", "INF - FINTA AZ ROYAL", "INF - FINTA AZ MARINHO",
  "INF - FINTA AMARELO", "INF - FINTA VERMELHO", "INF - FINTA VERDE"
];

const categories = {
  malhas: { name: "Malhas", items: malhas },
  tintas: { name: "Tintas", items: ["Tinta Ciano", "Tinta Magenta", "Tinta Amarelo", "Tinta Preto"] },
  papeis: {
    name: "Papéis",
    items: [
      "Papel Coldenhove 1,80m", "Papel Coldenhove 1,60m",
      "Papel Seda 40g", "Papel Wiprime",
      "Papel Kraft 1,80", "Papel Kraft 1,60"
    ]
  },
  meioes: { name: "Meiões", items: meioes }
};

const estoqueMinimo = {
  "HELANCA": 6, "DRY SOFT": 12, "JIMP DRY": 17, "MANCHESTER": 3, "ABSTRACT 1,70": 3,
  "ACTION": 3, "GABARDINE 1,50": 1, "CHIMPA 1,60": 3, "FURADINHO 1,75": 2, "NBA 1,60": 1,
  "NBA (FURADINHO) 1,40": 1, "OXFORD 1,40": 1, "OXFORDINE 1,40": 1, "QUADRADINHO 1,40": 3,
  "BORA BORA 1,60": 1, "PUNHO DRY": 4, "PUNHO FIRME": 2, "PP 100% POLY": 1,
  "TINTA CIANO": 3, "TINTA MAGENTA": 3, "TINTA AMARELO": 3, "TINTA PRETO": 3,
  "PAPEL COLDENHOVE 1,80M": 10, "PAPEL COLDENHOVE 1,60M": 3, "PAPEL SEDA 40G": 3,
  "PAPEL WIPRIME": 10, "PAPEL KRAFT 1,80": 3, "PAPEL KRAFT 1,60": 1
};

function criarSubtitulo(texto) {
  const li = document.createElement("li");
  li.textContent = texto;
  li.style.fontWeight = "bold";
  li.style.gridColumn = "1 / -1";
  li.style.marginTop = "16px";
  li.style.padding = "4px 8px";
  li.style.backgroundColor = "#f0f0f0";
  li.style.borderRadius = "6px";
  return li;
}

function montarInterface(dataFromFirebase) {
  const container = document.getElementById("categories");
  container.innerHTML = "";

  for (const key in categories) {
    const cat = categories[key];
    const divCat = document.createElement("div");
    divCat.classList.add("category");

    const h2 = document.createElement("h2");
    h2.textContent = cat.name;
    h2.onclick = () => {
      const ul = divCat.querySelector("ul");
      ul.style.display = (ul.style.display === "none" || ul.style.display === "") ? "grid" : "none";
    };
    divCat.appendChild(h2);

    const ul = document.createElement("ul");
    ul.classList.add("items");

    if (key === "meioes") {
      // Agrupa meiões por prefixo e cria subtítulos
      const grupos = {
        "ADT - KANXA": [], "JUV - KANXA": [], "INF - KANXA": [],
        "ADT - FINTA": [], "JUV - FINTA": [], "INF - FINTA": [],
        OUTROS: []
      };
      cat.items.forEach(item => {
        const prefixo = Object.keys(grupos).find(grupo => item.startsWith(grupo)) || "OUTROS";
        grupos[prefixo].push(item);
      });
      for (const grupo in grupos) {
        if (grupos[grupo].length > 0) {
          ul.appendChild(criarSubtitulo(grupo));
          grupos[grupo].forEach(itemName => {
            ul.appendChild(criarItem(key, itemName, dataFromFirebase));
          });
        }
      }
    } else {
      cat.items.forEach(itemName => {
        ul.appendChild(criarItem(key, itemName, dataFromFirebase));
      });
    }

    const btnSave = document.createElement("button");
    btnSave.textContent = "Salvar";
    btnSave.classList.add("save-btn");
    btnSave.onclick = () => salvarCategoria(key, divCat);

    divCat.appendChild(ul);
    divCat.appendChild(btnSave);
    container.appendChild(divCat);
  }
}

function criarItem(categoria, nomeItem, dataFromFirebase) {
  const li = document.createElement("li");
  li.classList.add("item");

  const spanNome = document.createElement("span");
  spanNome.textContent = nomeItem;

  const inputQty = document.createElement("input");
  inputQty.type = "number";
  inputQty.min = 0;
  inputQty.classList.add("qty-input");

  // Busca valor no Firebase
  let valorFirebase = 0;
  if (dataFromFirebase && dataFromFirebase[categoria] && dataFromFirebase[categoria][nomeItem] !== undefined) {
    valorFirebase = dataFromFirebase[categoria][nomeItem];
  }
  inputQty.value = valorFirebase;

  // Alerta estoque mínimo
  const estoqueMin = estoqueMinimo[nomeItem.toUpperCase()] ?? 0;
  if (estoqueMin > 0 && Number(inputQty.value) < estoqueMin) {
    inputQty.classList.add("below-min");
  }

  li.appendChild(spanNome);
  li.appendChild(inputQty);
  return li;
}

function salvarCategoria(categoriaKey, divCat) {
  const inputs = divCat.querySelectorAll("input.qty-input");
  const updates = {};
  inputs.forEach(input => {
    const nomeItem = input.previousSibling.textContent;
    let valor = Number(input.value);
    if (isNaN(valor) || valor < 0) valor = 0;
    updates[`${categoriaKey}/${nomeItem}`] = valor;
  });

  database.ref().update(updates)
    .then(() => {
      alert(`Estoque da categoria "${categories[categoriaKey].name}" salvo com sucesso!`);
      atualizarAlertas();
    })
    .catch(err => alert("Erro ao salvar estoque: " + err.message));
}

function atualizarAlertas() {
  const allInputs = document.querySelectorAll("input.qty-input");
  allInputs.forEach(input => {
    const nomeItem = input.previousSibling.textContent;
    const min = estoqueMinimo[nomeItem.toUpperCase()] ?? 0;
    if (min > 0 && Number(input.value) < min) {
      input.classList.add("below-min");
    } else {
      input.classList.remove("below-min");
    }
  });
}

function iniciar() {
  database.ref().on("value", snapshot => {
    const dados = snapshot.val() || {};
    montarInterface(dados);
  });
}

window.onload = iniciar;
