const Post = require('../model/post');
const fs = require('fs');
const path = require('path');

// Create a new post with optional image upload
exports.createPost = async (req, res) => {
  try {
    const { title, content } = req.body;
    const userId = req.user.id;

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const postData = {
      userId,
      title,
      content
    };

    // If an image was uploaded, add the image path to the post data
    if (req.file) {
      postData.image = req.file.filename;
    }

    const post = new Post(postData);
    await post.save();

    res.status(201).json({
      message: 'Post created successfully',
      post
    });
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ message: 'Error creating post' });
  }
};

// Get all posts
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 }).populate('userId', 'name profileImage');
    res.status(200).json(posts);
  } catch (error) {
    console.error('Get all posts error:', error);
    res.status(500).json({ message: 'Error retrieving posts' });
  }
};

// Get a single post by ID
exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId).populate('userId', 'name profileImage');
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    res.status(200).json(post);
  } catch (error) {
    console.error('Get post by ID error:', error);
    res.status(500).json({ message: 'Error retrieving post' });
  }
};

// Get posts by user ID
exports.getPostsByUser = async (req, res) => {
  try {
    const userId = req.params.userId || req.user.id;
    
    const posts = await Post.find({ userId }).sort({ createdAt: -1 }).populate('userId', 'name profileImage');
    
    res.status(200).json(posts);
  } catch (error) {
    console.error('Get posts by user error:', error);
    res.status(500).json({ message: 'Error retrieving user posts' });
  }
};

// Update a post
exports.updatePost = async (req, res) => {
  try {
    const { title, content } = req.body;
    const postId = req.params.postId;
    
    const post = await Post.findById(postId);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    // Check if the user is the owner of the post
    if (post.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this post' });
    }
    
    // Update post data
    post.title = title || post.title;
    post.content = content || post.content;
    
    // If a new image is uploaded, update the image and delete the old one
    if (req.file) {
      // Delete old image if it exists
      if (post.image) {
        const oldImagePath = path.join(__dirname, '../uploads/posts', post.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      
      post.image = req.file.filename;
    }
    
    await post.save();
    
    res.status(200).json({
      message: 'Post updated successfully',
      post
    });
  } catch (error) {
    console.error('Update post error:', error);
    res.status(500).json({ message: 'Error updating post' });
  }
};

// Delete a post
exports.deletePost = async (req, res) => {
  try {
    const postId = req.params.postId;
    
    const post = await Post.findById(postId);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    // Check if the user is the owner of the post
    if (post.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this post' });
    }
    
    // Delete the image file if it exists
    if (post.image) {
      const imagePath = path.join(__dirname, '../uploads/posts', post.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    
    await Post.findByIdAndDelete(postId);
    
    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({ message: 'Error deleting post' });
  }
};