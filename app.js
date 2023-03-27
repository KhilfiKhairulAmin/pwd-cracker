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
  try {
    /**
     * Stores user action
     */
    const command = Number(await io.prompt('[0] Keep password    [1] Tell password    [2] Quit    \n'))

    // Determines which action based on number
    switch (command) {
      case 0: {
        // Code for KEEP PASSWORD interface
        io.chat('Please enter the following information')
        const url = await io.prompt('URL: ')
        const pwd = await io.prompt('Password: ')
        io.chat('')
        try {
          pwdCracker.keepPassword(url, pwd)
          io.chat('Operation successful!')
        } catch (err) {
          io.chat(err.message)
          io.chat('Operation failed!')
        }
        break
      }
      case 1: {
        // Code for TELL PASSWORD interface
        io.chat('Please enter the following information')
        const urlDomain = await io.prompt('URL Domain: ')
        try {
          const pwd = pwdCracker.tellPassword(urlDomain)
          io.chat('Password is ' + '\x1b[42m' + pwd + '\x1b[0m')
          io.chat('Operation successful!')
        } catch (err) {
          io.chat(err.message)
          io.chat('Operation failed!')
        }
        break
      }
      case 2: {
        // Code for QUIT interface
        currentState = state.OFF
        io.chat('Bye')
        continue
      }
    }
    io.chat('')
  } catch (err) {
    console.log(err.stack)
    process.exit(1)
  }
}

io.stop()
process.exit(0)
