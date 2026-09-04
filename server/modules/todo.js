const { text } = require('express')
const { type, timestampAdd } = require('firebase/firestore/pipelines')
const mongoose = require('mongoose')

const todoschema = new mongoose.Schema(
    {
        text: {
            type: String,
            required: true,
        },
        isCompeleted: {
            type: Boolean,
            default: false,
        },
    },
    {timestamp:true}
);



module.exports = mongoose.model('Todo', todoschema);