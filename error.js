class InterfaceIsNotStartedError extends Error {
  super () {
    this.message = 'Please start the interface to use it'
    this.name = 'InterfaceIsNotStartedError'
  }
}

export default InterfaceIsNotStartedError
