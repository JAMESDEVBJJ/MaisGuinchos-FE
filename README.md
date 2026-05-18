# MaisGuinchos – Frontend

Frontend do projeto **MaisGuinchos**, desenvolvido em **React + TypeScript + Leaflet**, responsável pela interface com autenticação, cadastro, login, paginas e fluxos gerais da aplicação.

Este projeto consome uma API backend (ASP.NET) utilizando autenticação via **JWT**.

---

> ⚠️ Projeto em desenvolvimento.
>
> Sobre o app:
>  O sistema atende motoristas, clientes e empresas, permitindo:

- Definir localização e destino
- Buscar guinchos próximos
- Calculos de rota e viagem
- Criar solicitações de reboque
- Motoristas aceitarem ou enviarem contra propostas
- Pedido e corrida controlada por estados, com contra proposta e rota em tempo real

## 🔐 Funcionalidades atuais

- Tela de login
- Cadastro de usuário em múltiplos passos (steps)
- Seleção de tipo de conta:
  - Cliente
  - Motorista
  - Empresa
- Homepage com sidebar estruturada e mapa interativo
- Fluxo condicional para cadastro de motorista
- Integração com API via Axios
- Persistência de estado entre steps do formulário
- Função de setar localização e destino do usuario
- Calcular rotas e buscar guinchos proximos 

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
