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

    for(let i = 0; i < 10; i++){
        //console.log('Test #' + i)
        
        subTime.StartTimer()

        await mongodb.FindOne({ collection: 'test', filter: filter })
        console.log(await mongodb.Find({ collection: 'test2', filter: filter }))

        const queryTime = (subTime.GetTimerTime() * 0.001).toFixed(3)

        //console.log('query time: ', queryTime + 's')
    }

    console.log(await mongodb.Create({ 
        collection: 'test2', 
        data: { testing: 'blubb', testing2: 'bla' }
    }))

    console.log(await mongodb.Create({ 
        collection: 'test2', 
        data: [
            { testing: 'bla', testing2: 'bla' },
            { testing: 'blubb', testing2: 'bla' }
        ]}))

    // console.log(await mongodb.FindById({ collection: 'test2', id: '5e2a92975d7b4f47aa42ae44' }))
    console.log(await mongodb.FindById('test2', '5e2a92975d7b4f47aa42ae44'))//{ collection: 'test2', id: '5e2a92975d7b4f47aa42ae44' }))

    const updates = await mongodb.Update({ collection: 'test2', query: { testing: 'blubb' }, data: { testing3: 'blubb2' } })

    

    console.log(time.GetTimerTime() * 0.001)

    
}

Start()