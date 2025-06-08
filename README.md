# 🧴 Josi Glow - API de Produtos

API simples de gerenciamento de produtos cosméticos com suporte a upload de imagem, criada com NestJS.

> 🚫 **Não utiliza banco de dados.** Os dados são armazenados em um arquivo local `src/data.json` e as imagens em `public/uploads/`.

---

## 📦 Funcionalidades

- [x] Criar produto com upload de imagem (`POST /products`)
- [x] Listar todos os produtos (`GET /products`)
- [x] Buscar produto por ID (`GET /products/:id`)
- [x] Atualizar dados do produto (`PUT /products/:id`)
- [x] Deletar produto e remover imagem (`DELETE /products/:id`)
- [x] Middleware simples de autenticação via header `Authorization: motoca-laranja`

---

## 📁 Estrutura de Armazenamento

- 📄 `src/data.json` → Armazena os produtos como um array de objetos
- 🖼 `public/uploads/` → Armazena as imagens em `.jpg`

---

## 🔐 Autenticação

Todas as rotas de `/products` são protegidas por um middleware simples.

### Envie no header:

# josi-grow-api
