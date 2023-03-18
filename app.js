#!/usr/bin/env node
import * as readline from 'readline/promises'
import { stdin as input, stdout as output } from 'node:process'
import { writeFileSync } from 'node:fs'
import { hash } from 'bcrypt'

// Initialize interface of program
const rl = readline.createInterface({ input, output })

let running = true

console.log('Welcome to PWD Cracker')

while (running) {
  try {
    const command = Number(await rl.question('[0] Keep new password    [1] Tell password\n'))

    switch (command) {
      case 0: {
        console.log('Please enter the following information')
        const urlDomain = await rl.question('URL Domain: ')
        const pwd = await rl.question('Password: ')
        hash(pwd, 15, (_err, hashed) => {
          const data = {
            domain: urlDomain,
            hash: hashed
          }
          writeFileSync('./stored_hash.json', JSON.stringify(data))
        })
      }
    }
    running = false
  } catch (err) {
    if (err) throw err
    console.log('Something went wrong')
  }
}

rl.close()
