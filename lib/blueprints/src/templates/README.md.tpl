# {{title}} ⚡

🛠️ {{description}}

## Table of Contents 📖
  - [Setup](#setup-) 🔧
    - [Prerequisites](#prerequisites-) 📋
    - [Installation](#installation-) 📥
    - [Configuration](#configuration-) ⚙️
  - [Usage](#usage-) 🚀
    - [Running the App](#running-the-app-) ▶️
    - [Running in watch mode](#running-in-watch-mode-) 🔄
    - [Running test cases](#running-test-cases-) ✅
    - [Building](#building-) 📦
    - [JS Mode](#js-mode-) 📜
  - [Components](#components-) 🧩
  - [Powered By](#powered-by-)⚡


## Setup 🔧

### Prerequisites 📋
Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (>= 22.x)
- npm or yarn

### Installation 📥

```shell
npm i -g @nodearch/cli
npm install
```

### Configuration ⚙️
Before running the app, set up the environment variables:

```shell
cp .env.example .env
```

## Usage 🚀

### Running the App ▶️
```shell
nodearch start
```

### Running in watch mode 🔄
```shell
nodearch start -w
```

### Running test cases ✅
```shell
nodearch test
```

### Building 📦
```shell
nodearch build
```

### JS Mode 📜
It is recommended to run the app in JavaScript mode in a production environment.
```shell
nodearch start --loadMode js
```

## Components 🧩
This app follows a modular architecture, where different components work together to build a scalable and maintainable system.

- **Component** 🏗️ - The basic building block of the application.
- **Controller** 🎛️ - Handles incoming requests and defines API routes.
- **Service** ⚙️ - Contains the business logic of the application.
- **Repository** 🗄️ - Manages data persistence and database interactions.
- **Hook** 🔄 - Used for extending or modifying the behavior of the app.
- **Config** ⚙️ - Environment-specific configuration settings.

## Powered By⚡

This app was created with 💚 using the **[@nodearch](https://github.com/nodearch) framework** 🛠 for the open-source community.