module.exports = {
  /**
   * @param {import('three').Mesh} o
   */
  dispose3 (o) {
    o.geometry?.dispose()
    o.dispose?.()
  }
}
