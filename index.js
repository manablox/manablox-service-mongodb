import { MongoClient } from 'mongodb'

class MongodbService {
    constructor(config){
        this.config = config
        this.client = null
        this.queries = {}
        
        this.Initialize()
    }

    get Client(){
        return this.client
    }

    Initialize(){
        console.log('initialize db connection', this.config)
        this.client = new MongoClient(`mongodb://${ this.config.host }:${ this.config.port }`, this.config.settings)
    }

    async Connect(){
        await this.client.connect()
    }

    async Find({ 
        collection, 
        filter = {}, 
        sort = {}, 
        limit = 0, 
        skip = 0 
    }){
        const filterKey = `${ JSON.stringify(filter) }_${ JSON.stringify(sort) }_${ limit }_${ skip }`
        const queryTime = new Date().getTime()
        
        if(this.queries[filterKey] && this.queries[filterKey].queryTime > (queryTime - this.config.cache.maxMS)){
            return this.queries[filterKey]
        }

        const db = this.client.db(this.config.database)
        const items = await db.collection(collection)
            .find(filter)
            .sort(sort)
            .skip(skip)
            .limit(limit)
        console.log('test')

        this.queries[filterKey] = { queryTime, items: await items.toArray() }
    }

    async FindOne(collection, filter){

    }
}

export default MongodbService
