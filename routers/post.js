const express = require('express');
const Post = require('.././models/post');
const router = new express.Router();
const auth = require('.././middleware/auth');

// this modules will be used for image processing before save
const multer = require('multer');
const sharp = require('sharp');

const upload = multer({
	limits: {
		fileSize: 1024 * 1024 * 5, // this is the max file limit which is now 5 mb
	},
	fileFilter(req, file, cb) {
		if (!file.originalname.match(/\.(img|jpg|jpeg|png)$/)) {
			cb(new Error('Please upload a Image file'));
		}
		cb(undefined, true);
	},
});

//Post Method to creat a single post
router.post('/posts', auth, upload.single('image'), async (req, res) => {
	const post = new Post({
		description: req.body.description,
		owner: req.user._id,
		image: req.file.buffer,
	});
	try {
		await post.save();
		res.status(201).send(post);
	} catch (e) {
		console.log(e);
		res.status(400).send(e);
	}
});

// controller to read a post by id
router.get('/posts/:id', auth, async (req, res) => {
	const _id = req.params.id;
	try {
		// const post = await Post.findById(_id)
		const post = await Post.findOne({ _id, owner: req.user._id });
		if (!post) {
			return res.status(404).send();
		}
		res.send(post);
	} catch (e) {
		if (e.name === 'CastError') {
			return res.status(404).send();
		}
		res.status(500).send(e);
	}
});

// route see a posts image only
router.get('/posts/:id/image', async (req, res) => {
	const _id = req.params.id;

	try {
		const post = await Post.findById(_id);
		if (!post || !post.image) {
			throw new Error();
		}
		res.set('Content-Type', 'image/png');
		res.send(post.image);
	} catch (e) {
		res.status(404).send();
	}
});

//GET /posts?sortBy=createdAt
//GET /posts?limit
//GET /posts?completed=true
//Get method to read all Task
// to see all the posts at once
router.get('/posts', auth, async (req, res) => {
	const _id = req.user._id;

	const match = {};
	const sort = {};

	if (req.query.sortBy) {
		const parts = req.query.sortBy.split(':');
		sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
	}
	try {
		// const posts = await Post.find({owner: req.user._id}) this thing also works
		await req.user
			.populate({
				path: 'memes',
				match,
				options: {
					limit: parseInt(req.query.limit),
					skip: parseInt(req.query.skip),
					sort,
				},
			})
			.execPopulate();
		let postList = req.user.memes.map((post1) => {
			let post2 = post1.toObject();
			delete post2.image;
			console.log(post2.image);
			return post2;
		});
		res.send(postList);
	} catch (e) {
		res.send(e);
	}
});
// this is the like/vote system
// you can make a lot of votes by one user
// but with time i can make it posssible that obe user will be able to vote once
// will be handled by query params
router.patch('/posts/vote/:id', auth, async (req, res) => {
	const _id = req.params.id;

	const post = await Post.findById(_id);
	if (!post) {
		res.send('Post not Found').status(404);
	}
	if (req.query.upvote == 1) {
		post.vote++;
		post.save();
		res.send(post).status(200);
	} else if (req.query.downvote == 1) {
		post.vote--;
		post.save();
		res.send(post).status(200);
	} else {
		res.send('Please input Query').status(400);
	}
});

// Route to delete a post by id
router.delete('/posts/:id', auth, async (req, res) => {
	const _id = req.params.id;
	try {
		const post = await Post.findOneAndDelete({ _id, owner: req.user._id });
		if (!post) {
			return res.status(404).send('task not found');
		}
		res.send(post);
	} catch (e) {
		res.status(500).send(e);
	}
});

// Route to add a comments
// paload contains 'comment' named data
router.patch('/posts/comment/:id', auth, async (req, res) => {
	const _id = req.params.id;
	const post = await Post.findById(_id);
	try {
		if (!post) {
			res.send('Post Not Found').status(404);
		}
		post.comments.push({ owner: req.user._id, comment: req.body.comment });
		await post.save();
		res.send(post).status(200);
	} catch (error) {
		res.send(error).status(404);
	}
});

module.exports = router;
