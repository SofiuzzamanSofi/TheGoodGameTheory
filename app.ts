import express from 'express';
import mongoose from 'mongoose';

const app = express();
const port = process.env.PORT || 3000;

// Connect to your MongoDB database
mongoose.connect('mongodb://localhost/bookstore', { useNewUrlParser: true, useUnifiedTopology: true });

// Define a Book model (schema) and create a collection
const Book = mongoose.model('Book', new mongoose.Schema({
  title: String,
  author: String,
  publicationYear: Number,
}));

app.use(express.json());

// Route for retrieving all books
app.get('/books', async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route for adding a new book
app.post('/books', async (req, res) => {
  const { title, author, publicationYear } = req.body;
  const book = new Book({ title, author, publicationYear });
  try {
    await book.save();
    res.json(book);
  } catch (error) {
    res.status(400).json({ error: 'Invalid Data' });
  }
});

// Route for updating an existing book
app.put('/books/:id', async (req, res) => {
  const { id } = req.params;
  const { title, author, publicationYear } = req.body;
  try {
    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }
    book.title = title || book.title;
    book.author = author || book.author;
    book.publicationYear = publicationYear || book.publicationYear;
    await book.save();
    res.json(book);
  } catch (error) {
    res.status(400).json({ error: 'Invalid Data' });
  }
});

// Route for removing a book
app.delete('/books/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }
    await book.remove();
    res.json({ message: 'Book deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
