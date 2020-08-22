
//define the graph
const graphql = require('graphql')
const _ = require('lodash')

// object types
const { 
    GraphQLObjectType, 
    GraphQLString, 
    GraphQLSchema,
    GraphQLID,
    GraphQLInt,
} = graphql

// dummy data
var books = [
    {name: 'book1', genre: 'Fantasy', id:'1'},
    {name: 'book2', genre: 'Fantasy', id:'2'},
    {name: 'book3', genre: 'Sci-Fi', id:'3'},
]
var authors = [
    {name: 'Feeoly', age: '40', id:'1'},
    {name: 'Tom', age: '50', id:'2'},
    {name: 'Ryn', age: '60', id:'3'},
]
/**
 * Why filed is function? 
 * because we will have multiple types and they will refer to each other 
 * unless we wrap each field in a function, one type is not necessarily known another type is
 */
const BookType = new GraphQLObjectType({
    name: 'Book',
    fields: ()=>({
        id: {type: GraphQLID},// it is not a JS string, it is a string from graphql that graphql can understand
        name: {type: GraphQLString},
        genre: {type: GraphQLString}
    })
})

const AuthorType = new GraphQLObjectType({
    name: 'Author',
    fields: ()=>({
        id: {type: GraphQLID},// it is not a JS string, it is a string from graphql that graphql can understand
        name: {type: GraphQLString},
        age: {type: GraphQLInt}
    })
})

//relations between types


// define root query
// front-end query:
// book(id:'123'){
//     name
//     genre
// }
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        book: {
            type: BookType,
            args: { id:{ type: GraphQLID } }, // params,which i need to look for,like id:123; GraphQLID(int and string both ok) VS GraphQLString(only string type)
            resolve(parent, args) { // when we get the data, the func will be fire
                // code to get data from db/ other source
                return _.find(books, {id: args.id}) // lodash
            }
        },
        author: {
            type: AuthorType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args){
                return _.find(authors, {id: args.id}) 
            }
        }

    }
})

// exports schema
// which query that we allow users to query
module.exports = new GraphQLSchema({
    query: RootQuery
})