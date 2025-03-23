import express from 'express'
import router from './routes/api'
import bodyParser from 'body-parser'
import db from './utils/database'

async function init(){
     try {

          const database = await db()
          console.log('Database status:', database)

          const app = express()

          const PORT = 3000

          app.use(bodyParser.json())

          app.get('/', (req, res) => {
               res.status(200).json({
                    message: "Server is running",
                    data: null
               })
          })
          app.use('/api', router)

          app.listen(PORT, () => {
               console.log(`Server is running on http://localhost:${PORT}`)
          })

     } catch (error){
          console.log(error)
     }
}

init();

