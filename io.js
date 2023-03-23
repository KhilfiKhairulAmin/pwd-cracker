import { createInterface } from 'node:readline/promises'
import { stdin as input, stdout as output } from 'node:process'

/**
 * Error object used in `TerminalInterface` class context
 */
class TerminalInterfaceError extends Error {
  /**
   * @param {String} message Explanation of the error
   */
  constructor (message) {
    super(message)
    this.name = 'TerminalInterfaceError'
  }
}

/**
 * A `TerminalInterface` instance must be started before using it
 */
const TerminalInterfaceNotStartedError = new TerminalInterfaceError('Terminal interface is not started. Please start the interface to use it.')

class TerminalInterface {
  /**
   * Stores `Interface` object from `node:readline/promises` module
   */
  #io
  /**
   * Stores current status of terminal
   */
  #on

  /**
   * **Handles input and output** process in the command line. The class provides minimal functionalities for ease of use to gain input or/and display output.
   * This class collects input from `stdin` and display output through `stdout`.
   */
  constructor () {
    this.#on = false
  }

  /**
   * Enable interface to collect input and display output
   */
  start () {
    this.#io = createInterface({ input, output })
    this.#on = true
  }

  /**
   * Disable interface to collect input and display output
   */
  stop () {
    this.#on = false
    this.#io.close()
  }

  /**
   * Collect input in command line
   * @param {String} question Describe data to be given by user
   * @returns {Promise<String>} Data given
   */
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

  /**
   * Say something to your user
   * @param {String} message Displayed to your user
   */
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

  /**
   * Return the current status of terminal
   * @returns {Boolean}
   */
  #isOn () {
    return this.#on
  }

  /**
   * Handles error inside the class
   * @param {TerminalInterfaceError} err Error that occured in `TerminalInterface` context
   */
  #errorHandler (err) {
    console.error(err.stack)
    process.exit(1)
  }
}

export {
  TerminalInterface
}
