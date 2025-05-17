function alterarQuantidade(item, incremento) {
  const quantidadeElemento = document.getElementById(`quantidade-${item}`);
  let quantidade = parseInt(quantidadeElemento.textContent);

  // Alterar a quantidade com base no incremento
  quantidade += incremento;
  if (quantidade < 0) quantidade = 0; // Garantir que a quantidade não seja negativa

  quantidadeElemento.textContent = quantidade;
}