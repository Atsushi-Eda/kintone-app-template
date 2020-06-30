#!/usr/bin/env node
const commander = require('commander');
commander
  .command('e <appIds>', 'export app template from kintone', {
    executableFile: 'export/index',
  })
  .command('i <filePath>', 'import app template to kintone', {
    executableFile: 'import/index',
  })
  .command('c', 'kintone connection config', { executableFile: 'config/index' })
  .parse(process.argv);
