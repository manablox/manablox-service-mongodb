class Query {
    constructor({ collection = '', query = {}, sort = {}, connection = null }){
        this.collectionName = collection
        this.queryParams = query
        this.sortParams = sort
        this.connection = connection

        console.log(this.collectionName, this.queryParams, this.sortParams, this.connection)
    }
}