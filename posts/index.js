const express = require ('express');
const bodyParser = require('body-parser');
const { randomBytes } = require ('crypto');
const cors = require ('cors');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());
app.use(cors());


const posts = {};

app.get('/posts', (req,res) => {
    res.send(posts);
});

app.post('/posts', async(req, res) => {
    try {
        const id = randomBytes(4).toString('hex');
        const { title } = req.body;

        posts[id] = {
            id,
            title
        };

        // Send event to event bus
        await axios.post('http://localhost:4005/events', {
            type: 'PostCreated',
            data: { id, title }
        })
        console.log("New post created:", posts[id]);
        res.status(201).send(posts[id]);
    } catch (error) {
        console.error("Error creating post:", error);
        res.status(500).send({ error: "An error occurred while creating the post." });
    }
});

app.post('/events', (req,res) => {
    console.log('Event received', req.body.type);
    res.send({});
});

app.listen(4000, () => {
    console.log('Listening on 4000');
});