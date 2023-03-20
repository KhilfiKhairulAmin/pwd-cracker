import { createInterface } from 'readline/promises'
import { stdin as input, stdout as output } from 'node:process'

class TerminalInterfaceError extends Error {
  constructor (message) {
    super(message)
    this.name = 'TerminalInterfaceError'
  }
}

const TerminalInterfaceNotStartedError = new TerminalInterfaceError('Terminal interface is not started. Please start the interface to use it.')

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
        throw TerminalInterfaceNotStartedError
      }

      return await this.#io.question(question)
    } catch (err) {
      this.#errorHandler(err)
    }
  }

  chat (message) {
    try {
      if (!this.#isOn()) {
        throw TerminalInterfaceNotStartedError
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
