import { hash } from 'bcrypt'
import { writeFile, readFile } from 'node:fs/promises'

const keepPassword = async (urlDomain, pwd) => {

}

const searchDomain = async (urlDomain) => {

}

const listUrlDomain = async () => {
  const data = JSON.parse(await readFile('./stored_hash.json'))
  return data.map((pwd) => {
    return pwd.urlDomain
  })
}

const tellPassword = async () => {

}

listUrlDomain()