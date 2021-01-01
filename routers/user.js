const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const User = require('../models/user');
const auth = require('../middleware/auth.js');
const router = new express.Router();

//To Create a user  ---SIGN UP----
// Payload will be like model, required fields will be mandatory
router.post('/users', async (req, res) => {
	const user = User(req.body);
	try {
		await user.save();
		const token = await user.generateAuthToken();
		res.status(201).send({ user, token });
	} catch (e) {
		res.status(400).send(e);
	}
});

// -----LOG IN ----
// with email, password
router.post('/users/login', async (req, res) => {
	try {
		const user = await User.findByCredentials(req.body.email, req.body.password);
		const token = await user.generateAuthToken();
		res.send({ user, token });
	} catch (e) {
		res.status(404).send(e.toString());
	}
});

// LOG OUT
// its a session log-out
router.post('/users/logout', auth, async (req, res) => {
	try {
		req.user.tokens = req.user.tokens.filter((token) => {
			return token.token !== req.token;
		});
		await req.user.save();
		res.send();
	} catch (e) {
		res.status(500).send(e);
	}
});

//LOG OUT of All Device
// it will clear the array of tokens in DB
router.post('/users/logoutAll', auth, async (req, res) => {
	try {
		req.user.tokens = [];
		await req.user.save();
		res.send();
	} catch (e) {
		res.status(500).send();
	}
});

//Get Method to Search a User
// If you are logged in, you can serach for other user
router.get('/users/me', auth, async (req, res) => {
	res.send(req.user);
});

//Get method to search single User
// router.get('/users/:id', async (req, res) => {
//     const _id = req.params.id
//     try {
//         const user = await User.findById(_id)
//         if (!user) {
//             return res.status(404).send()
//         }
//         res.send(user)
//     } catch (e) {
//         if (e.name === "CastError") {
//             return res.status(404).send(e)
//         }
//         res.status(500).send(e)
//     }
// })

// To Update a user
// few fields can be updated, even you can update password.
router.patch('/users/me', auth, async (req, res) => {
	const updates = Object.keys(req.body);
	const allowedUpdates = ['name', 'email', 'password', 'age'];
	const isValidOperation = updates.every((update) => allowedUpdates.includes(update));
	if (!isValidOperation) {
		return res.status(400).send({
			error: 'invalid updates!',
		});
	}
	try {
		updates.forEach((update) => (req.user[update] = req.body[update]));
		await req.user.save();
		res.send(req.user);
	} catch (e) {
		res.status(400).send(e);
	}
});

//to Delete a uses
// this delete will also delete all the meme/posts made by himself
router.delete('/users/me', auth, async (req, res) => {
	try {
		// const user = await User.findByIdAndDelete(req.use._id)
		// if (!user) {
		//     return res.status(400).send("User Not Found")
		// }
		await req.user.remove();
		res.send(req.user);
	} catch (e) {
		res.status(500).send(e);
	}
});

// multer part for uploading user image/avatar

const upload = multer({
	limits: {
		fileSize: 1000000,
	},
	fileFilter(req, file, cb) {
		if (!file.originalname.match(/\.(img|jpg|jpeg|png)$/)) {
			cb(new Error('Please upload a Image file'));
		}
		cb(undefined, true);
	},
});
// route to upload a image for user
router.post(
	'/users/me/avatar',
	auth,
	upload.single('avatar'),
	async (req, res) => {
		const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer();
		req.user.avatar = buffer;
		await req.user.save();
		res.send();
	},
	(error, req, res, next) => {
		res.status(400).send({ error: error.message });
	},
);

//route to delete a users image
router.delete('/users/me/avatar', auth, async (req, res) => {
	req.user.avatar = undefined;
	await req.user.save();
	res.send();
});


// route to see a users image/avatar
router.get('/users/:id/avatar', async (req, res) => {
	const _id = req.params.id;

	try {
		const user = await User.findById(_id);
		if (!user || !user.avatar) {
			throw new Error();
		}
		res.set('Content-Type', 'image/png');
		res.send(user.avatar);
	} catch (e) {
		res.status(404).send();
	}
});

module.exports = router;
