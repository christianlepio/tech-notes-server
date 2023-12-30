// import mongoose
const mongoose = require('mongoose')
// import AutoIncrement
const AutoIncrement = require('mongoose-sequence')(mongoose)

// Everything in Mongoose starts with a Schema
// Each schema maps to a MongoDB collection and
// defines the shape of the documents within that collection

// define schema
const noteSchema = new mongoose.Schema(
    {
        // id is auto generated by mongoDB
        user: {
            // type of this will refer to the users collection in techNotesDB objectID
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        title: {
            type: String,
            required: true
        },
        text: {
            type: String,
            required: true
        },
        completed: {
            type: Boolean,
            default: false
        }
    }, 
    {
        // mongoDB will automatically add timestamps (created at & updated at)
        timestamps: true
    }
)

noteSchema.plugin(AutoIncrement, {
    // these are options

    // increment field is going to be named 'ticket'
    // this will create a ticket field inside the note schema
    inc_field: 'ticket', 
    // this will not be visible in the notes collection but this will create a separate collection named 'counter'
    id: 'ticketNums',
    // this will start the value of unique sequence number from 100
    start_seq: 100
})

// create a data model
// 'Note' is a singular and will find its equivalent plural form in the collections from mongoDB
module.exports = mongoose.model('Note', noteSchema)