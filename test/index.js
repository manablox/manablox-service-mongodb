import MongodbService from '../'
import Time from 'manablox-utils/time'

const time = new Time()

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

    console.log(await mongodb.FindOne({ collection: 'test', filter: filter }))
    console.log(await mongodb.Find({ collection: 'test2', filter: filter }))

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

    try {
        console.log(await mongodb.FindById('test2', '5e2a92975d7b4f47aa42ae44'))
        await mongodb.UpdateById('test2', '5e2a92975d7b4f47aa42ae44', { hakuna: 'matata2' })
    }catch(err){ console.log(err) }

    console.log(await mongodb.FindById('test2', '5e2a92975d7b4f47aa42ae44'))
    

    const updates = await mongodb.Update({ collection: 'test2', query: { testing: 'blubb' }, data: { testing3: 'blubb2' } })

    

    console.log(time.GetTimerTime() * 0.001)

    
}

Start()