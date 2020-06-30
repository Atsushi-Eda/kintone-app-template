const fs = require('fs');
const readline = require('readline');

const readUserInput = (question) => {
  const readlineInterface = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) => {
    readlineInterface.question(question, (answer) => {
      resolve(answer);
      readlineInterface.close();
    });
  });
};

(async () => {
  const config = {};
  config.domain = await readUserInput('Domain name (specify the FQDN): ');
  config.user = await readUserInput("User's log in name: ");
  config.pass = await readUserInput("User's password: ");
  config.userBasic = await readUserInput('Basic authentication user name: ');
  config.passBasic = await readUserInput('Basic authentication password: ');
  fs.writeFileSync(
    `${__dirname}/../../defaultConfig.json`,
    JSON.stringify(config)
  );
  console.log('Saved config.');
})();
