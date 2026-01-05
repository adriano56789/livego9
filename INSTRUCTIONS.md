# Manual de Operação e Deploy - LiveGo

Este guia contém as instruções essenciais para desenvolver, testar e fazer o deploy da aplicação LiveGo.

## 1. Configuração do Ambiente de Desenvolvimento

### Backend
1.  Navegue até a pasta `backend/`.
2.  Instale as dependências: `npm install`.
3.  Crie um arquivo `.env` na pasta `backend/`. Configure sua string de conexão do MongoDB e outros segredos.
4.  Inicie o servidor de backend: `npm start`. Ele rodará em `http://localhost:3000`.

### Frontend
1.  Na pasta raiz do projeto, instale as dependências: `npm install`.
2.  Inicie o servidor de desenvolvimento do Vite: `npm run dev`. Ele rodará em `http://localhost:5173`.

## 2. Conectando o Frontend ao Backend

O frontend pode se conectar ao backend local ou ao servidor de produção (VPS).

-   **Para conectar ao backend LOCAL:**
    1.  Abra o arquivo `services/config.ts`.
    2.  Mude a constante `CONNECTION_MODE` para `'local'`.
    3.  `const CONNECTION_MODE: 'local' | 'vps' = 'local';`
    4.  O Vite irá automaticamente redirecionar as chamadas de API (`/api/*`) e WebSocket para `http://localhost:3000`.

-   **Para conectar ao backend de PRODUÇÃO (VPS):**
    1.  Abra o arquivo `services/config.ts`.
    2.  Mude a constante `CONNECTION_MODE` para `'vps'`.
    3.  `const CONNECTION_MODE: 'local' | 'vps' = 'vps';`
    4.  O frontend fará as chamadas diretamente para `https://livego.store`.

## 3. Deploy para a VPS (Servidor de Produção)

### Build do Frontend
1.  Na raiz do projeto, execute `npm run build`.
2.  Isso criará uma pasta `dist/` com os arquivos estáticos do seu site. O conteúdo desta pasta será servido pelo Nginx na VPS.

### Deploy do Backend
1.  Envie **apenas o conteúdo** da pasta `backend/` para a sua VPS (ex: para `/var/www/livego/backend`). **Não envie a pasta `node_modules`**.
2.  Na VPS, dentro da pasta do backend, execute:
    ```bash
    npm install --production # Instala apenas as dependências de produção
    # Inicia e gerencia a API com PM2
    pm2 start server.ts --name "livego-api" --interpreter ./node_modules/.bin/ts-node
    pm2 save      # Salva a lista de processos para reiniciar com o servidor
    pm2 startup   # Gera o comando para configurar o PM2 na inicialização do sistema
    ```

3.  Configure o Nginx como um proxy reverso para servir os arquivos da pasta `dist/` e redirecionar as chamadas de `/api` e `/socket.io` para a porta onde sua API está rodando.
