# Meu Servidor Express

Este projeto é uma aplicação de servidor simples construída com Express. Ele serve como um ponto de partida para desenvolver APIs e aplicações web.

## Estrutura do Projeto

```
medeasy
├── src/                    # Código fonte do frontend
│   ├── components/        # Componentes React
│   ├── contexts/         # Contextos React
│   ├── controllers/      # Controladores
│   ├── models/          # Modelos de dados
│   ├── services/        # Serviços
│   ├── types/           # Definições de tipos TypeScript
│   ├── views/           # Páginas/Views
│   ├── App.tsx          # Componente principal
│   ├── main.tsx         # Ponto de entrada
│   └── index.css        # Estilos globais
├── server/               # Código do servidor
│   ├── src/             # Código fonte do servidor e IA
│   └── package.json     # Dependências do servidor
├── dist/                # Arquivos compilados
├── node_modules/        # Dependências do projeto
├── .gitignore          # Configuração do Git
├── index.html          # Template HTML
├── package.json        # Configuração do npm e dependências
├── tsconfig.json       # Configuração do TypeScript
├── vite.config.ts      # Configuração do Vite
├── tailwind.config.js  # Configuração do Tailwind CSS
└── postcss.config.js   # Configuração do PostCSS
```

## Uso

Para iniciar o servidor, execute o seguinte comando:
```bash
cd server
node server.js ou nodemon server.js <--Este é para que não precise reiniciar o servidor após uma alteração 
```

Para iniciar o frontend:
```bash
npm run dev
```

O servidor estará disponível em `http://localhost:3000` e o frontend em `http://localhost:5173`.

## Contribuição

Sinta-se à vontade para contribuir com melhorias ou correções. Crie um fork do repositório e envie suas alterações através de um pull request.