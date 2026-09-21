# MaisGuinchos – Frontend

Frontend do projeto **MaisGuinchos**, uma plataforma de solicitação de guinchos desenvolvida com **React + TypeScript**, mapas interativos e comunicação com uma API **ASP.NET**.

A aplicação conecta **clientes, motoristas e empresas de guincho**, permitindo solicitar, acompanhar e gerenciar serviços de reboque por meio de localização, cálculo de rotas e acompanhamento em tempo real.

---

> ⚠️ **Projeto em desenvolvimento.**

## 🚗 Sobre o projeto

O sistema atende diferentes tipos de usuários:

* **Cliente**
* **Motorista**
* **Empresa de guincho**

Entre os principais fluxos da aplicação estão:

* Definição de localização e destino
* Busca de guinchos próximos
* Filtros para busca de guinchos
* Cálculo de rotas
* Criação de solicitações de reboque
* Aceite ou recusa de solicitações
* Envio e recebimento de contra propostas
* Acompanhamento da solicitação por estados
* Rastreamento e atualização de informações em tempo real
* Histórico de corridas e solicitações

## 🔐 Funcionalidades atuais

### Autenticação

* Login
* Cadastro de usuário em múltiplas etapas (steps)
* Cadastro como cliente, motorista ou empresa
* Autenticação utilizando JWT

### 👤 Cliente

* Definir localização atual
* Definir destino
* Buscar guinchos próximos
* Aplicar filtros na busca
* Criar solicitações de reboque
* Receber contra propostas
* Aceitar ou recusar contra propostas
* Cancelar solicitações
* Visualizar solicitações ativas
* Acompanhar corridas
* Consultar histórico de corridas

### 🚚 Motorista / Guincho

* Visualizar solicitações disponíveis
* Receber solicitações
* Aceitar solicitações
* Recusar solicitações
* Enviar contra propostas
* Acompanhar corridas ativas
* Atualizar estados da corrida
* Visualizar informações da viagem

### 🗺️ Mapas e localização

* Mapa interativo com **Leaflet**
* Visualização da localização do usuário
* Visualização de motoristas próximos
* Definição de localização e destino pelo mapa
* Cálculo e exibição de rotas
* Distância estimada
* Duração estimada
* Acompanhamento da viagem em tempo real

## 🔄 Fluxo principal

```text
Cliente
   ↓
Define localização e destino
   ↓
Busca guinchos próximos
   ↓
Cria solicitação
   ↓
Motorista recebe solicitação
   ↓
Aceita ou envia contra proposta
   ↓
Cliente aceita
   ↓
Corrida iniciada
   ↓
Acompanhamento da localização e rota
   ↓
Destino
   ↓
Finalização da corrida
```

## 🧱 Tecnologias utilizadas

* React
* TypeScript
* Vite
* React Router DOM
* Axios
* Leaflet
* React Leaflet
* CSS puro
* JWT
* Comunicação em tempo real com o backend

## 📂 Estrutura do projeto

```text
src/
├─ assets/          # Imagens e recursos
├─ components/      # Componentes reutilizáveis
├─ pages/           # Páginas da aplicação
├─ services/        # Comunicação com a API
├─ dtos/            # Tipagens e DTOs
├─ contexts/        # Contextos da aplicação
├─ styles/          # Estilos
├─ App.tsx          # Componente principal
└─ main.tsx         # Entry point da aplicação
```

## ▶️ Como rodar o projeto

### 1. Instalar dependências

```bash
npm install
```

### 2. Rodar em ambiente de desenvolvimento

```bash
npm run dev
```

A aplicação ficará disponível em:

```text
http://localhost:5173
```
## 🔗 Backend

Este frontend depende do backend do projeto **MaisGuinchos**, desenvolvido em **ASP.NET Core**.

### Backend

* ASP.NET Core
* API REST
* Autenticação JWT
* PostgreSQL
* Comunicação em tempo real
* Integração com serviços de localização e cálculo de rotas

**Backend em produção:**

https://maisguinchos-production.up.railway.app

A URL da API é configurada por meio da variável de ambiente:

```env
VITE_API_URL=https://maisguinchos-production.up.railway.app
```

## 📌 Status do projeto

O projeto está em desenvolvimento e novas funcionalidades, melhorias de interface e ajustes nos fluxos continuam sendo implementados.

## 👤 Autor

Desenvolvido por **James**

Projeto de estudo e portfólio com foco em **desenvolvimento Full Stack, APIs REST, geolocalização e aplicações web em tempo real**.
