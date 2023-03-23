#!/usr/bin/env node

import { TerminalInterface } from './io.js'
import { PwdCracker } from './pwdCracker.js'

const pwdCracker = new PwdCracker()

/**
 * Possible status (state) of the app
 */
const state = {
  ON: true,
  OFF: false
}
let currentState = state.ON

const io = new TerminalInterface()
io.start()

io.chat('Welcome to PWD Cracker')

while (currentState) {
  const command = Number(await io.prompt('[0] Keep password    [1] Tell password    [2] Quit    \n'))

  switch (command) {
    case 0: {
      // Code for KEEP PASSWORD interface
      io.chat('Please enter the following information')
      const urlDomain = await io.prompt('URL Domain: ')
      const pwd = await io.prompt('Password: ')
      const operation = await pwdCracker.keepPassword(urlDomain, pwd)
      if (!operation) {
        io.chat('Operation failed!')
        continue
      }
      io.chat('Operation successful!')
      break
    }
    case 1: {
      // Code for TELL PASSWORD inteface
      io.chat('Please enter the following information')
      const urlDomain = await io.prompt('URL Domain: ')
      const operation = await pwdCracker.tellPassword(urlDomain)
      if (!operation) {
        io.chat('Operation failed!')
        continue
      }
      io.chat('Password is ' + '\x1b[42m' + operation + '\x1b[0m')
      io.chat('Operation successful!')
      break
    }
    case 2: {
      currentState = state.OFF
      io.chat('Bye')
      continue
    }
  }
}

io.stop()
process.exit(0)
