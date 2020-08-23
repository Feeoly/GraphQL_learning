
//define the graph
const graphql = require('graphql')
const _ = require('lodash')

// mongoose schema(organize the data)
const Book = require('../models/book')
const Author = require('../models/author')

// object types
const { 
    GraphQLObjectType, 
    GraphQLString, 
    GraphQLSchema,
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull,
} = graphql

// dummy data
// var books = [
//     {name: 'book1', genre: 'Fantasy', id:'1', authorid: '1'},
//     {name: 'book2', genre: 'Fantasy', id:'2', authorid: '2'},
//     {name: 'book3', genre: 'Sci-Fi', id:'3', authorid: '3'},
//     {name: 'book4', genre: 'Sci-Fi', id:'4', authorid: '2'},
//     {name: 'book5', genre: 'Sci-Fi', id:'5', authorid: '3'},
//     {name: 'book6', genre: 'Sci-Fi', id:'6', authorid: '1'},
// ]
// var authors = [
//     {name: 'Feeoly', age: '40', id:'1'},
//     {name: 'Tom', age: '50', id:'2'},
//     {name: 'Ryn', age: '60', id:'3'},
// ]

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
        genre: {type: GraphQLString},
        author: { // relations between types
            type: AuthorType,
            resolve(parent, args) {
                // return _.find(authors, {id: parent.authorid})
                return Author.findById(parent.authorid)
            }
        }
    })
})

const AuthorType = new GraphQLObjectType({
    name: 'Author',
    fields: ()=>({
        id: {type: GraphQLID},// it is not a JS string, it is a string from graphql that graphql can understand
        name: {type: GraphQLString},
        age: {type: GraphQLInt},
        book: {
            type: new GraphQLList(BookType), //  a bunch of books rather than a book
            resolve(parent, args){
                // return _.filter(books, {authorid: parent.id})
                return Book.find({authorid: parent.id})
            }
        }
    })
})

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
                // return _.find(books, {id: args.id}) // lodash
                return Book.findById(args.id)
            }
        },
        author: {
            type: AuthorType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args){
                // return _.find(authors, {id: args.id}) 
                return Author.findById(args.id)
            }
        },
        books: {
            type: new GraphQLList(BookType),
            resolve(parent, args) {
                // return books
                return Book.find({})
            }
        },
        authors: {
            type: new GraphQLList(AuthorType),
            resolve(parent, args) {
                // return authors
                return Author.find({})
            }
        }

    }
})

// mutate data
const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addAuthor: {
            type: AuthorType,
            args: {
                name: {type: GraphQLNonNull(GraphQLString)},
                age: {type: GraphQLNonNull(GraphQLInt)}
            },
            resolve(parent, args) {
                let author = new Author({
                    name: args.name,
                    age: args.age
                })
                // save to db, then return it back, so front-end can receive the data
                return author.save()
            }
        },
        addBook: {
            type: BookType,
            args: {
                name:{type: GraphQLNonNull(GraphQLString)},
                genre:{type: GraphQLNonNull(GraphQLString)},
                authorid:{type: GraphQLNonNull(GraphQLID)}
            },
            resolve(parent, args){
                let book = new Book({
                    name: args.name,
                    genre:args.genre,
                    authorid: args.authorid
                })
                return book.save()
            }
        }
    }
})

// exports schema and mutation to let user do something
// which query that we allow users to query
module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
})