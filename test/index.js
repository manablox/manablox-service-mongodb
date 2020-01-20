import MongodbService from '../'

const databaseConfig = {
    database: 'manablox',
    host: 'localhost',
    port: 27017,
    settings: {
        useUnifiedTopology: true
    },
    cache: {
        maxMS: 100
    }
}

const mongodb = new MongodbService(databaseConfig)

const Start = async () => {
    await mongodb.Connect()

    let startTime = new Date().getTime()

    console.log('start')

    for(let i = 0; i < 10000; i++){
        await mongodb.Find('test', { testing: 'bla' })
    }

    console.log((new Date().getTime() - startTime) / 1000)
}

Start()