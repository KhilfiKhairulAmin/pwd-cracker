import { compare, hash } from 'bcrypt'
import { writeFile, readFile, appendFile } from 'node:fs/promises'

class PwdCrackerError extends Error {
  constructor (message) {
    super(message)
    this.name = 'PwdCrackerError'
  }
}

const PwdCrackerEmptyRainbowError = new PwdCrackerError('Please enter possible passwords in rainbow_table.txt')
const PwdCrackerFalseUrlDomainOrPasswordError = new PwdCrackerError('URL Domain is not registered or Password(s) are not correct')

class PwdCracker {
  #stored_hash
  #loaded

  constructor () {
    this.#stored_hash = []
    this.#loaded = false
  }

  async loadStoredHash () {
    let data
    try {
      data = JSON.parse(await readFile('./stored_hash.json'))
    } catch (err) {
      data = []
    }
    const temp = this.#stored_hash
    this.#stored_hash = data

    for (const item of temp) {
      this.#stored_hash.push(item)
    }

    this.#loaded = true
  }

  async keepPassword (urlDomain, pwd) {
    const hashedUrlDomain = await hash(urlDomain, 10)
    const hashedPwd = await hash(pwd.split('\n')[0], 10)
    this.#stored_hash.push({ urlDomain: hashedUrlDomain, pwd: hashedPwd })
    await this.#save()
  }

  async #getAllUrlDomain () {
    if (!this.#loaded) {
      await this.loadStoredHash()
    }
    return this.#stored_hash.map((data) => {
      return data.urlDomain
    })
  }

  async tellPassword (urlDomain) {
    try {
      const allUrlDomain = await this.#getAllUrlDomain()

      let found = -1

      for (let i = 0; i < allUrlDomain.length; i++) {
        if (await compare(urlDomain, allUrlDomain[i])) {
          found = i
          break
        }
      }

      if (found === -1) {
        throw PwdCrackerFalseUrlDomainOrPasswordError
      }

      const rainbow = await this.#getRainbow()
      console.log(rainbow)

      if (!rainbow.length) {
        throw PwdCrackerEmptyRainbowError
      }

      for (const pwd of rainbow) {
        if (await compare(pwd, this.#stored_hash[found].pwd)) return pwd
      }
      throw PwdCrackerFalseUrlDomainOrPasswordError
    } catch (err) {
      this.#errorHandler(err)
      return false
    }
  }

  async #save () {
    if (!this.#loaded) {
      await this.loadStoredHash()
    }
    await writeFile('./stored_hash.json', JSON.stringify(this.#stored_hash))
  }

  async #getRainbow () {
    try {
      const rawRainbow = await readFile('./rainbow_table.txt')
      return await this.#rainbowParser(rawRainbow)
    } catch (err) {
      await appendFile('./rainbow_table.txt', '')
      return []
    }
  }

  async #rainbowParser (rawRainbow) {
    const rainbows = String(rawRainbow)
    return rainbows.split('\n')
  }

  #errorHandler (err) {
    console.error(err.message)
  }
}

export {
  PwdCracker
}
