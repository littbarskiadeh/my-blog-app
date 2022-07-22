// npx babel-node src/server.js
// npx nodemon --exec npx babel-node src/server.js
import express from 'express';
// import bodyParser to work with req.body in app routes
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import Article from '../model/Article';
import path from 'path';
const cors = require('cors');

const connectionString = "mongodb+srv://admin:admin@cluster0.8swg5.mongodb.net/myblog?retryWrites=true&w=majority";

mongoose
    .connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
    .then(() => { console.log("Mongoose connected successfully "); },
        error => { console.log("Mongoose could not connect to database: " + error) });

const app = express();

app.use(cors())
// path to serve static content : added after deployment of React App to production build
app.use(express.static(path.join(__dirname, '/build')))

// use body parser for json object
app.use(bodyParser.json());


// http://localhost:8080/api/articles/learn-node
app.get('/api/articles/:name', async (req, res) => {
    try {
        const articleName = req.params.name;

        // get article from db
        const article = await Article.findOne({ name: articleName });

        if (!article) return res.status(400).send('article not found!');

        res.status(200).json(article);
    }
    catch (err) {
        res.status(500).json({ message: "Error connecting to db", err });
    }

})

// Routes

// All articles: http://localhost:8080/api/articles
app.get('/api/articles/', async (req, res) => {
    try {
        const articles = await Article.find({})
        if (!articles) return res.status(400).send(`No article found with name - ${articleName}`);

        res.status(200).json(articles);
    }
    catch (err) {
        res.status(500).json({ message: "Error connecting to db", err });
    }
})

// Upvote an article: http://localhost:8080/api/articles/learn-node/upvote
app.post('/api/articles/:name/upvote', async (req, res) => {
    try {
        const articleName = req.params.name;

        const articleInfo = await Article.findOne({ name: articleName })
        if (!articleInfo) return res.status(400).send(`No article found with name - ${articleName}`);

        const article = await Article.findOneAndUpdate({ name: articleName }, { $set: { upvotes: articleInfo.upvotes + 1 } }, { new: true })

        console.log(`upvote() called on ${articleName} article, upvote: ${article.upvotes}`);

        res.status(200).json(article);
    }
    catch (err) {
        res.status(500).json({ message: "Error connecting to db", err });
    }

})

// Downvote an article: http://localhost:8080/api/articles/my-thoughts-on-resumes/downvote
app.post('/api/articles/:name/downvote', async (req, res) => {
    try {
        const articleName = req.params.name;
        const articleInfo = await Article.findOne({ name: articleName })
        if (!articleInfo) return res.status(400).send(`No article found with name - ${articleName}`);

        const article = await Article.findOneAndUpdate({ name: articleName }, { $set: { downvotes: articleInfo.downvotes + 1 } }, { new: true })
        console.log(`downvote() called on ${articleName} article, down: ${article.downvotes}`);

        res.status(200).json(article);
    }
    catch (err) {
        res.status(500).json({ message: "Error connecting to db", err });
    }
})

// Comment on an article: http://localhost:8080/api/articles/my-thoughts-on-resumes/add-comment
app.post('/api/articles/:name/add-comment', async (req, res) => {
    const { username, text } = req.body;
    const articleName = req.params.name;

    const articleInfo = await Article.findOne({ name: articleName });

    const article = await Article.findOneAndUpdate({ name: articleName }, { $set: { comments: articleInfo.comments.concat({ username, text }) } }, { new: true })

    console.log('article comments updated: \n\n', article)

    res.status(200).json(article)
})

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/build/index.html'));
});

app.listen(8080, () => console.log("listening on port 8080"));