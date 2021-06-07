const fs = require('fs')

const command = {
  name: 'new',
  run: async toolbox => {
    const {
      parameters,
      print: { error, info, warning },
      packageManager,
      filesystem
    } = toolbox //

    if (!parameters.first) {
      error('Application name is required')
      return
    }
    const compPath = `./${parameters.first}/compiler`
    const preDefPath = './../predefined-files'

    if (!filesystem.exists(compPath)) {
      fs.mkdirSync(`./${parameters.first}`)
      fs.mkdirSync(compPath)
    }

    if (!filesystem.exists(compPath + '/ast')) fs.mkdirSync(compPath + '/ast')

    const packageJson = await filesystem.readAsync(__dirname + preDefPath + '/package.txt')
    await filesystem.writeAsync(`./app/package.json`, packageJson.replace('_appName_', parameters.first), { jsonIndent: 2 })

    const html = await filesystem.readAsync(__dirname + preDefPath + '/index-html.txt')
    const hcju = await filesystem.readAsync(__dirname + preDefPath + '/index-hcju.txt')

    const langFile = await filesystem.readAsync(__dirname + preDefPath + `/compiler/hcju.txt`)
    const lexer = await filesystem.readAsync(__dirname + preDefPath + `/compiler/lexer.txt`)
    const parser = await filesystem.readAsync(__dirname + preDefPath + `/compiler/parser.txt`)
    const generator = await filesystem.readAsync(__dirname + preDefPath + `/compiler/generator.txt`)
    const runtime = await filesystem.readAsync(__dirname + preDefPath + `/compiler/runtime.txt`)

    await filesystem.writeAsync(compPath + '/hcju.js', langFile)
    await filesystem.writeAsync(compPath + '/lexer.js', lexer)
    await filesystem.writeAsync(compPath + '/parser.js', parser)
    await filesystem.writeAsync(compPath + '/generator.js', generator)
    await filesystem.writeAsync(compPath + '/runtime.js', runtime)
    await filesystem.writeAsync('./app/index.html', html)
    await filesystem.writeAsync('./app/index.hcju', hcju)
    await filesystem.writeAsync('./app/index.js', "alert('Its working!')")
    await filesystem.writeAsync('./app/nodemon.json', {
      ext: '.js, .json, .hcju',
      exec: 'npm run g',
      ignore: 'index.js'
    })

    info('')
    info('> NEXT STEPS')
    info(`$ cd ${parameters.first}`)
    packageManager.hasYarn() ? info('$ yarn add') : info('$ npm i')
    info('$ hcju serve')
    warning('  |')
    warning('   -> global nodemon is required')
  }
}

module.exports = command