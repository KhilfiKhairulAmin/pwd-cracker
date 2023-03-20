import { hash } from 'bcrypt'
import { writeFile, readFile } from 'node:fs/promises'

class PwdCracker {
  constructor () {
    
  }

  async keepPassword (urlDomain, pwd) {
    const hashedPwd = await hash(pwd, 10)
    const data = await getData()
  
    data.push({
      urlDomain,
      hash: hashedPwd
    })
  
    await writeFile('./stored_hash.json', JSON.stringify(data))
  }
  
  async getData () {
    try {
      const data = JSON.parse(await readFile('./stored_hash.json'))
      return data
    } catch (err) {
      return []
    }
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
