# <p align = "center"> Projeto - Sing me a song 🎵 </p>


## :clipboard: Descrição 

Sing me a song é uma aplicação para recomendação anônima de músicas. Quanto mais as pessoas curtirem uma recomendação, maior a chance dela ser recomendada para outras pessoas 

##	:computer: Tecnologias e Conceitos

- REST APIs
- Node.js
- TypeScript
- Prisma
- Postgres
- Jest, Cypress (QA)

***

## :rocket: Rotas

```yml
POST /recommendations
    - Adiciona uma nova recomendação de música. A requisição tem o seguinte formato:
    - headers: {}
    - body: {
              "name": "Video Name",
              "youtubeLink": "https://www.youtube.com/watch?v=..."
            }
```
    
```yml 
POST /recommendations/:id/upvote
    - Adiciona um ponto à pontuação da recomendação. Não espera nada no corpo.
    - headers: {}
    - body: {}
```
    
```yml 
POST /recommendations/:id/downvote
    - Remove um ponto da pontuação da recomendação. Não espera nada no corpo.
    - Se a pontuação fica abaixo de -5, a recomendação deve ser excluída.
    - headers: {}
    - body: {}
```

```yml
GET /recommendations
    - Pega todas as últimas 10 recomendações.
    - A resposta tem o formato:
    - body: [
              {
                "id": 1,
                "name": "Video Name",
                "youtubeLink": "https://www.youtube.com/...",
                "score": 9999
              },
              ...
            ]
``` 

```yml
GET /recommendations/:id
    - Pega uma recomendação pelo seu ID.
    - A resposta tem o formato:
    - body: {
              "id": 1,
              "name": "Video Name",
              "youtubeLink": "https://www.youtube.com/...",
              "score": 9999
            }
```

```yml
GET /recommendations/random
    - Pega uma recomendação aleatória, baseada na seguinte lógica:
    - 70% das vezes que baterem nessa rota: uma música com pontuação maior que 10 deve ser recomendada aleatoriamente
    - 30% das vezes que baterem nessa rota: uma música com pontuação entre -5 e 10 (inclusive), deve ser recomendada aleatoriamente
    - Caso só haja músicas com pontuação acima de 10 ou somente abaixo/igual a 10, 100% das vezes deve ser sorteada qualquer música
    - Caso não haja nenhuma música cadastrada, deve ser retornado status 404
    - A resposta tem o formato:
    - body: {
              "id": 1,
              "name": "Video Name",
              "youtubeLink": "https://www.youtube.com/...",
              "score": 9999
            }
```

```yml
GET /recommendations/top/:amount
    - Lista as músicas com maior número de pontos e sua pontuação.
    - São retornadas as top quantidade (parâmetro `:amount` da rota) músicas , ordenadas por pontuação (maiores primeiro)
    - A resposta tem o formato:
    - body: [
              {
                "id": 1,
                "name": "Video Name",
                "youtubeLink": "https://www.youtube.com/...",
                "score": 9999
              },
              {
                "id": 2,
                "name": "Video Name2",
                "youtubeLink": "https://www.youtube.com/...",
                "score": 88888
              },
              ...
            ]
```


***

## 🏁 Rodando a aplicação

Este projeto foi inicializado com o Node.Js e com o gerenciador de bibliotecas NPM, então certifique-se que voce tem a ultima versão estável do [Node.js](https://nodejs.org/en/download/) e [npm](https://www.npmjs.com/) rodando localmente.

Primeiro, faça o clone desse repositório na sua maquina:

```
git clone https://github.com/MatheusBalcky/Sing-a-song-TestsQA
```

Depois, dentro da pasta, rode o seguinte comando para instalar as dependencias.

```
npm install
```

Logo após faça as migrates do prisma para criar o banco da aplicação local (postgres).

```
npx migrate dev
```

Finalizado o processo, é só inicializar o servidor
```
npm run dev (back-end) && npm start (front-end)
```