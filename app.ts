#!/usr/bin/env node
import { TerminalInterface } from './io.js'
import { keepPassword } from './pwdCracker.ts'

const state = {
  ON: true,
  OFF: false
}

let currentState = state.ON

if (!currentState) process.exit(0)

const io = new TerminalInterface()
io.start()

io.chat('Welcome to PWD Cracker')

const urlDomain = await io.prompt('URL Domain: ')
const pwd = await io.prompt('Password: ')

await keepPassword(urlDomain, pwd)

io.stop()
currentState = state.OFF