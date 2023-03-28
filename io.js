import { createInterface } from 'node:readline/promises'
import { stdin as input, stdout as output } from 'node:process'

class TerminalInterface {
  /**
   * Stores `Interface` object from `node:readline/promises` module
   */
  #io

  /**
   * **Handles input and output** process in the command line. The class provides minimal functionalities for ease of use to gain input or/and display output.
   * This class collects input from `stdin` and display output through `stdout`.
   */
  constructor () {
    this.#io = createInterface({ input, output })
  }

  /**
   * Collect input in command line
   * @param {String} question Describe data to be given by user
   * @returns {Promise<String>} Data given
   */
  async prompt (question) {
    return await this.#io.question(question)
  }

  /**
   * Say something to your user
   * @param {String} message Displayed to your user
   */
  chat (message) {
    this.#io.write(message + '\n')
  }
}

export {
  TerminalInterface
}
