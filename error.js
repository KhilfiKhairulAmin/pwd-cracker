class InterfaceError extends Error {
  constructor (message) {
    super(message)
    this.name = 'InterfaceError'
  }
}

const InterfaceNotStartedError = new InterfaceError('Interface is not started. Please start the interface to use it.')

export {
  InterfaceError,
  InterfaceNotStartedError
}
