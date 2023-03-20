import { hash } from 'bcrypt'
import { writeFile, readFile } from 'node:fs/promises'

class PwdCracker {
  stored_hash

  constructor () {
    this.stored_hash = []
  }

  async loadStoredHash () {
    let data
    try {
      data = JSON.parse(await readFile('./stored_hash.json'))
    } catch (err) {
      data = []
    }
    this.stored_hash = data
  }

  async keepPassword (urlDomain, pwd) {
    const hashedPwd = await hash(pwd, 10)
    this.stored_hash.push({ urlDomain, hash: hashedPwd })
    await this.#save()
  }

  async searchDomain (urlDomain) {
    const allUrlDomain = await this.#getAllUrlDomain()
    return allUrlDomain.findIndex((url) => {
      return url === urlDomain
    })
  }

  async #getAllUrlDomain () {
    return this.stored_hash.map((data) => {
      return data.urlDomain
    })
  }

  async tellPassword () {

  }

  async #save () {
    await writeFile('./stored_hash.json', JSON.stringify(this.stored_hash))
  }
}

export {
  PwdCracker
}
