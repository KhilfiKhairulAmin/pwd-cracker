#!/usr/bin/env node
import { hash } from 'bcrypt'
import io from './io.js'
import { writeFile } from 'node:fs/promises'

const state = {
  off: false,
  on: true
}

let currentState = state.on

const run = async () => {
  while (currentState) {
    try {
      const command = Number(await io.ask('[0] Keep password    [1] Tell password    [2] Quit\n'))

      switch (command) {
        case 0: {
          keepPassword()
          break
        }
        case 2: {
          currentState = state.off
          continue
        }
      }
    } catch (err) {
      console.log(err, '\n')
    }
  }
}

const keepPassword = async () => {
  console.log('Please enter the following information')
  const urlDomain = await io.ask('URL Domain: ')
  const pwd = await io.ask('Password: ')

  hash(pwd, 15, async (err, hashedPwd) => {
    if (err) {
      console.log(err)
      console.log('Process failed. No new password is kept.')
    }

    await writeFile('./stored_hash.json', { domain: urlDomain, hash: hashedPwd })
  })
}

run()
