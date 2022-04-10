const express = require("express");
const Blog = require('./api/models/blogs')
const BlogData = new Blog();
const cors = require('cors');

const multer = require('multer');
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './assets')
    },
    filename: (req, file, cb) => {
        cb(null, `${file.fieldname}-${Date.now()}${imageExt(file.mimetype)}`) 
    }
})
var destination = multer({storage: storage})

const imageExt = (mimeType) => {
    switch(mimeType){
        case "image/png":
            return ".png"
        case "image/jpg":
            return ".jpg"
        case "image/jpeg":
            return ".jpeg"
        case "image/webp":
            return ".webp"
        default:
            return ".jpg"
    }
}

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const urlParser = bodyParser.urlencoded({extended: false});

const app = express();

const PORT = process.env.PORT || 3000;
const corsOpts = {
    origin: '*',
    methods: [
        'GET',
        'POST',
    ],
    allowedHeaders: [
        'Content-Type',
    ],
};

app.use(cors(corsOpts));
app.use('/assets', express.static('assets'))

app.get('/life', (req, res) => {
    res.status(200).send('Hey Bloggers!')
})

app.get('/api/blogs', (req, res) => {
    res.status(200) ? res.send(BlogData.getAll()) : res.send('Some Error occured')
})

app.get('/api/blogs/:id', (req, res) => {
    const BlogId = req.params.id;
    const blog = BlogData.getBlog(BlogId);
    
    blog ? res.status(200).send(BlogData.getBlog(BlogId)) : res.status(404).send('No such blog there')
})

app.post('/api/blog/create', destination.single("post_image"), jsonParser, (req, res) => {
    const newBlog = {
        "id" : `${Date.now()}`,
        "title": req.body.title,
        "content": req.body.content,
        "post_image": `assets/${req.file.filename}`,
        "added_date": req.body.added_date,
    }
    BlogData.addBlog(newBlog);
    res.status(201).send("Succesfuly Created");
})

app.listen(PORT, () => console.log(`Server is running in port ${PORT}`));