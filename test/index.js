import MongodbService from '../'
import Time from 'manablox-utils/time'

const time = new Time()
const subTime = new Time()

const databaseConfig = {
    database: 'manablox',
    host: 'localhost',
    port: 27017,
    settings: {
        useUnifiedTopology: true
    },
    cache: {
        enabled: true,
        maxMS: 200
    }
}

const mongodb = new MongodbService(databaseConfig)

const Start = async () => {
    await mongodb.Connect()

    const filter = {
        testing: 'bla'
    }

    time.StartTimer()

    for(let i = 0; i < 1000000; i++){
        //console.log('Test #' + i)
        
        subTime.StartTimer()

        await mongodb.FindOne({ collection: 'test', filter: filter })
        await mongodb.Find({ collection: 'test', filter: filter })

        const queryTime = (subTime.GetTimerTime() * 0.001).toFixed(3)

        //console.log('query time: ', queryTime + 's')
    }

    console.log(time.GetTimerTime() * 0.001)

    
}

Start()