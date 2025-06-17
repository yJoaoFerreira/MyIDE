Programa = corpo:Comando* {
  return { tipo: "PROGRAMA", corpo: corpo };
}

Comando = ChamadaEscreva

ChamadaEscreva = "escreva" _ "(" _ argumento:Texto _ ")" _ {
  return {
    tipo: "CHAMADA_DE_FUNCAO",
    nome: "escreva",
    argumentos: [argumento]
  };
}

Texto = '"' chars:([^"]*) '"' {
  return { tipo: "LITERAL_TEXTO", valor: chars.join('') };
}

_ "espaço" = [ \t\n\r]*