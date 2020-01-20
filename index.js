import { MongoClient } from 'mongodb'
import Stringify from 'fast-safe-stringify'

import Query from './actions/query'

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

    async Find(collection, filter){
        // const filterKey = Stringify(filter)
        const filterKey = JSON.stringify(filter)
        const queryTime = new Date().getTime()
        
        if(this.queries[filterKey] && this.queries[filterKey].queryTime > (queryTime - this.config.cache.maxMS)){
            return this.queries[filterKey]
        }

        const db = this.client.db(this.config.database)
        const items = await db.collection(collection).find(filter).toArray()

        this.queries[filterKey] = { queryTime, items }
    }
}

export default MongodbService
