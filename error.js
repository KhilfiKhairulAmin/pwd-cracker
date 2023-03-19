class InterfaceError extends Error {
  constructor (message) {
    super(message)
    this.name = 'InterfaceError'
  }
}

export default InterfaceError
