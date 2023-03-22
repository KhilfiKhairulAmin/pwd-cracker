import { compare, hash } from 'bcrypt'
import { writeFile, readFile, appendFile } from 'node:fs/promises'
import nodejsUrl from 'node:url'

class PwdCrackerError extends Error {
  constructor (message) {
    super(message)
    this.name = 'PwdCrackerError'
  }
}

const PwdCrackerEmptyRainbowError = new PwdCrackerError('Please enter possible passwords in rainbow_table.txt')
const PwdCrackerFalseUrlDomainOrPasswordError = new PwdCrackerError('URL Domain is not registered or provided password(s) are not correct')
const PwdCrackerIncompleteUrlHttp = new PwdCrackerError('Please include http or https in the URL')
const PwdCrackerInvalidUrl = new PwdCrackerError('URL is invalid')

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

  async keepPassword (url, pwd) {
    const urlDomain = this.#urlDomainParser(url)

    if (!urlDomain) {
      return false
    }

    const hashedUrlDomain = await hash(urlDomain, 15)
    const hashedPwd = await hash(pwd.split('\n')[0], 15)
    this.#stored_hash.push({ urlDomain: hashedUrlDomain, pwd: hashedPwd })
    await this.#save()
    return true
  }

  async #getAllUrlDomain () {
    if (!this.#loaded) {
      await this.loadStoredHash()
    }
    return this.#stored_hash.map((data) => {
      return data.urlDomain
    })
  }

  async tellPassword (url) {
    try {
      const urlDomain = this.#urlDomainParser(url)
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

      if (!rainbow.length) {
        throw PwdCrackerEmptyRainbowError
      }

      for (const pwd of rainbow) {
        if (await compare(pwd, this.#stored_hash[found].pwd)) {
          this.#clearRainbow()
          return pwd
        }
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

  #urlDomainParser (url) {
    try {
      const httpOrHttps = url.slice(0, 8) === 'https://' || url.slice(0, 7) === 'http://'

      if (!httpOrHttps) {
        throw PwdCrackerIncompleteUrlHttp
      }

      const { host } = nodejsUrl.parse(url)

      if (!host) {
        throw PwdCrackerInvalidUrl
      }

      return host
    } catch (err) {
      this.#errorHandler(err)
      return ''
    }
  }

  #clearRainbow () {
    writeFile('./rainbow_table.txt', '', { flag: 'w+' })
    console.log('Rainbow table have been cleared')
  }

  #errorHandler (err) {
    console.error(err.message)
  }
}

export {
  PwdCracker
}
