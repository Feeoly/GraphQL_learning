const express = require('express')
const {graphqlHTTP} = require('express-graphql')
const schema = require('./schema/schema')
const mongoose = require('mongoose')

mongoose.connect('mongodb+srv://Feeoly:admin@cluster0.alvee.mongodb.net/graphql?retryWrites=true&w=majority')
mongoose.connection.once('open', ()=>{
    console.log('connected to database')
})

const app = express();

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true, // open a graphiql tool for you
}))

app.listen(4000, ()=>{
    console.log(`now listening for requests on port 4000`)
})