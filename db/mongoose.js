const mongoose = require('mongoose');

mongoose
	.connect(process.env.MONGODB_URL, {
		useNewUrlParser: true,
		useCreateIndex: true,
		useUnifiedTopology: true,
		useFindAndModify: false,
	}).then(()=>{
		console.log('Connected to DB, Hooray!!!!!');
	})
	.catch((error) => {
		console.log(error); //in production i will not do it xD
	});

