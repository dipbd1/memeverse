const mongoose = require('mongoose');
const validator = require('validator');

const commentSchema = mongoose.Schema({
	owner: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
	},
	comment: {
		type: String,
		required: true,
	},
});

const postSchema = mongoose.Schema(
	{
		image: {
			type: Buffer,
			required: false,
		},
		description: {
			type: String,
			required: false,
			trim: true,
		},
		owner: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: 'User',
		},
		comments: [commentSchema],
		vote:{
			type: Number,
			default: 0,
		}
	},
	{ timestamps: true },
);

const Comment = mongoose.model('Comment', commentSchema);
const Post = mongoose.model('Post', postSchema);


module.exports = Post, Comment;