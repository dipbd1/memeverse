const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Post = require('./post');

const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
			trim: true,
			lowercase: true,
			validate(value) {
				if (!validator.isEmail(value)) {
					throw new Error('Email is invalid');
				}
			},
		},
		age: {
			type: Number,
			default: 0,
			validate(value) {
				if (value < 0) {
					throw new Error('Age must  be a positive Number');
				}
			},
		},
		password: {
			type: String,
			required: true,
			minlength: 7,
			trim: true,
			validate(value) {
				if (value.toLowerCase().includes('password')) {
					throw new Error('Pass includes Password');
				}
			},
		},
		tokens: [
			{
				token: {
					type: String,
					required: true,
				},
			},
		],
		avatar: {
			type: Buffer,
		},
	},
	{ timestamps: true },
);

// if you want to get all the memes of a user,
// you can use this virtual
userSchema.virtual('memes', {
	ref: 'Post',
	localField: '_id',
	foreignField: 'owner',
});


//method to generate token and save into db at once
userSchema.methods.generateAuthToken = async function () {
	const user = this;
	const token = jwt.sign(
		{
			_id: user._id.toString(),
		},
		process.env.JWT_SECRET,
	);
	user.tokens = user.tokens.concat({ token });
	await user.save();
	return token;
};

//before sending user data to user, we have to delete this fields for their own security
userSchema.methods.toJSON = function () {
	const user = this;
	const userObject = user.toObject();

	delete userObject.password;
	delete userObject.tokens;
	delete userObject.avatar;

	return userObject;
};

//some time we might need t o find user, then why not make
// a  static method?
userSchema.statics.findByCredentials = async (email, password) => {
	const user = await User.findOne({
		email,
	});
	if (!user) {
		throw new Error('Unable to login');
	}
	const isMatch = await bcrypt.compare(password, user.password);
	if (!isMatch) {
		throw new Error('Unable to login');
	}
	return user;
};

//Hash the plain text password
// you dont want this as plain text in db
userSchema.pre('save', async function (next) {
	const user = this;
	if (user.isModified('password')) {
		user.password = await bcrypt.hash(user.password, 8);
	}
	next();
});

//Delete User Posts when user is removes
userSchema.pre('remove', async function (next) {
	const user = this;
	await Post.deleteMany({ owner: user._id });
	next();
});

const User = mongoose.model('User', userSchema); //registering the schema

module.exports = User;
