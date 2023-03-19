import { createInterface } from 'readline/promises'
import { stdin as input, stdout as output } from 'node:process'
import InterfaceError from './error.js'

class TerminalInterface {
  constructor () {
    this.#io = createInterface({ input, output })
    this.#on = false
  }

  start () {
    this.#on = true
  }

  stop () {
    this.#on = false
    this.#io.close()
  }

  prompt (question) {
    if (!this.#on) {
      console.log('Interface is not started. Please start the interface to use it.')
      return
    }

    return this.#io.question(question)
  }

  promptHidden (question) {
    try {
      if (!this.#isOn()) {
        throw new InterfaceError()
      }
    }
  }

  #isOn () {
    return this.on
  }

  #errorHandler (err) {

  }
}