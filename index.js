const fs = require('fs');
const parser = require('./parser.js');
const avaliar = require('./avaliador.js');

const codigo = fs.readFileSync('exemplo.ptgl', 'utf-8');

try {
  const ast = parser.parse(codigo);

  // console.log("--- AST Gerada ---");
  // console.log(JSON.stringify(ast, null, 2));
  console.log("--- Executando Código ---");

  avaliar(ast);

} catch (e) {
  console.error("\n--- Ocorreu um Erro ---");
  console.error(e.message);
}