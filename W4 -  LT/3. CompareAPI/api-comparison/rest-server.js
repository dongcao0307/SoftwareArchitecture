const express = require('express');
const books = require('./data');
const app = express();

app.get('/books/:id', (req, res) => {
    const book = books.find(b => b.id === req.params.id);
    // REST luôn trả về toàn bộ Object (Fixed Payload)
    res.json(book); 
});

app.listen(3000, () => console.log('✅ REST Server: http://localhost:3000/books/1'));