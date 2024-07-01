/* global XMLHttpRequest */
const THREE = require('three')

const textureCache = {}
/**
 * @param {string} texture
 * @param {(data: any) => void} callback
 */
function loadTexture (texture, callback) {
  if (!textureCache[texture]) {
    textureCache[texture] = new THREE.TextureLoader().load(texture)
  }
  callback(textureCache[texture])
}

/**
 * @param {string | URL} url
 * @param {(data: any) => void} callback
 */
function loadJSON (url, callback) {
  const xhr = new XMLHttpRequest()
  xhr.open('GET', url, true)
  xhr.responseType = 'json'
  xhr.onload = function () {
    const status = xhr.status
    if (status === 200) {
      callback(xhr.response)
    } else {
      throw new Error(url + ' not found')
    }
  }
  xhr.send()
}

module.exports = { loadTexture, loadJSON }
