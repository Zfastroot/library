const express = require('express')
const router = express.Router()
const Author = require('../models/author')

const Book = require('../models/books')
const path = require('path')
const imageMimeTypes = ['image/png','image/jpeg','image/jpg','image/gif']


//All authors
router.get('/',async (req,res)=>{
    let query = Book.find()
    if(req.query.title != null && req.query.title != ''){
        query = query.regex('title',new RegExp(req.query.title , 'i'))
    }
    if(req.query.publishedBefore != null && req.query.publishedBefore != ''){
        query = query.lte('publishDate',req.query.publishedBefore)
    }
    if(req.query.publishedAfter != null && req.query.publishedAfter != ''){
        query = query.gte('publishDate',req.query.publishedAfter)
    }
 
    const books = await query.exec()
    try{
        res.render('books/index',{
            books:books,
            searchOptions:req.query
        } )
    }catch{
        res.redirect('/')
    }
})

//New author route 'form'
router.get('/new',async (req,res)=>{
    renderNewPage(res,new Book())
})

//Create author
router.post('/',async (req,res)=>{
    const fileName = req.file != null ? req.file.filename : null
    const book = new Book({
        title : req.body.title ,
        author : req.body.author,
        publishDate: new Date(req.body.publishDate),
        pageCount: req.body.pageCount,
        description: req.body.description
    })  
    saveCover(book, req.body.cover)
   try{
    const newBook= await book.save()
    res.redirect('books')   
   }catch(error){
    console.error(error);  // Log the exact error to the console
    renderNewPage(res,book,true)
   }
})

router.get('/:id',async(req,res)=>{
    const book =await Book.findById(req.params.id)
    try{
        res.render('books/show',{
            book:book
        })
    }catch{
        res.redirect('/books')
    }
    
})
router.get('/:id/edit',async (req,res)=>{
    const book = await Book.findById(req.params.id)
    const authors = await Author.find({})
    try{ 
        res.render('books/edit',{
            book:book,
            authors:authors
        })
    }catch{

    }
})

router.put('/:id',async (req,res)=>{
    let book = await Book.findById(req.params.id)
    const authors = await Author.find({})
    try{
        book.title = req.body.title
        book.author = req.body.author        
        book.description = req.body.description
        book.publishDate = new Date(req.body.publishDate)
        book.pageCount = req.body.pageCount
        saveCover(book, req.body.cover)
    }catch(error){
        console.error(error);  // Log the exact error to the console
    }
})


async function renderNewPage(res , book , hasError = false){
    try{
        const authors = await Author.find({})
        const params = {
            authors : authors,
            book : book 
        }
        if(hasError)params.errorMessage = 'Error Creating the Book '
        res.render('books/new',params)
    }catch{
        res.redirect('/books')
    }
}
function saveCover(book,coverEncoded){
    if (coverEncoded == null) return
        const cover = JSON.parse(coverEncoded)
    if (cover != null && imageMimeTypes.includes(cover.type)) {
        book.coverImage = new Buffer.from(cover.data, 'base64' )
        book.coverImageType = cover.type
    }
}

module.exports = router