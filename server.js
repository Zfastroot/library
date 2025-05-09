if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}

const express = require('express')
const expressLayout = require('express-ejs-layouts')
const indexRouter = require('./routes/index')
const authorsRouter = require('./routes/authors')
const booksRouter = require('./routes/books')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const path = require('path')
const methodOverride = require('method-override')

const app = express()

app.set('view engine','ejs')
app.set('views',__dirname + '/views')
app.set('layout','layouts/layout')

app.use(expressLayout)
app.use(methodOverride('_method'))
app.use(express.static('public'))

app.use(bodyParser.urlencoded({limit:'10mb',extended:false}))

mongoose.connect(process.env.DATABASE_URL)

const db = mongoose.connection

db.on('error',error => console.error(error))
db.once('open',()=> console.log('connected to mongoose'))

app.use('/',indexRouter)
app.use('/authors',authorsRouter)
app.use('/books',booksRouter)


app.listen(process.env.PORT || 3000)