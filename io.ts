import { createInterface } from 'readline/promises'
import { stdin as input, stdout as output } from 'node:process'
import { InterfaceNotStartedError } from './error.ts'

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

  chat (message) {
    try {
      if (!this.#isOn()) {
        throw InterfaceNotStartedError
      }

      console.log(message)
    } catch (err) {
      this.#errorHandler(err)
    }
  }

  #isOn () {
    return this.#on
  }

  #errorHandler (err) {
    console.error(err.stack)
    process.exit(1)
  }
}

export {
  TerminalInterface
}
