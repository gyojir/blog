#!/usr/bin/env node

const prog = require('caporal');
const createCmd = require('./create');

prog
  .version('1.0.0')
  .command('create', 'Create a new files')
  .argument('[template]', 'Template to use')
  .action(createCmd);

prog.parse(process.argv);