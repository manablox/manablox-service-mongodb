import { MongoClient } from 'mongodb'

import Time from 'manablox-utils/time'

const time = new Time()

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
    get DB(){
        return this.client.db(this.config.database)
    }

    Initialize(){
        console.log('initialize db connection', this.config)
        this.client = new MongoClient(`mongodb://${ this.config.host }:${ this.config.port }`, this.config.settings)
    }

    async Connect(){
        await this.client.connect()
    }

    CreateQueryKey({ filter = {}, sort = null, limit = null, skip = null }){
        const queryKey = `${ JSON.stringify(filter) }_${ JSON.stringify(sort) }_${ limit }_${ skip }`
        return queryKey
    }

    GetCachedQuery(queryKey){
        if(this.queries[queryKey] && this.queries[queryKey].queryTime > (time.Now - this.config.cache.maxMS)){
            return this.queries[queryKey]
        }

        return false
    }

    async Find({ 
        collection, 
        filter = {}, 
        sort = {}, 
        limit = 0, 
        skip = 0 
    }){
        const queryKey = this.CreateQueryKey({ filter, sort, limit, skip })

        const cachedQuery = this.GetCachedQuery(queryKey)
        if(cachedQuery) return cachedQuery.result

        let items = await this.DB.collection(collection)
            .find(filter)
            .sort(sort)
            .skip(skip)
            .limit(limit)
        items = await items.toArray()

        this.queries[queryKey] = { queryTime: time.Now, result: items }

        return items
    }

    async FindOne({ collection, filter }){
        const queryKey = this.CreateQueryKey({ filter })
        
        const cachedQuery = this.GetCachedQuery(queryKey)
        if(cachedQuery) return cachedQuery.result

        let item = await this.DB.collection(collection).findOne(filter)

        this.queries[queryKey] = { queryTime: time.Now, result: item }

        return item
    }
}

export default MongodbService
