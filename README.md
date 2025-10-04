# 🍽️ FoodManager - Backend

Backend da aplicação **FoodManager**, um sistema de gerenciamento de restaurantes que permite controle de produtos, usuários, comandas e itens de comanda.  
Construído com **NestJS**, **Prisma** e **PostgreSQL**, possui autenticação com **JWT** e documentação via **Swagger**.  

---
## 🛠️ Tecnologias Utilizadas

- [NestJS](https://nestjs.com/) – Framework Node.js.  
- [Prisma ORM](https://www.prisma.io/) – ORM para PostgreSQL.  
- [PostgreSQL](https://www.postgresql.org/) – Banco de dados relacional.  
- [JWT](https://jwt.io/) – Autenticação e autorização.  
- [BCrypt](https://www.npmjs.com/package/bcrypt) – Hash de senhas.  
- [Swagger](https://swagger.io/) – Documentação de API.  

---

## ⚡ Como Rodar o Projeto

### 🔹 Pré-requisitos
- Node.js **>= 18**  
- PostgreSQL **>= 14**  
- NPM ou Yarn  

### 🔹 Configuração do ambiente
1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/food-manager.git
   cd food-manager/backend
   npm install
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Configure o banco de dados no arquivo .env:
    ```env
    DATABASE_URL="postgresql://usuario:senha@localhost:5432/foodmanager"
    JWT_SECRET="uma_chave_bem_grande_e_secreta"
    JWT_EXPIRES_IN="1d"
    ````
4. Configure o banco de dados no arquivo .env:
    ```bash
    npx prisma migrate dev
    ```

---
### 🔹 Rodando o Servidor:
  ```bash
  npm run start:dev
  ```
#### Servidor disponível em:
- 👉 http://localhost:3001

#### Swagger disponível em:
- 👉 http://localhost:3001/docs

### 🔑 Autenticação

Todas as rotas (exceto login) requerem Bearer Token no header:
```makefile
Authorization: Bearer <seu_token>
```
Faça login em /auth/login para obter o token. <br/>
Use o token para acessar as rotas protegidas.

## 📊 Exemplos de Rotas
### 🔹 Usuário

- POST /usuario → Criar usuário

- POST /auth/login → Login e geração de token

- GET /usuario → Listar usuários (admin only)

- GET /usuario/:id → Buscar usuário específico

- PATCH /usuario/:id → Atualizar dados do usuário

- DELETE /usuario/:id → Remover usuário

### 🔹 Produto

- POST /produtos → Criar produto

- GET /produtos → Listar produtos

- GET /produtos/:id → Buscar produto específico

- PATCH /produtos/:id → Atualizar produto

- DELETE /produtos/:id → Remover produto

### 🔹 Comanda

- POST /comandas/abrir → Abrir comanda

- POST /comandas/adicionar-item → Adicionar item

- PATCH /comandas/:comandaId/remover-item/:itemId → Remover item

- PATCH /comandas/fechar/:id → Fechar comanda

- GET /comandas → Listar comandas

---

## 👨‍💻 Autor

Projeto desenvolvido por Mateus Del Campo Quezada <br/>
TCC – FoodManager: Aplicação para gerenciamentos de pedidos de restaurantes - Ciência da Computação – PUC Goiás




  
  



   
