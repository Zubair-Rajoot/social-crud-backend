const Post = require('../model/postModel');

exports.createPost = async (req, res) => {
    try {
        const { title, content } = req.body;

        if (!title || !content) {
            return res.status(400).json({ message: "Title and content are required" });
        }

        
        const image = req.file ? req.file.filename : null;

      

        const post = new Post({
            userId: req.user._id,
            title,
            content,
            image,
        });

        await post.save();

        res.status(200).json({
            success: true,
            post
        });

    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server error');
    }
};



exports.getPosts = async (req, res) => {
    try {
        const posts = await Post.find().populate('userId', 'name email');

        res.status(200).json({
            success: true,
            posts
        });

    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server error');
    }
}



exports.updatePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    console.log("post update", post);
    if (!post) {
      return res.status(404).json({ message: 'post not found' });
    }
    res.json({ message: 'post update successfully', post });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};


exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    console.log("post DELETD", post);
    if (!post) {
      return res.status(404).json({ message: 'post not found' });
    }
    res.json({ message: 'post delete successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};



exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('userId', 'name email');
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.json({ post });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
}


exports.searchPosts = async (req, res) => {
  try {
    let { keyword } = req.query;

    if (!keyword || typeof keyword !== 'string') {
      return res.status(400).json({ message: 'Keyword is required and must be a string' });
    }


    keyword = keyword.trim();

    const query = {
      $or: [
        { title: { $regex: keyword, $options: 'i' } },
        { content: { $regex: keyword, $options: 'i' } }
      ]
    };

    const posts = await Post.find(query).populate('userId', 'name email');

    res.status(200).json({
      success: true,
      results: posts.length,
      posts
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};




