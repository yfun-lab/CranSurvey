import dbConfObj from './src/functions/db-config'

export default defineNitroConfig({
  storage: {
    db: dbConfObj
  }

})
