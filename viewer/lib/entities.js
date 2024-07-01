const THREE = require('three')
const TWEEN = require('@tweenjs/tween.js')

const Entity = require('./entity/Entity')
const { dispose3 } = require('./dispose')

/**
 * @param {string} text
 * @param {any} font
 */
function getTextWidth(text, font) {
  /** @type {HTMLCanvasElement} */ // @ts-ignore re-use canvas object for better performance
  const canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"))
  const context = canvas.getContext('2d')
  if (!context) { throw null }
  context.font = font
  const metrics = context.measureText(text)
  return metrics.width
}

/**
 * @param {import('prismarine-entity').Entity} entity
 * @param {any} scene
 */
function getEntityMesh (entity, scene) {
  if (entity.name) {
    try {
      const e = new Entity('1.16.4', entity.name, scene)

      if (entity.username !== undefined) {
        const canvas = document.createElement('canvas')

        const ctx = canvas.getContext('2d')
        if (ctx) {
          const textWidth = getTextWidth(entity.username, `100px Minecraftia`)

          canvas.style.imageRendering = 'pixelated'
          canvas.height = 100
          canvas.width = Math.round(canvas.height * (textWidth / 100))

          ctx.msImageSmoothingEnabled = false
          ctx.mozImageSmoothingEnabled = false
          ctx.webkitImageSmoothingEnabled = false
          ctx.imageSmoothingEnabled = false

          ctx.font = `${canvas.height}px Minecraftia`
          ctx.fillStyle = '#0008'
          ctx.fillRect(0, 0, canvas.width, canvas.height)

          ctx.fillStyle = '#fff'
          ctx.textAlign = 'left'
          ctx.textBaseline = 'top'
  
          ctx.fillText(entity.username, 0, 0)
        }

        const tex = new THREE.Texture(canvas)
        tex.needsUpdate = true
        const spriteMat = new THREE.SpriteMaterial({ map: tex })
        const sprite = new THREE.Sprite(spriteMat)
        sprite.scale.setY(.5)
        sprite.position.y += entity.height + 0.6

        e.mesh.add(sprite)
      }
      return e.mesh
    } catch (err) {
      console.log(err)
    }
  }

  const geometry = new THREE.BoxGeometry(entity.width, entity.height, entity.width)
  geometry.translate(0, entity.height / 2, 0)
  const material = new THREE.MeshBasicMaterial({ color: 0xff00ff })
  const cube = new THREE.Mesh(geometry, material)
  return cube
}

class Entities {
  /**
   * @param {any} scene
   */
  constructor (scene) {
    this.scene = scene
    this.entities = {}
  }

  clear () {
    for (const mesh of Object.values(this.entities)) {
      this.scene.remove(mesh)
      dispose3(mesh)
    }
    this.entities = {}
  }

  /**
   * @param {import("prismarine-entity").Entity} entity
   */
  update (entity) {
    if (!this.entities[entity.id]) {
      const mesh = getEntityMesh(entity, this.scene)
      if (!mesh) return
      this.entities[entity.id] = mesh
      this.scene.add(mesh)
    }

    const e = this.entities[entity.id]

    if (entity.delete) {
      this.scene.remove(e)
      dispose3(e)
      delete this.entities[entity.id]
    }

    if (entity.pos) {
      new TWEEN.Tween(e.position).to({ x: entity.pos.x, y: entity.pos.y, z: entity.pos.z }, 50).start()
    }
    if (entity.yaw) {
      const da = (entity.yaw - e.rotation.y) % (Math.PI * 2)
      const dy = 2 * da % (Math.PI * 2) - da
      new TWEEN.Tween(e.rotation).to({ y: e.rotation.y + dy }, 50).start()
    }
  }
}

module.exports = { Entities }
