const path = require('path')
const compression = require('compression')
const express = require('express')

/**
 * @param {import('express').Express} app
 */
function setupRoutes (app, prefix = '') {
  app.use(compression())
  app.use(prefix + '/', express.static(path.join(__dirname, '../public')))
}

module.exports = {
  setupRoutes
}
