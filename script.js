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

const malhas = [/*...*/]; // mantido igual
const meioes = [/*...*/]; // mantido igual

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
  // seus valores anteriores, mantidos
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
      const grupos = {
        "ADT - KANXA": [],
        "JUV - KANXA": [],
        "INF - KANXA": [],
        "ADT - FINTA": [],
        "JUV - FINTA": [],
        "INF - FINTA": [],
        OUTROS: []
      };

      cat.items.forEach(item => {
        if (item.includes("ADT - KANXA")) grupos["ADT - KANXA"].push(item);
        else if (item.includes("JUV - KANXA")) grupos["JUV - KANXA"].push(item);
        else if (item.includes("INF - KANXA")) grupos["INF - KANXA"].push(item);
        else if (item.includes("ADT - FINTA")) grupos["ADT - FINTA"].push(item);
        else if (item.includes("JUV - FINTA")) grupos["JUV - FINTA"].push(item);
        else if (item.includes("INF - FINTA")) grupos["INF - FINTA"].push(item);
        else grupos.OUTROS.push(item);
      });

      for (const grupo in grupos) {
        if (grupos[grupo].length > 0) {
          ul.appendChild(criarSubtitulo(grupo));
          grupos[grupo].forEach(itemName => {
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

            li.appendChild(span);
            li.appendChild(input);
            ul.appendChild(li);
          });
        }
      }

    } else {
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