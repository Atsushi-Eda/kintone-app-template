const commander = require('commander');
module.exports = commander
  .option('-d, --domain <string>', 'Domain name (specify the FQDN)')
  .option('-u, --user <string>', "User's log in name")
  .option('-p, --pass <string>', "User's password")
  .option('-U, --userBasic <string>', 'Basic authentication user name')
  .option('-P, --passBasic <string>', 'Basic authentication password')
  .option('-g, --guestSpaceId <number>', 'Guest space id');
