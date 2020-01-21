import MongodbService from '../'

const databaseConfig = {
    database: 'manablox',
    host: 'localhost',
    port: 27017,
    settings: {
        useUnifiedTopology: true
    },
    cache: {
        enabled: true,
        maxMS: 100
    }
}

const mongodb = new MongodbService(databaseConfig)

const Start = async () => {
    await mongodb.Connect()

    let startTime = new Date().getTime()

    console.log('start2')

    for(let i = 0; i < 10; i++){
        await mongodb.Find({
            collection: 'test',
            query: {
                testing: 'bla'
            }
        })
    } 

    console.log((new Date().getTime() - startTime) / 1000)
}

Start()