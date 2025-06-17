const readlineSync = require('readline-sync');
const ambiente = new Map();

function obterValor(no) {
  if (no.tipo === 'LITERAL_TEXTO' || no.tipo === 'LITERAL_NUMERICO') {
    return no.valor;
  }
  
  if (no.tipo === 'IDENTIFICADOR') {
    if (!ambiente.has(no.valor)) {
      throw new Error(`Erro: A variável "${no.valor}" não foi definida.`);
    }
    return ambiente.get(no.valor);
  }
}

function avaliar(noDaAST) {
  switch (noDaAST.tipo) {
    case 'PROGRAMA':
      noDaAST.corpo.forEach(avaliar);
      break;

    case 'DECLARACAO_VAR':
      noDaAST.variaveis.forEach(variavelNode => {
        if (ambiente.has(variavelNode.valor)) {
          throw new Error(`Erro: A variável "${variavelNode.valor}" já foi declarada.`);
        }
        ambiente.set(variavelNode.valor, null);
      });
      break;

    case 'ATRIBUICAO_VAR':
      const nomeVar = noDaAST.variavel.valor;
      if (!ambiente.has(nomeVar)) {
        throw new Error(`Erro: A variável "${nomeVar}" não foi declarada antes da atribuição.`);
      }
      const valorAtribuir = obterValor(noDaAST.valor);
      ambiente.set(nomeVar, valorAtribuir);
      break;

    case 'CHAMADA_DE_FUNCAO':
      if (noDaAST.nome === 'escreva') {
        const valorParaEscrever = obterValor(noDaAST.argumentos[0]);
        process.stdout.write(String(valorParaEscrever));
      } 
      
      else if (noDaAST.nome === 'leia') {
        const nomeVarParaLer = noDaAST.argumentos[0].valor;
        if (!ambiente.has(nomeVarParaLer)) {
          throw new Error(`Erro: A variável "${nomeVarParaLer}" não foi declarada.`);
        }
        const valorLido = readlineSync.question();
        const valorLidoConvertido = !isNaN(parseFloat(valorLido)) ? parseFloat(valorLido) : valorLido;
        ambiente.set(nomeVarParaLer, valorLidoConvertido);
      }
      break;
  }
}

module.exports = avaliar;