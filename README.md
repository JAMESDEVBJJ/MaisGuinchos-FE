# MaisGuinchos – Frontend

Frontend do projeto **MaisGuinchos**, desenvolvido em **React + TypeScript + Leaflet**, responsável pela interface de autenticação, cadastro de usuários e fluxos iniciais da aplicação.

Este projeto consome uma API backend (ASP.NET) utilizando autenticação via **JWT**.

> ⚠️ Projeto em desenvolvimento.

---

## 🧱 Tecnologias utilizadas

- React
- TypeScript
- Vite
- React Router DOM
- Axios
- CSS puro (sem framework)

---

## 📂 Estrutura do projeto

src/
├─ styles e assets/ # Css e imagens
├─ components/ # Componentes reutilizáveis
├─ pages/ # Páginas (Login, Signup, etc)
├─ services/ # Configuração do Axios / API
├─ dtos/ # Tipagens (DTOs)
├─ App.tsx # Componente principal
└─ main.tsx # Entry point da aplicação

---

## 🔐 Funcionalidades atuais

- Tela de login
- Cadastro de usuário em múltiplos passos (steps)
- Seleção de tipo de conta:
  - Cliente
  - Motorista
  - Empresa
- Fluxo condicional para cadastro de motorista
- Integração com API via Axios
- Persistência de estado entre steps do formulário
- Tela home com função de setar localização do usuario e buscar guinchos proximos 

---

## ▶️ Como rodar o projeto

### 1. Instalar dependências
```bash
npm install
```

### 2. Rodar em ambiente de desenvolvimento
```
npm run dev
```

A aplicação ficará disponível em:
```
http://localhost:5173
```

## 🔗 Backend

### Este frontend depende do backend do projeto MaisGuinchos.

API em ASP.NET

Autenticação JWT

Endpoints REST

Certifique-se de que o backend esteja rodando antes de utilizar as funcionalidades de login e cadastro.

## 📌 Observações

O layout está em evolução

Validações avançadas ainda serão implementadas

Fluxos de motorista/guincho estão em construção

# 👤 Autor

## Desenvolvido por James
## Projeto de estudo e portfólio.
