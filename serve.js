const paths = require('./paths').paths
const fs = require('fs')
const pug = require('pug')
const sass = require('sass')
const liveServer = require("live-server")
 
const serverParams = {
    port: 8080,
    host: "0.0.0.0",
    root: "dist",
    open: false, 
    file: "index.html",
    // mount: [['/components', './node_modules']], // Mount a directory to a route.
    logLevel: 1,
}

const writePug = path => {
  let html = pug.renderFile(path)
  
  fs.writeFile(paths.html, html, err => {
    if (err) {
      console.error(err)
      return
    }
  })
}

const writeSass = path => {
  sass.render( { file: path } , (err, result) => {
    if (err) {
      console.error(err)
      return
    }

    let ws = fs.createWriteStream(paths.css)
    ws.write(result.css)
    ws.close()
  })
}

writePug(paths.pug)
writeSass(paths.sass)

let fsWaitForPug = false
fs.watch(paths.pug, (event, filename) => {
  if (filename) {
    if (fsWaitForPug) return

    fsWaitForPug = setTimeout(() => {
      fsWaitForPug = false
    }, 100)

    writePug(paths.pug)
  }
})

let fsWaitForSass = false
fs.watch(paths.sass, (event, filename) => {
  if (filename) {
    if (fsWaitForSass) return;
    fsWaitForSass = setTimeout(() => {
      fsWaitForSass = false;
    }, 100)

    writeSass(paths.sass)
  }
})

liveServer.start(serverParams)