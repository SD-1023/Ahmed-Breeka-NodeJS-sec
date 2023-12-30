const express = require('express');
const bodyParser = require('body-parser');
// const { body, validationResult } = require('express-validator');
const joi = require('joi');

const {
    getBooks,
    getBookById,
    addBook
} = require('./booksController');

const app = express();

// PUG
app.set("view engine","pug");
// app.set("views", path.resolve("./views"));
app.set("view cache", false);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


// listen server on port 3000
app.listen(3000,()=>{
    console.log("Express app is listening on the port: 3000!");
});

// Get all books end point
app.get("/",async (req, res)=>{
    try{
        res.render('home');
    }
    catch(err){
        res.render('error',{status: 404, err});
    }
});

// Get all books end point
app.get("/books",async (req, res)=>{
    try{
        let data = await getBooks();
        res.render('books', {books: data});
    }
    catch(err){
        res.render('error',{status: 404, err});
    }
});



// Get book by Id
app.get("/books/:id", async (req, res)=>{

    const schema = joi.object({
        id: joi.number().integer().positive().required()
    });

    try {
        let {value,error}=schema.validate({id:req.params.id})
        
        if (error) {
            res.render('error',{status:400, err: error.details[0].message });
            return;
        }

        let data = await getBookById(value.id)
        res.render('book',{id: data.id, name: data.name});

    } catch (err) {
        res.render('error',{status:404,err})
    }
});

// Add Books
app.post("/books",async (req, res)=>{
    try {

        if (!req.body || !req.body.name) {
            return res.render('error',{status:400, err: 'Name is required in the request body.' });
        }

        let bookName = req.body.name;
        const schema = joi.object({ name: joi.string().required() });

       let {error,value}=schema.validate({name:bookName});

        if (error){
            return res.render('error',{status:400,err: error.details[0].message});
        } 
            
        let book= await addBook(value.name);
        let process = 'success';
        res.send({process, book});

    } catch (err) {
        res.render('error',{status:500, err});
    }
});

// Page Not fount
app.use(( req, res) => {
    let err = new Error('Page not fount !');;
    res.render('error',{status:404,err});

});