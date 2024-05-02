
# Projeto BD2

Instalação
-
Requisitos:
* node.js (preferência maior que v18)
* typescript (preferência maior que v5)
* MySQL
* Importar o arquivo concessionaria_db.sql (presente também no classroom)

No terminal:
```bash
    git clone git@github.com:v1tor2003/concessionaria-bd2.git
    cd concessionaria-bd2
    touch .env.local
    npm install
    npm run dev
```

Instrução para arquivo .env
-
Informe as credenciais tal que: 
NEXTAUTH_SECRET="3rAaWs/UNSiXzryH1hIOy03cQNklVW33pY10ISSvclY="
NEXTAUTH_URL=http://localhost:3000
BASE_URL=http://localhost:3000
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=
MYSQL_DATABASE=concessionaria_db

Descrição
-
O projeto consiste na aplicação que integra o banco de dados com o interface para o usuário, projeto feito em Nextjs 14, React 18, TypeScript e Tailwind
