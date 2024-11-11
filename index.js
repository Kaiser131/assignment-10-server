const express = require('express');
const app = express();
const port = process.env.PORT || 5000;

const article = require('./article.json');


const cors = require('cors');

// middleware
app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
    res.send('server running');
});

app.get('/article', (req, res) => {
    res.send(article);
});



app.listen(port, () => {
    console.log(`assignment-10 servever is running on ${port}`);
});
