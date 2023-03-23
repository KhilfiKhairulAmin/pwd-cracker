import { compare, hash } from 'bcrypt'
import { writeFile, readFile, appendFile } from 'node:fs/promises'
import nodejsUrl from 'node:url'

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
const PwdCrackerIncompleteUrlHttp = new PwdCrackerError('Please include http or https in the URL')
/**
 * URL must be a URL. Non-URL is not accepted and can't be stored even as an identifier of a website
 */
const PwdCrackerInvalidUrl = new PwdCrackerError('URL is invalid')

/**
 * Core of the `pwd-cracker` application. Handles all backend operation inside the application.
 */
class PwdCracker {
  /**
   * Stores loaded data from `stored_hash.json`
   */
  #stored_hash
  #loaded

  constructor () {
    this.#stored_hash = []
    this.#loaded = false
  }

  /**
   * Loads data from `stored_hash.json`
   */
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

  /**
   * Validates and stores the URL domain and its corresponding password in the form of hash string
   * @param {String} url A valid URL (the URL domain will be parsed automatically)
   * @param {String} pwd Password to be stored
   * @returns {Boolean} Operation finish status `(success -> true || failed -> false)`
   */
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

  /**
   * Returns all URL domains
   * @returns {Array} URL Domain
   */
  async #getAllUrlDomain () {
    if (!this.#loaded) {
      await this.loadStoredHash()
    }
    return this.#stored_hash.map((data) => {
      return data.urlDomain
    })
  }

  /**
   * Validates the existence of URL and returns the correct password of the URL. **Important: Input passwords are taken from `rainbow_table.txt`**
   * @param {String} url A valid URL (the URL domain will be parsed automatically)
   * @returns {String} Password of the specified URL
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

  /**
   * Overwrite current `stored_hash.json` file with the value of `#stored_hash` variable
   */
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

  /**
   * Parse all *rainbows* (possible passwords) listed in `rainbow_table.txt` into an Array
   * @param {Buffer|String} rawRainbow Data from `rainbow_table.txt`
   * @returns {Array} Rainbows
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

  /**
   * Clear the content of `rainbow_table.txt` file
   */
  #clearRainbow () {
    writeFile('./rainbow_table.txt', '', { flag: 'w+' })
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
