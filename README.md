## Descrição

- Este projeto é um sistema Desktop para gestão de reservas, eventos e relatórios.
- Sistema desktop desenvolvido para o Centro Cultural Luz da Lua.
- Aluno: Ian Pereira Caminhas - Sistemas de Informação Unopar - Projeto de Extensão II

## Artefatos

- `Diagrama de classes.png` – Diagrama de classes utilizado para o desenvolvimento do sistema.
- `Diagrama Entidade Relacionamento - DER.png` – Diagrama Entidade Relacionamento(DER) utilizado para o desenvolvimento do sistema.

## Estrutura da pasta Código

- `main.js` – arquivo principal do Electron
- `index.js` – servidor Express
- `db/` – configuração e conexão com SQLite
- `controllers/` – lógica de controle
- `models/` – modelos Sequelize
- `routes/` – rotas Express
- `views/` – templates Handlebars
- `public/` – arquivos estáticos (CSS, JS, imagens)
- `helpers/` – helpers para Handlebars
- `luz_da_lua_db.sqlite` – banco de dados SQLite local

---

## Estrutura da pasta Interfaces

- `Autenticação/` – Interfaces para realizar login no sistema
- `Gerenciamento de eventos/` – Interfaces para o gerenciamento de eventos
- `Gerenciamento de reservas/` – Interfaces para o gerenciamento de reservas
- `Relatório de agenda/` – Interface para a geração do relatório de agenda e exemplo de relatório de agenda .PDF
- `Relatórios financeiros/` – Interface para a geração dos relatórios financeiros e exemplos de relatórios financeiros em .PDF

---

## Tecnologias

- HTML
- CSS
- Node.js v22.17.1
- bcryptjs v3.0.2
- Connect-flash v0.1.1
- Cookie-parser v1.4.7
- Cookie-session v2.1.0
- Express v5.1.0
- Express-flash v0.0.2
- Express-handlebars v8.0.1
- Express-session v1.18.1
- Handlebars v4.7.8
- Nodemon v3.1.9
- Sequelize v6.37.7
- SQLite3 v6.37.7
- Puppeteer v24.11.2
- Electron: v37.3.1
- Electron-builder: v26.0.12
- npm
- Git

## Pré-requisitos

- Node.js >= 18
- npm
- Git
- Windows 10 ou 11

---

## Instalação

- Baixar nodejs
- Instalar o nodejs
- Abrir a pasta Código
- Abrir o terminal com a pasta Código
- Digitar npm install
- Digitar npm run build
- Uma pasta dist será criada
- Basta clicar em "LuzDaLua Setup 1.0.0"(pasta dist) para a instalação ser iniciada
