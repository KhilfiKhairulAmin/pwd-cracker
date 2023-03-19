import { hash } from 'bcrypt'
import { writeFile, readFile } from 'node:fs/promises'

const keepPassword = async (urlDomain, pwd) => {
  const hashedPwd = await hash(pwd, 10)
  const data = await getData()

  data.push({
    urlDomain,
    hash: hashedPwd
  })

  await writeFile('./stored_hash.json', JSON.stringify(data))
}

const getData = async () => {
  try {
    const data = JSON.parse(await readFile('./stored_hash.json'))
    return data
  } catch (err) {
    return []
  }
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
