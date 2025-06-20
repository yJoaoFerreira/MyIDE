const readlineSync = require('readline-sync');
const ambiente = new Map();

function obterValor(no) {
  if (!no || typeof no.tipo === 'undefined') { return no; }
  switch (no.tipo) {
    case 'LITERAL_TEXTO':
    case 'LITERAL_NUMERICO':
      return no.valor;
    case 'IDENTIFICADOR':
      if (!ambiente.has(no.valor)) { throw new Error(`Erro: A variável "${no.valor}" não foi definida.`); }
      return ambiente.get(no.valor);
    case 'TEXTO_FORMATADO':
      let stringMontada = '';
      no.partes.forEach(parte => {
        if (typeof parte === 'string') {
          stringMontada += parte;
        } else if (parte.tipo === 'IDENTIFICADOR') {
          stringMontada += obterValor(parte);
        }
      });
      return stringMontada;
    default:
      throw new Error(`Erro: Tipo de valor desconhecido para obter: "${no.tipo}"`);
  }
}

function avaliar(noDaAST) {
  if (!noDaAST) return;

  switch (noDaAST.tipo) {
    case 'PROGRAMA':
      noDaAST.corpo.forEach(avaliar);
      break;
    case 'DECLARACAO_VAR':
      noDaAST.variaveis.forEach(variavelNode => {
        if (ambiente.has(variavelNode.valor)) { throw new Error(`Erro: A variável "${variavelNode.valor}" já foi declarada.`); }
        ambiente.set(variavelNode.valor, null);
      });
      break;
    case 'ATRIBUICAO_VAR':
      const nomeVar = noDaAST.variavel.valor;
      if (!ambiente.has(nomeVar)) { throw new Error(`Erro: A variável "${nomeVar}" não foi declarada antes da atribuição.`); }
      const valorAtribuir = obterValor(noDaAST.valor);
      ambiente.set(nomeVar, valorAtribuir);
      break;
    case 'CHAMADA_DE_FUNCAO':
      // LÓGICA DE IMPRESSÃO SIMPLIFICADA
      if (noDaAST.nome === 'escreva') {
        // Itera sobre todos os argumentos e os imprime na mesma linha.
        noDaAST.argumentos.forEach(argumento => {
          const valorParaEscrever = obterValor(argumento);
          process.stdout.write(String(valorParaEscrever));
        });
        // Não há mais o console.log() aqui, então não pula a linha automaticamente.
      } 
      else if (noDaAST.nome === 'leia') {
        const nomeVarParaLer = noDaAST.argumentos[0].valor;
        if (!ambiente.has(nomeVarParaLer)) { throw new Error(`Erro: A variável "${nomeVarParaLer}" não foi declarada.`); }
        const valorLido = readlineSync.question();
        const valorLidoConvertido = !isNaN(parseFloat(valorLido)) ? parseFloat(valorLido) : valorLido;
        ambiente.set(nomeVarParaLer, valorLidoConvertido);
      }
      break;
  }
}

module.exports = avaliar;