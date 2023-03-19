import { hash } from 'bcrypt'
import { writeFile, readFile } from 'node:fs/promises'

const keepPassword = async (urlDomain, pwd) => {
  const hashedPwd = await hash(pwd, 10)
  const data = await getData()
  data.push({
    urlDomain,
    hash: hashedPwd
  })

  await writeFile('./stored_hash.json', data)
}

const getData = async () => {
  return JSON.parse(await readFile('./stored_hash.json'))
}

const searchDomain = async (urlDomain) => {
  const allUrlDomain = await getUrlDomain()
  return allUrlDomain.findIndex((url) => {
    return url === urlDomain
  })
}

const getUrlDomain = async () => {
  const data = await getData()
  return data.map((pwd) => {
    return pwd.urlDomain
  })
}

const tellPassword = async () => {

}

export {
  keepPassword,
  searchDomain,
  getUrlDomain,
  tellPassword
}
