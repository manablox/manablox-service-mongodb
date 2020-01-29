import { MongoClient, ObjectID } from 'mongodb'

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
        skip = 0,
        nocache = false 
    }){
        let queryKey = null
        let cachedQuery = null

        if(!nocache){
            queryKey = this.CreateQueryKey({ filter, sort, limit, skip })
            cachedQuery = this.GetCachedQuery(queryKey)
            if(cachedQuery) return cachedQuery.result
        }
        
        let items = await this.DB.collection(collection)
            .find(filter)
            .sort(sort)
            .skip(skip)
            .limit(limit)
        items = await items.toArray()

        if(!nocache) this.queries[queryKey] = { queryTime: time.Now, result: items }

        return items
    }
    async FindById(collection, id, { nocache } = { nocache: false }){
        return await this.FindOne({ collection, filter: { _id: new ObjectID(id) }, nocache })
    }

    async FindOne({ collection, filter, nocache = false }){
        let queryKey = null
        let cachedQuery = null

        if(!nocache){
            queryKey = this.CreateQueryKey({ filter })
            cachedQuery = this.GetCachedQuery(queryKey)
            if(cachedQuery) return cachedQuery.result
        }

        let item = await this.DB.collection(collection).findOne(filter)

        if(!nocache) this.queries[queryKey] = { queryTime: time.Now, result: item }

        return item
    }

    async Create({ collection, data }){
        let insertMethod = 'insertOne'
        if(Array.isArray(data)) insertMethod = 'insertMany'

        const result = await this.DB.collection(collection)[insertMethod](data)

        if(result.ops.length == 0) return false
        if(result.ops.length == 1) return result.ops[0]

        return result.ops
    }

    async UpdateById(collection, id, data){
        return await this.Update({ collection, query: { _id: new ObjectID(id) }, data })
    }

    async Update({ collection, query, data }){
        return await this.DB.collection(collection).updateMany(query, { $set: data })
    }

    async DeleteById(collection, id, data){
        return await this.Delete({ collection, query: { _id: new ObjectID(id) }, data })
    }

    async Delete({ collection, query, data }){
        return await this.DB.collection(collection).deleteMany(query)
    }
}

export default MongodbService
