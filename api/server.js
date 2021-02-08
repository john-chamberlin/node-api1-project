// BUILD YOUR SERVER HERE
const express = require('express')
// const generate = require('shortid').generate
const {find, findById, insert, update, remove} = require('./users/model')

const server = express()
server.use(express.json())

server.get('/api/users', async (req,res)=> {
    try {
        const users = await find()
        res.status(200).json(users)

    } catch(e) {
        res.status(500).json({message: 'The users information could not be retrieved'})
    }
})

server.get('/api/users/:id', async (req,res)=> {
    const idVar = req.params.id
    try {
        const user = await findById(idVar)
        if(!user) {
            res.status(404).json({message: 'The user with the specified ID does not exist'})
        } else {
            res.status(200).json(user)
        }
    } catch(e) {
        res.status(500).json('The user information could not be retrieved')
    }
})

server.post('/api/users', async (req,res)=> {
    const {name, bio} = req.body
    try {
        if(!name || !bio) {
            res.status(400).json({message: 'Please provide name and bio for the user'})
        } else {
            const newUser = await insert({name, bio})
            res.status(201).json(newUser)
        }
    } catch(e) {
        res.status(500).json({message: 'There was an error when saving the user to the database'})
    }
})

server.put('/api/users/:id', async (req,res)=> {
    const idVar = req.params.id
    const {name, bio} = req.body
    try {
        if(!name || !bio) {
            res.status(400).json({message: 'Please provide name and bio for the user'})
        } else {
            const newUser = await update(idVar, {name, bio})
            if(newUser === null) {
                res.status(404).json({message: `The user with the specified ID does not exist`})
            } else {
                res.status(200).json(newUser)
            }
        }
    } catch(e) {
        res.status(500).json({message: `Server error: ${e}`})
    }
})

server.delete('/api/users/:id', async (req,res)=> {
    const idVar = req.params.id
    try {
        const deletedUser = await remove(idVar)
        if(deletedUser === null) {
            res.status(404).json({message: `The user with the specified ID does not exist`})
        } else {
            res.status(200).json(deletedUser)
        }
    } catch(e) {
        res.status(500).json({message: `The user could not be removed`})
    }
})

server.get('*', (req,res)=>{
    res.status(404).json({message: '404 not found'})
})


module.exports = server; // EXPORT YOUR SERVER instead of {}
