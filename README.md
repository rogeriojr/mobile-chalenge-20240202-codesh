# Aplicativo de Dicionário Inglês

Um aplicativo móvel para explorar palavras em inglês, suas definições e pronúncias. Este aplicativo permite aos usuários pesquisar palavras, visualizar seus significados, salvar favoritos e acompanhar o histórico de visualização.

## Funcionalidades

- Navegue por uma lista abrangente de palavras em inglês com rolagem infinita
- Pesquise palavras específicas
- Visualize definições detalhadas de palavras, fonética e exemplos
- Ouça pronúncias de palavras
- Salve palavras favoritas para acesso rápido
- Acompanhe o histórico de visualização de palavras
- Autenticação de usuário para sincronizar favoritos e histórico entre dispositivos

## Capturas de Tela

<!-- Adicione suas capturas de tela aqui -->

## Tecnologias Utilizadas

- **React Native** - Framework de aplicativo móvel
- **Expo** - Plataforma de desenvolvimento para React Native
- **TypeScript** - JavaScript com tipagem segura
- **React Navigation** - Biblioteca de navegação para React Native
- **Expo AV** - Reprodução de áudio para pronúncias de palavras
- **AsyncStorage** - Armazenamento local para cache e persistência
- **Context API** - Gerenciamento de estado
- **Free Dictionary API** - Definições e fonética de palavras

## Estrutura do Projeto

```plaintext
├── assets/                # Ícones e imagens do aplicativo
├── src/
│   ├── components/        # Componentes de UI reutilizáveis
│   │   ├── LoadingIndicator.tsx
│   │   ├── SearchBar.tsx
│   │   └── WordCard.tsx
│   ├── contexts/          # Gerenciamento de estado da aplicação
│   │   └── AppContext.tsx
│   ├── navigation/        # Configuração de navegação
│   │   └── types.ts
│   ├── screens/           # Telas da aplicação
│   │   ├── FavoritesScreen.tsx
│   │   ├── HistoryScreen.tsx
│   │   ├── HomeScreen.tsx
│   │   ├── LoginScreen.tsx
│   │   └── WordDetailsScreen.tsx
│   ├── services/          # Serviços de API e dados
│   │   ├── api.ts         # Integração com API de dicionário
│   │   ├── storage.ts     # Gerenciamento de armazenamento local
│   │   └── words.ts       # Gerenciamento do dicionário de palavras
│   └── theme/             # Estilização e temas do aplicativo
│       └── index.ts
├── App.tsx               # Componente principal da aplicação
└── index.ts              # Ponto de entrada
```

## Instalação

1. Clone o repositório

```bash
git clone https://github.com/yourusername/english-dictionary-app.git
cd english-dictionary-app
```

1. Instale as dependências

```bash
npm install
```

1. Inicie o servidor de desenvolvimento

```bash
npm start
```

1. Execute em um dispositivo ou emulador

```bash
# Para Android
npm run android

# Para iOS
npm run ios
```

## Detalhes de Implementação

### Dicionário de Palavras

O aplicativo carrega um dicionário abrangente de palavras em inglês do repositório GitHub mencionado no desafio. O dicionário é armazenado em cache localmente para melhor desempenho.

### Cache de API

As definições de palavras obtidas da Free Dictionary API são armazenadas em cache localmente com uma expiração de 24 horas para reduzir chamadas de API e melhorar o desempenho do aplicativo.

### Rolagem Infinita

A lista de palavras implementa rolagem infinita para lidar eficientemente com o grande dicionário sem problemas de desempenho.

### Autenticação de Usuário

O aplicativo inclui um sistema de autenticação simples que permite aos usuários sincronizar seus favoritos e histórico entre dispositivos.

### Suporte Offline

O aplicativo armazena em cache palavras e suas definições visualizadas anteriormente para acesso offline.

---

## English Dictionary App

A mobile application for exploring English words, their definitions, and pronunciations. This app allows users to search for words, view their meanings, save favorites, and track viewing history.

## Features

- Browse a comprehensive list of English words with infinite scrolling
- Search for specific words
- View detailed word definitions, phonetics, and examples
- Listen to word pronunciations
- Save favorite words for quick access
- Track word viewing history
- User authentication to sync favorites and history across devices

## Screenshots

<!-- Add your screenshots here -->

## Technologies Used

- **React Native** - Mobile application framework
- **Expo** - Development platform for React Native
- **TypeScript** - Type-safe JavaScript
- **React Navigation** - Navigation library for React Native
- **Expo AV** - Audio playback for word pronunciations
- **AsyncStorage** - Local storage for caching and persistence
- **Context API** - State management
- **Free Dictionary API** - Word definitions and phonetics

## Project Structure

```plaintext
├── assets/                # App icons and images
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── LoadingIndicator.tsx
│   │   ├── SearchBar.tsx
│   │   └── WordCard.tsx
│   ├── contexts/          # Application state management
│   │   └── AppContext.tsx
│   ├── navigation/        # Navigation configuration
│   │   └── types.ts
│   ├── screens/           # Application screens
│   │   ├── FavoritesScreen.tsx
│   │   ├── HistoryScreen.tsx
│   │   ├── HomeScreen.tsx
│   │   ├── LoginScreen.tsx
│   │   └── WordDetailsScreen.tsx
│   ├── services/          # API and data services
│   │   ├── api.ts         # Dictionary API integration
│   │   ├── storage.ts     # Local storage management
│   │   └── words.ts       # Words dictionary management
│   └── theme/             # App styling and theming
│       └── index.ts
├── App.tsx               # Main application component
└── index.ts              # Entry point
```

## Installation

1. Clone the repository

```bash
git clone https://github.com/yourusername/english-dictionary-app.git
cd english-dictionary-app
```

