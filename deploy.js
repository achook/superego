const paths = require('./paths').paths
const fs = require('fs')
const pug = require('pug')
const sass = require('sass')

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
fs.copyFileSync(paths.robotsIn, paths.robotsOut)