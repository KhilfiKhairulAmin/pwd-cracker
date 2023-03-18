const readline = require('node:readline/promises')
const { stdin: input, stdout: output } = require('node:process')

const rl = readline.createInterface({ input, output })

module.exports = rl