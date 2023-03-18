import { createInterface } from 'readline/promises'
import { stdin as input, stdout as output } from 'node:process'

const io = createInterface({ input, output })

export default {
  ask: io.question
}
