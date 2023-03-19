import { createInterface } from 'readline/promises'
import { stdin as input, stdout as output } from 'node:process'
import { InterfaceNotStartedError } from './error.js'

class TerminalInterface {
  #io
  #on

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

  async prompt (question) {
    try {
      if (!this.#isOn()) {
        throw InterfaceNotStartedError
      }

      return await this.#io.question(question)
    } catch (err) {
      this.#errorHandler(err)
    }
  }

  #isOn () {
    return this.#on
  }

  #errorHandler (err) {
    console.log(err.message)
  }
}

export {
  TerminalInterface
}
