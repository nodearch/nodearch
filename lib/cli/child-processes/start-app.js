const tsNode = require('ts-node');
const path = require('path');

console.log(process.argv);

tsNode.register({
  transpileOnly: true
});

const AppClass = require(path.join(process.cwd(), './main')).default;

async function main() {
  const app = new AppClass();

  await app.init({
    mode: 'app',
    appInfo: path.join(process.cwd(), '..', 'package.json')
  });

  await app.start();
}

main().catch(console.log);

// const path = require('path');
// const CliTemplate = require(process.argv[2]).default;


// async function main() {
//   const app = new CliTemplate();

//   await app.init({
//     mode: 'app',
//     appInfo: path.join(__dirname, '..', 'package.json')
//   });

//   await app.start();
// }

// main().catch(console.log);