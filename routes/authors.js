const express = require('express')
const router = express.Router()
const Author = require('../models/author')
const { cache } = require('ejs')
const Book =require('../models/books')
const author = require('../models/author')

//All authors
router.get('/',async (req,res)=>{
    let = searchOptions = {}
    if(req.query.name != null && req.query.name != '' ){
        searchOptions.name = new RegExp(req.query.name,'i')
    }
    try{
        const authors =await Author.find(searchOptions)
        res.render('authors/index',{
            authors: authors,
            searchOptions: req.query
        })
    }catch{
        res.redirect('/')
    }
})

//New author route 'form'
router.get('/new',(req,res)=>{
    res.render('authors/new',{author:new Author()})
})

//Create author
router.post('/',async (req,res)=>{
    const author = new Author(
        {name : req.body.name}
    )
    try{
        const newAuthor = await author.save()
        //res.redirect(`authors/${newAuthor.id}`)
        res.redirect('authors')
    }catch(err){
        res.render('authors/new',{
            author :author,
            errorMessage:'Error Creating the author'
        })  
    }
})

router.get('/:id',async (req,res)=>{
    const author = await Author.findById(req.params.id)
    const books = await Book.find({author:author.id}).limit(6).exec()
    try{
        res.render('authors/show',{
            author:author,
            books:books,
        })
    }catch{
        res.redirect('/authors')
    } 
})

router.get('/:id/edit',async(req,res)=>{
    try{
        const author = await Author.findById(req.params.id)
        res.render('authors/edit',{author:author})
    }catch{
        res.redirect('/authors')
    }
})

router.put('/:id/',async(req,res)=>{
    let author
    try{
        author = await Author.findById(req.params.id)
        author.name = req.body.name
        await author.save()
        res.redirect('/authors')
    }catch{
        if(author == null){
            res.redirect('/')
        }else{
            res.render('authors/:id/edit',{
                author :author,
                errorMessage:'Error Updating the author'
            }) 
        }
    }
})



// router.delete('/:id',async (req,res)=>{
//     let author
//     try{
//         author = await Author.findById(req.params.id)
//         await Author.deleteOne({ _id: req.params.id })  // Use deleteOne here
//         res.redirect('/authors')
        
//         }catch(err){
//         if(author == null){
//             res.redirect('/')
//         }else{
//             res.redirect('/authors')
//             console.log(err)
//         }
//     }
// })

router.delete('/:id', async (req, res) => {
    let author
    try {
        author = await Author.findById(req.params.id)
        
        // Check if the author has any books associated
        const books = await Book.find({ author: author.id })
        
        if (books.length > 0) {
            res.redirect(`/authors?error=This author has books still.`)
        } else {
            await Author.deleteOne({ _id: req.params.id }) // Delete author only if no books are related
            res.redirect('/authors')
        }
    } catch (err) {
        res.redirect('/authors')
        console.log(err)
    }
})
module.exports = router