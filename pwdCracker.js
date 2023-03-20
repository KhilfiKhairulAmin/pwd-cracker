import { compare, hash } from 'bcrypt'
import { writeFile, readFile } from 'node:fs/promises'

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
    const hashedPwd = await hash(pwd, 10)
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

  async tellPassword (urlDomain, pwd) {
    const allUrlDomain = await this.#getAllUrlDomain()

    const found = allUrlDomain.findIndex(async (hashedUrlDomain) => {
      return await compare(urlDomain, hashedUrlDomain)
    })

    if (found === -1) {
      return false
    }

    if (!(await compare(pwd, this.#stored_hash[found].pwd))) {
      return false
    }

    return pwd
  }

  async #save () {
    if (!this.#loaded) {
      await this.loadStoredHash()
    }
    await writeFile('./stored_hash.json', JSON.stringify(this.#stored_hash))
  }
}

export {
  PwdCracker
}
