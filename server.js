const app = require('./server/index')
const chalk = require('chalk')
const PORT = 8000

app.listen(PORT, () => {
  console.log(chalk.magenta(`Serving on port ${PORT}`))
})
