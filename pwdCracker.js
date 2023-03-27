import { compare, hashSync } from 'bcrypt'
import { readFileSync, writeFileSync, appendFileSync, existsSync, mkdirSync } from 'node:fs'
import nodejsUrl from 'node:url'
import { homedir } from 'node:os'

const homeDir = homedir()
const storedHashFilename = 'stored_hash.json'
const rainbowTableFilename = 'rainbow_table.txt'

/**
 * Error object used in `PwdCracker` class context
 */
class PwdCrackerError extends Error {
  constructor (message) {
    super(message)
    this.name = 'PwdCrackerError'
  }
}

/**
 * Passwords must be listed in `rainbow_table.txt`
 */
const PwdCrackerEmptyRainbowError = new PwdCrackerError('Please list possible passwords in rainbow_table.txt')
/**
 * Ambigouos error that contains two possible factors, URL Domain and password. URL domain must be registered first through `keepPassword()` function and password must be congruent with the provided one in registration
 */
const PwdCrackerFalseUrlDomainOrPasswordError = new PwdCrackerError('URL Domain is not registered or provided password(s) are not correct')
/**
 * HTTP Protocol must be included to determine the validity of the URL
 */
const PwdCrackerIncompleteUrlHttpError = new PwdCrackerError('Please include http or https in the URL')
/**
 * URL must be a URL. Non-URL is not accepted and can't be stored even as an identifier of a website
 */
const PwdCrackerInvalidUrlError = new PwdCrackerError('URL is invalid')
/**
 * A pwd can't be an empty string
 */
const PwdCrackerEmptyPwdStringError = new PwdCrackerError('Password can\'t be empty')

class PwdCracker {
  /**
   * Stores loaded data from `stored_hash.json`
   */
  #storedHash
  #storedHashPath = `${homeDir}/.pwd-cracker`
  #rainbowTablePath = `${homeDir}/Desktop`
  #loaded

  /**
    * Core of the `pwd-cracker` application. Handles all backend operation inside the application.
    */
  constructor () {
    this.#storedHash = []
    this.#loaded = false

    if (!existsSync(this.#storedHashPath)) {
      mkdirSync(this.#storedHashPath)
    }

    this.#storedHashPath += `/${storedHashFilename}`
    this.#rainbowTablePath += `/${rainbowTableFilename}`
  }

  /**
   * Gets data from `stored_hash.json`
   */
  #getData () {
    return JSON.parse(readFileSync(this.#storedHashPath))
  }

  /**
   * Validates and stores the URL domain and its corresponding password in the form of hash string
   * @param {String} url A valid URL (the URL domain will be parsed automatically)
   * @param {String} pwd Password to be stored
   */
  keepPassword (url, pwd) {
    this.#validatePassword(pwd)
    const urlDomain = this.#urlDomainParser(url)
    const hashedUrlDomain = hashSync(urlDomain, 15)
    const hashedPwd = hashSync(pwd.split('\n')[0], 15)
    const data = this.#getData()
    data.push({
      urlDomain: hashedUrlDomain,
      pwd: hashedPwd
    })
    this.#save(data)
  }

  #validatePassword (pwd) {
    if (pwd === '') {
      throw PwdCrackerEmptyPwdStringError
    }
  }

  /**
   * Returns all URL domains
   * @returns {Promise<Boolean>} URL Domain
   */
  async #getAllUrlDomain () {
    if (!this.#loaded) {
      await this.#getData()
    }
    return this.#storedHash.map((data) => {
      return data.urlDomain
    })
  }

  /**
   * Validates the existence of URL and returns the correct password of the URL. **Important: Input passwords are taken from `rainbow_table.txt`**
   * @param {String} url A valid URL (the URL domain will be parsed automatically)
   * @returns {Promise<String>} Password of the specified URL
   */
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
        if (await compare(pwd, this.#storedHash[found].pwd)) {
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

  /**
   * Overwrite current `stored_hash.json` file with the value of `#stored_hash` variable
   */
  #save (data) {
    writeFileSync(this.#storedHashPath, JSON.stringify(data))
  }

  /**
   * Gets all rainbows and return it inside an Array
   * @returns {Promise<String>}
   */
  async #getRainbow () {
    try {
      const rawRainbow = await readFileSync(this.#rainbowTablePath)
      return await this.#rainbowParser(rawRainbow)
    } catch (err) {
      await appendFileSync(this.#rainbowTablePath, '')
      return []
    }
  }

  /**
   * Parse all *rainbows* (possible passwords) listed in `rainbow_table.txt` into an Array
   * @param {Buffer} rawRainbow Data from `rainbow_table.txt`
   * @returns {Promise<Array<String>} Rainbows
   */
  async #rainbowParser (rawRainbow) {
    const rainbows = String(rawRainbow)
    return rainbows.split('\n')
  }

  /**
   * Validates and parses URL domain
   * @param {String} url A valid URL (the URL domain will be parsed automatically)
   * @returns {String} URL Domain
   */
  #urlDomainParser (url) {
    const httpOrHttps = url.slice(0, 8) === 'https://' || url.slice(0, 7) === 'http://'

    if (!httpOrHttps) {
      throw PwdCrackerIncompleteUrlHttpError
    }

    const { host } = nodejsUrl.parse(url)

    if (!host) {
      throw PwdCrackerInvalidUrlError
    }

    return host
  }

  /**
   * Delete `rainbow_table.txt` file
   */
  #clearRainbow () {
    writeFileSync(this.#rainbowTablePath, '', { flag: 'w+' })
    console.log('Rainbow table have been cleared')
  }

  /**
   * Handles error inside the class
   * @param {PwdCrackerError} err Error that occured in `PwdCracker` context
   */
  #errorHandler (err) {
    console.error(err.message)
  }
}

export {
  PwdCracker
}