1. Install dependencies

```bash
npm install
```

1. Start the development server

```bash
npm start
```

1. Run on a device or emulator

```bash
# For Android
npm run android

# For iOS
npm run ios
```

## Implementation Details

### Word Dictionary

The app loads a comprehensive English word dictionary from the GitHub repository mentioned in the challenge. The dictionary is cached locally for improved performance.

### API Caching

Word definitions fetched from the Free Dictionary API are cached locally with a 24-hour expiration to reduce API calls and improve app performance.

### Infinite Scrolling

The word list implements infinite scrolling to efficiently handle the large dictionary without performance issues.

### User Authentication

The app includes a simple authentication system that allows users to sync their favorites and history across devices.

### Offline Support

The app caches previously viewed words and their definitions for offline access.

---

## Proposta do Projeto

## Mobile Challenge 20240202

## Introdução

Este é um teste para que possamos ver as suas habilidades como Mobile Developer.

Nesse desafio você deverá desenvolver um aplicativo para listar palavras em inglês, utilizando como base a API [Free Dictionary API](https://dictionaryapi.dev/). O projeto a ser desenvolvido por você tem como objetivo exibir termos em inglês e gerenciar as palavras visualizadas, conforme indicado nos casos de uso que estão logo abaixo.

[SPOILER] As instruções de entrega e apresentação do challenge estão no final deste Readme (=

### Antes de começar

- Considere como deadline da avaliação a partir do início do teste. Caso tenha sido convidado a realizar o teste e não seja possível concluir dentro deste período, avise a pessoa que o convidou para receber instruções sobre o que fazer.
- Documentar todo o processo de investigação para o desenvolvimento da atividade (README.md no seu repositório); os resultados destas tarefas são tão importantes do que o seu processo de pensamento e decisões à medida que as completa, por isso tente documentar e apresentar os seus hipóteses e decisões na medida do possível.

### Instruções iniciais obrigatórias

- Utilize as seguintes tecnologias:

#### Tecnologias (Mobile)

- Nativo ou Hibrido (Flutter, Ionic, React Native, etc)
- Estilização (Material, Semantic, etc). Ou escrever o seu próprio sob medida 👌
- Gestão de dados (Redux, Context API, IndexedDB, SQLite, etc)

Atente-se, ao desenvolver a aplicação mobile, para conceitos de usabilidade e adeque a interface com elementos visuais para os usuários do seu sistema.

#### Tecnologias (Back-End)

- Firebase, Supabase, etc

#### Organização

- Aplicação de padrões Clean Code
- Validação de chamadas assíncronas para evitar travamentos

### Modelo de Dados

Conforme indicado na documentação da API, a API retorna as informações de uma palavra, tais como etimologia, sinônimos, exemplos de uso, etc. Utilize os campos indicados na documentação dos endpoints para obter os dados necessários.

### Front-End

Nessa etapa você deverá desenvolver uma aplicação móvel nativa ou hibrida para consumir a API do desafio.

**Obrigatório 1** - Você deverá atender aos seguintes casos de uso:

- Como usuário, devo ser capaz de visualizar uma lista de palavras com rolagem infinita
- Como usuário, devo ser capaz de visualizar uma palavra, significados e a fonética
- Como usuário, devo ser capaz de salvar a palavra como favorito
- Como usuário, devo ser capaz de remover a palavra como favorito
- Como usuário, devo ser capaz de visitar uma lista com as palavras que já vi anteriormente

A API não possui endpoint com a lista de palavras. Essa lista pode ser carregada em memória ou ser salva em banco de dados local ou remoto (por exemplo, com Firebase). Será necessário usar o [arquivo existente dentro do projeto no Github](https://github.com/dwyl/english-words/blob/master/words_dictionary.json).

**Obrigatório 2** - Salvar em cache o resultado das requisições, para agilizar a resposta em caso de buscas com parâmetros repetidos.

**Obrigatório 3** - Seguir o wireframe para a página de listagem dos dados. Pode-se alterar a posição dos itens, mantendo as funcionalidades solicitadas.

![Wireframe do aplicativo](./img/wireframe.png)

**Diferencial 1** - Implementar um tocador de audio utilizando, por exemplo, [ResponsiveVoice API](https://responsivevoice.org/api) ou recursos nativos;

**Diferencial 2** - Utilizar alguma ferramenta de Injeção de Dependência;

**Diferencial 3** - Escrever Unit Tests ou E2E Test. Escolher a melhor abordagem e biblioteca;

**Diferencial 4** - Implementar login com usuário e senha e associar os favoritos e histórico ao ID do usuário, salvando essa informação em banco de dados local ou remoto

## Readme do Repositório

- Deve conter o título do projeto
- Uma descrição sobre o projeto em frase
- Deve conter uma lista com linguagem, framework e/ou tecnologias usadas
- Como instalar e usar o projeto (instruções)
- Não esqueça o [.gitignore](https://www.toptal.com/developers/gitignore)
- Se está usando github pessoal, referencie que é um challenge by coodesh:  

>This is a challenge by [Coodesh](https://coodesh.com/)

## Finalização e Instruções para a Apresentação

1. Adicione o link do repositório com a sua solução no teste
2. Adicione o link da apresentação do seu projeto no README.md.
3. Verifique se o Readme está bom e faça o commit final em seu repositório;
4. Envie e aguarde as instruções para seguir. Sucesso e boa sorte. =)

## Suporte

Use a [nossa comunidade](https://discord.gg/rdXbEvjsWu) para tirar dúvidas sobre o processo ou envie uma mensagem diretamente a um especialista no chat da plataforma.

>This is a challenge by [Coodesh](https://coodesh.com/)
