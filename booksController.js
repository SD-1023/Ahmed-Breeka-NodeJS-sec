const fs = require('fs/promises')

// Get All Books from library (books.json)
async function getBooks(filePath) {
    try {
        const file = (await fs.readFile(filePath = 'books.json', 'utf8')).trim();
        
        if (!file) {
            throw new Error('Library is empty.');
        }

        let books=JSON.parse(file)
        
        if (!books || books.length === 0) {
            throw new Error('Library does not contain any book');
        }
        
        return books;
    } catch (error) {
        
        if (error.code === 'ENOENT') {
            throw new Error('Library does not exist');
        }
        
        throw new Error(`Error (controller_001): ${error.message}`);
    }
}

// Get Book By Id 
async function getBookById(reqId) {
    try {
        
        const books = await getBooks('books.json');
        const book = books.filter(book => book.id === reqId);

        if (book.length === 0) {
            throw new Error('Book ID not found');
        }

        return book[0];

    } catch (error) {
        throw new Error(`Error (controller_002): ${error.message}`);
    }
}

// Add New Book
async function addBook(name) {
    try {
        let books
        
        try {

            books =JSON.parse(await fs.readFile('books.json', 'utf8'));
        
        } catch (readError) {
            
            if (readError.code === 'ENOENT') {
                books = [];
            } else {
                throw new Error(`Error reading books.json: ${readError.message}`);
            }

        }

        const bookSelected = books.filter(book => book.name === name);
        
        if (bookSelected.length > 0) {
            throw new Error('Book exists in the library');
        }

        const newBook = { id: books.length + 1, name: name };
        books.push(newBook);
        await fs.writeFile('books.json', JSON.stringify(books), 'utf8');
        
        return newBook;

    } catch (error) {
        throw new Error(`Error (controller_003): ${error.message}`);
    }
}

module.exports = {
    getBooks,
    getBookById,
    addBook
};