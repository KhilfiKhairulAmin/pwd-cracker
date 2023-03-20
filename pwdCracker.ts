import { hash } from 'bcrypt'
import { writeFile, readFile } from 'node:fs/promises'

class PwdCracker {
  stored_hash

  constructor (data) {

  }

  async init () {
    let data
    try {
      data = JSON.parse(await readFile('./stored_hash.json'))
    } catch (err) {
      data = []
    }
    constructor()
  }

  async reloadStoredHash () {
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
    const data = await getData()

    this.stored_hash = 
  
    await writeFile('./stored_hash.json', JSON.stringify(data))
  }
  
  async searchDomain (urlDomain) {
    const allUrlDomain = await getUrlDomain()
    return allUrlDomain.findIndex((url) => {
      return url === urlDomain
    })
  }
  
  async getUrlDomain () {
    const data = await getData()
    return data.map((pwd) => {
      return pwd.urlDomain
    })
  }
  
  async tellPassword () {
  
  }
}

export {
  keepPassword,
  searchDomain,
  getUrlDomain,
  tellPassword
}