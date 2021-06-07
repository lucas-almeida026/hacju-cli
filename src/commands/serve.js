const command = {
  name: 'serve',
  run: async toolbox => {
    const {
      print: { success, info },
      system
    } = toolbox //

    setTimeout(() => {
      success('Serving with nodemon')
      info('> NEXT STEPS')
      info('start the live server in the root folder')
    }, 500)
    await system.run('nodemon server.js')
  }
}

module.exports = command