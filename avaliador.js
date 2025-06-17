function avaliar(noDaAST) {
  if (noDaAST.tipo === 'PROGRAMA') {
    noDaAST.corpo.forEach(avaliar);
  }

  if (noDaAST.tipo === 'CHAMADA_DE_FUNCAO') {
    if (noDaAST.nome === 'escreva') {
      const valor = noDaAST.argumentos[0].valor;
      console.log(valor);
    }
  }
}

module.exports = avaliar;