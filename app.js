#!/usr/bin/env node
import io from './io.js'

const name = await io.question('Please specify your name: ');

console.log(`Hi ${name}!`);

io.close()