const Chunks = require('prismarine-chunk')
const mcData = require('minecraft-data')

/**
 * @param {number} x
 * @param {number} z
 */
function columnKey (x, z) {
  return `${x},${z}`
}

/**
 * @param {import('vec3').Vec3} pos
 */
function posInChunk (pos) {
  pos = pos.floored()
  pos.x &= 15
  pos.z &= 15
  return pos
}

/**
 * @param {string | any[]} shapes
 */
function isCube (shapes) {
  if (!shapes || shapes.length !== 1) return false
  const shape = shapes[0]
  return shape[0] === 0 && shape[1] === 0 && shape[2] === 0 && shape[3] === 1 && shape[4] === 1 && shape[5] === 1
}

class World {
  /**
   * @param {string | number} version
   */
  constructor (version) {
    this.Chunk = Chunks(version)
    /** @type {{ [key: string]: any }} */
    this.columns = {}
    /** @type {{ [key: string]: any }} */
    this.blockCache = {}
    /** @type {{ [id: number]: mcData.Biome }} */
    this.biomeCache = mcData(version).biomes
  }

  /**
   * @param {number} x
   * @param {number} z
   * @param {any} json
   */
  addColumn (x, z, json) {
    const chunk = this.Chunk.fromJson(json)
    this.columns[columnKey(x, z)] = chunk
    return chunk
  }

  /**
   * @param {number} x
   * @param {number} z
   */
  removeColumn (x, z) {
    delete this.columns[columnKey(x, z)]
  }

  /**
   * @param {number} x
   * @param {number} z
   */
  getColumn (x, z) {
    return this.columns[columnKey(x, z)]
  }

  /**
   * @param {import('vec3').Vec3} pos
   * @param {any} stateId
   */
  setBlockStateId (pos, stateId) {
    const key = columnKey(Math.floor(pos.x / 16) * 16, Math.floor(pos.z / 16) * 16)

    const column = this.columns[key]
    // null column means chunk not loaded
    if (!column) return false

    column.setBlockStateId(posInChunk(pos.floored()), stateId)

    return true
  }

  /**
   * @param {import('vec3').Vec3} pos
   * @returns {import('prismarine-block').Block | null}
   */
  getBlock (pos) {
    const key = columnKey(Math.floor(pos.x / 16) * 16, Math.floor(pos.z / 16) * 16)

    const column = this.columns[key]
    // null column means chunk not loaded
    if (!column) return null

    const loc = pos.floored()
    const locInChunk = posInChunk(loc)
    const stateId = column.getBlockStateId(locInChunk)

    if (!this.blockCache[stateId]) {
      const b = column.getBlock(locInChunk)
      b.isCube = isCube(b.shapes)
      this.blockCache[stateId] = b
    }

    const block = this.blockCache[stateId]
    block.position = loc
    block.biome = this.biomeCache[column.getBiome(locInChunk)]
    if (block.biome === undefined) {
      block.biome = this.biomeCache[1]
    }
    return block
  }
}

module.exports = { World }
