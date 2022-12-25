<h1 align="left" >NodeArch</h1>

<img align="right" src="/assets/isolated-layout.svg" height="200" width="300" alt="NodeArch Logo" />

<p>
  <a href="https://nodearch.io" target="_blank">
    <img alt="Programming Language" src="https://img.shields.io/badge/typescript-100%25-blue.svg" />
  </a>
  <a href="https://www.npmjs.com/package/@nodearch/core" target="_blank">
    <img alt="Version" src="https://img.shields.io/npm/v/@nodearch/core.svg?label=Version" />
  </a>
  <a href="https://github.com/BlueMax-IO/nodearch/blob/master/LICENSE" target="_blank">
    <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg" />
  </a>
  <a href="https://https://www.npmjs.com/package/@nodearch/core" target="_blank">
    <img alt="Downloads" src="https://img.shields.io/npm/dt/@nodearch/core.svg" />
  </a>
  <a href="https://coveralls.io/github/nodearch/core?branch=master" target="_blank">
    <img alt="Code Coverage" src="https://coveralls.io/repos/github/BlueMax-IO/nodearch/badge.svg?branch=master" />
  </a>
  <a href="https://img.shields.io/snyk/vulnerabilities/npm/@nodearch/core" target="_blank">
    <img alt="Vulnerabilities" src="https://img.shields.io/snyk/vulnerabilities/npm/@nodearch/core.svg" />
  </a>
  <a href="https://img.shields.io/github/workflow/status/bluemax-io/nodearch/Deploy/master" target="_blank">
    <img alt="Build Status" src="https://img.shields.io/github/workflow/status/bluemax-io/nodearch/Deploy/master?label=Build" />
  </a>
  <a href="https://github.com/bluemax-io/nodearch/stargazers" target="_blank">
    <img alt="Star on GitHub" src="https://img.shields.io/github/stars/bluemax-io/nodearch?style=social" />
  </a>
</p>

## 👋 Welcome to NodeArch

NodeArch is a backend framework for Node.js that aims to address design and architectural issues when building Node.js applications. It uses Typescript and dependency injection to bring concepts from languages like Java and C# to Node.js, while still taking advantage of Javascript's flexibility and Node.js's non-blocking I/O model. NodeArch is designed to work seamlessly with existing tools and libraries, rather than replacing them, and focuses on creating a readable, maintainable, and scalable application architecture. It acts as a glue that connects all your tools and libraries together, making it easier to develop and maintain your Node.js applications.


## 🔗 Links

* [Homepage](https://nodearch.io)
* [Documentation](https://nodearch.io/docs)

## 📦 Install

To create new NodeArch apps, you need to install the NodeArch command-line interface (CLI) on your machine. To do this, open your terminal and run the following command:

```sh
npm i -g @nodearch/cli
```

Once you have installed the NodeArch command-line interface (CLI), you can use it to see the available options and usage instructions. To do this, open your terminal and run the following command:
```sh
nodearch -h
```

## 🚀 Usage

```sh
# start your app
nodearch start

# start your app in Watch mode
nodearch  start -w

# run test cases
nodearch test

# run test cases in watch mode
nodearch test -w

# build your app ( only required in production mode )
nodearch build
```
```bash
❯ nodearch -h
Usage: nodearch <command> [options]

Commands:
  nodearch build  Build NodeArch app                                [aliases: b]
  nodearch new    Generate new NodeArch APP                         [aliases: n]
  nodearch start  Start NodeArch APP                                [aliases: s]
  nodearch test   run automated testing                             [aliases: t]

Options:
  -y, --notify   turn desktop notifier on or off       [boolean] [default: true]
  -h, --help     Show help                                             [boolean]
  -v, --version  Show version number                                   [boolean]

Examples:
  nodearch new    generates new app
  nodearch build  build existing app from the current directory
  nodearch start  starts existing app from the current directory
```

for all the options, please check the [documentation](https://nodearch.io/docs)

## 🤝 Contributing
If you would like to contribute to the NodeArch project, report an issue, or request a new feature, you can use the GitHub Issue tracker to communicate with the development team. Contributions, issues, and feature requests are all welcome, and we encourage you to share your thoughts and ideas with us through the Issue tracker. If you have an idea for improving NodeArch, adding new functionality, or suggesting something else, please don't hesitate to use the Issue tracker to let us know.

## 👷 Development
### Prerequisites
* [Node.js](https://nodejs.org/en/download/)
* [Microsoft Rush](https://rushjs.io/pages/intro/get_started/)
* [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)

### Setup
To clone the NodeArch project onto your local machine, you can use the following command in your terminal:
```bash
git clone https://github.com/nodearch/nodearch.git
```
This will create a local copy of the NodeArch project on your machine, allowing you to access the source code and make changes as needed.

Switch to the repo directory, and then install dependencies
```bash
rush install
```

Now build the project
```bash
rush build
```

### Usage

```bash
# Build the project
rush build

# Run test cases
rush test

# Add NPM package as a dependency
rush add
```

For more details on how to use Rush to add packages, commands, build and run stuff. check it on the official [Rush website](https://rushjs.io/pages/intro/welcome/)

## Show your support

Give a ⭐️ if this project helped you! 

[![Star on GitHub](https://img.shields.io/github/stars/bluemax-io/nodearch?style=social)](https://github.com/bluemax-io/nodearch/stargazers)

## 📝 License
This project is [MIT](https://github.com/BlueMax-IO/nodearch/blob/master/LICENSE) licensed.

***

Open Source Software made with ❤️ for the Node.js Community. [Ahmed Ali](https://github.com/AhmedAli7O1)
