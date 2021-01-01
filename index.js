console.log("initiating Server...");
require('./utils/memeverse').art();
require('dotenv').config()
require('./db/mongoose');  //the .env thing
const express = require('express')
var cors = require('cors')

const userRouter = require('./routers/user');
const postRouter = require('./routers/post')

const app = express()  //express instance of server
const port = process.env.PORT || 3000 //If we use any service like heroku we need to use this type of port normalization

app.use(cors()) // for better  cross domain request :D

// this part is used to serve the home file
app.use(express.static(__dirname+ '/public'))
app.get('/', (req, res) => {
    res.send();
});
// and it ends here. As we will work with json, better leave it here.
app.use(express.json())
app.use(userRouter);
app.use(postRouter);



app.listen(port,()=>{
	console.log("Server started on: "+port);
})