import './App.css';
import React from 'react';
import axios from "axios";
import{Typography, Toolbar, TextField, Button as MuiButton,AppBar } from '@mui/material';
import 'antd/dist/reset.css';
import { Table, Button as AntDButton} from 'antd';

function App() {
  const [books,setBooks] = React.useState([]);
  React.useEffect(() =>{
    axios.get("http://localhost:9999/book")
    .then(response =>{
      setBooks(response.data);
    }).catch(error =>{
      const book = {
        _id: (books.length + 1).toString(),
        name: 'Default Book',
        author: 'Default Author',
        price: 0,
        stock: 0
      }
      setBooks([book]);
    });
  }, [books.length]);

  const onSubmit = async (e) =>{
    e.preventDefault();

    const book = {
      name: e.target.name.value,
      author: e.target.author.value,
      price: parseInt(e.target.price.value),
      stock: parseInt(e.target.stock.value)
    }
    axios.post("http://localhost:9999/book",book)
    .then(async res =>{
      const books = await axios.get("http://localhost:9999/book");
      setBooks(books.data);
    }).catch(err =>{
      book._id = (books.length + 1).toString();
      const tempBooks = [...books, book];
      setBooks(tempBooks);
    }).finally(() =>{
      e.target.name.value = '';
      e.target.author.value = '';
      e.target.price.value = '';
      e.target.stock.value = '';
    });
  }
  const deleteBook = async (id) =>{
    axios.delete(`http://localhost:9999/book/${id}`)
    .then(async res =>{
      const books = await axios.get("http://localhost:9999/book");
      setBooks(books.data);
    }).catch(error =>{
      const tempBooks = books.filter(book => book._id !== id);
      setBooks(tempBooks);
    });
  }
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Author',
      dataIndex: 'author',
      key: 'author',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: 'Stock',
      dataIndex: 'stock',
      key: 'stock',
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <AntDButton color='primary' onClick={() => deleteBook(record._id)}>Delete</AntDButton>
      ),
    }];
    const customStyle = { margin: "5px", marginTop: "10px", marginBottom: "10px", width: "100%", height: "50px", borderRadius: "5px", fontSize: "16px" }
  return (
    <div className="App">
      <AppBar>
        <Toolbar>
          <Typography variant="h6" color="inherit">
            CRUD of Books
          </Typography>
        </Toolbar>
      </AppBar>
      <div style={{ marginTop: '90px' }} />

      <Typography variant="h5" color="primary">Add Book</Typography>
      <form onSubmit={onSubmit}>
        <TextField
          style={customStyle}
          type="text"
          label="Name"
          variant="outlined"
          name="name"
          required
        />
        <TextField
          style={customStyle}
          type="text"
          label="Author"
          variant="outlined"
          name="author"
          required
        />
        <TextField
          style={customStyle}
          type="number"
          inputProps={{ min: 0 }}
          label="Price"
          variant="outlined"
          name="price"
          required
        />
        <TextField
          style={customStyle}
          type="number"
          inputProps={{ min: 0 }}
          label="Stock"
          variant="outlined"
          name="stock"
          required
        />
        <MuiButton style={customStyle} variant="contained" color="primary" type='submit'>
          save
        </MuiButton>
      </form>

      <Typography variant="h5" color="primary">Books</Typography>
      <Table columns={columns} dataSource={books} />
    </div>
  );
}

export default App;
