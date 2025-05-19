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
  "HELANCA", "DRY 180 PLUS EF", "DRY 180 EF 1,60", "DRY SOFT", "DRY FLEX UV",
  "JIMP DRY", "JIMP DRY 1,60", "MANCHESTER", "ABSTRACT", "ACTION", "EURO",
  "CHIMPA", "HELANCA FLANELADA", "DRY UV EMATEX", "DRY 100 EMATEX", "GABARDINE",
  "FURADINHO", "NBA", "NBA (FURADINHO)", "OXFORD", "OXFORDINE", "QUADRADINHO",
  "TECTEL", "BORA-BORA", "PP 100% POLY", "PUNHO DRY", "PUNHO FIRME"
];

const meioes = [
  "ADT- KANXA PRETO", "ADT- KANXA BRANCO", "ADT- KANXA AZ. ROYAL", "ADT- KANXA AZ. MARINHO",
  "ADT- KANXA AMARELO", "ADT- KANXA VERMELHO", "ADT- KANXA VERDE", "ADT- KANXA VERDE E PR.",
  "ADT- KANXA VERMELHO E BR.", "ADT- KANXA AZ. CLARO", "JUV- KANXA PRETO", "JUV- KANXA BRANCO",
  "JUV- KANXA AZ. ROYAL", "JUV- KANXA AZ. MARINHO", "JUV- KANXA AMARELO", "JUV- KANXA VERMELHO",
  "JUV- KANXA VERDE", "JUV- KANXA LARANJA", "INF- KANXA PRETO", "INF- KANXA BRANCO",
  "INF- KANXA AZ. ROYAL", "INF- KANXA AZ. MARINHO", "INF- KANXA AMARELO", "INF- KANXA VERMELHO",
  "INF- KANXA VERDE", "INF- KANXA LARANJA", "ADT- FINTA PRETO", "ADT- FINTA BRANCO",
  "ADT- FINTA AZ. ROYAL", "ADT- FINTA AZ. MARINHO", "ADT- FINTA AMARELO", "ADT- FINTA VERMELHO",
  "ADT- FINTA VERDE", "JUV- FINTA AZ. MARINHO", "JUV- FINTA VERMELHO", "INF- FINTA BRANCO",
  "INF- FINTA AZ. CLARO"
];

const categories = {
  malhas: { name: "Malhas", items: malhas },
  tintas: {
    name: "Tintas",
    items: ["Tinta Ciano", "Tinta Magenta", "Tinta Amarelo", "Tinta Preto"]
  },
  papeis: {
    name: "Papéis",
    items: ["Papel Condelhove 1,80m", "Papel Condelhove 1,60m", "Papel Wiprime", "Papel Seda 40g", "Papel Kraft 1,80", "Papel Kraft 1,60"]
  },
  meioes: {
    name: "Meiões",
    items: meioes
  }
};

const estoqueMinimo = {
  "HELANCA LIGHT": 6,
  "DRY SOFT": 12,
  "JIMP DRY": 17,
  "MANCHESTER": 3,
  "ABSTRACT": 3,
  "ACTION": 3,
  "CHIMPA": 3,
  "GABARDINE": 1,
  "FURADINHO": 2,
  "NBA": 1,
  "NBA (FURADINHO)": 1,
  "OXFORD": 1,
  "OXFORDINE": 1,
  "QUADRADINHO": 3,
  "BORA-BORA": 1,
  "PUNHO DRY": 4,
  "PUNHO FIRME": 2,
  "Tinta Ciano": 3,
  "Tinta Magenta": 3,
  "Tinta Amarelo": 3,
  "Tinta Preto": 3,
  "Papel Condelhove 1,80m": 11,
  "Papel Condelhove 1,60m": 4,
  "Papel Wiprime": 4,
  "Papel Seda 40g": 4,
  "Papel Kraft 1,80": 3
};

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

    cat.items.forEach(itemName => {
      const li = document.createElement("li");
      const span = document.createElement("span");
      span.textContent = itemName;

      let qty = 0;
      if (dataFromFirebase?.[key]?.[itemName] !== undefined) {
        qty = dataFromFirebase[key][itemName];
      }

      const input = document.createElement("input");
      input.type = "number";
      input.min = 0;
      input.value = qty;
      input.classList.add("qty-input");
      input.dataset.cat = key;
      input.dataset.item = itemName;

      const minimo = estoqueMinimo[itemName.toUpperCase()] || estoqueMinimo[itemName];
      if (minimo !== undefined && qty < minimo) {
        li.style.backgroundColor = "#ffe5e5";
        li.title = `Estoque mínimo recomendado: ${minimo}`;
      }

      li.appendChild(span);
      li.appendChild(input);
      ul.appendChild(li);
    });

    const btnSave = document.createElement("button");
    btnSave.textContent = "Salvar";
    btnSave.classList.add("save-btn");
    btnSave.onclick = () => salvarCategoria(key, divCat);

    divCat.appendChild(ul);
    divCat.appendChild(btnSave);
    container.appendChild(divCat);
  }
}

function salvarCategoria(catKey, divCat) {
  const inputs = divCat.querySelectorAll("input.qty-input");
  const updates = {};
  inputs.forEach(input => {
    const item = input.dataset.item;
    const value = parseInt(input.value);
    updates[item] = value >= 0 ? value : 0;
  });

  firebase.database().ref(catKey).set(updates)
    .then(() => alert(`Estoque da categoria ${categories[catKey].name} salvo com sucesso!`))
    .catch(err => alert("Erro ao salvar no Firebase: " + err));
}

function carregarDados() {
  firebase.database().ref().once("value")
    .then(snapshot => {
      montarInterface(snapshot.val());
    })
    .catch(err => {
      alert("Erro ao carregar dados do Firebase: " + err);
      montarInterface(null);
    });
}

window.onload = carregarDados;
