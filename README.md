# Scripts

Este projeto contém os seguintes scripts para facilitar o desenvolvimento, compilação e teste do código.

## Como usar

No diretório do projeto, você pode executar os seguintes comandos:

### `npm start`

Inicia a aplicação em modo de desenvolvimento. Este comando irá transpilar e assistir o arquivo `src/main.ts` para mudanças.

### `npm run build`

Compila o projeto TypeScript. Este comando irá transpilar todos os arquivos TypeScript presentes no diretório `src` para JavaScript.

### `npm test`

Executa os testes unitários usando o framework Jest.

### `npm run test:watch`

Executa os testes unitários em modo de observação, ou seja, os testes serão reexecutados sempre que houver alterações nos arquivos.

### `npm run test:cov`

Executa os testes unitários e gera um relatório de cobertura de código usando o framework Jest.