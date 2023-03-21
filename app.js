#!/usr/bin/env node
import { TerminalInterface } from './io.js'
import { PwdCracker } from './pwdCracker.js'

const pwdCracker = new PwdCracker()

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
      await pwdCracker.keepPassword(urlDomain, pwd)
      io.chat('Success!')
      break
    }
    case 1: {
      // Code for TELL PASSWORD inteface
      io.chat('Please enter the following information')
      const urlDomain = await io.prompt('URL Domain: ')
      const success = await pwdCracker.tellPassword(urlDomain)
      if (success) {
        io.chat('Success! Password: ' + success)
      }
      break
    }
    case 2: {
      currentState = state.OFF
      continue
    }
  }
  io.chat('\n')
}

io.stop()
process.exit(0)
