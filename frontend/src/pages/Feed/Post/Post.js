import React, { useState, useEffect } from 'react';
import { Avatar } from '@mui/material';
import VerifiedIcon from '@mui/icons-material/Verified';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import RepeatIcon from '@mui/icons-material/Repeat';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PublishIcon from '@mui/icons-material/Publish';
import axios from 'axios';
import './Post.css';
import { useUserAuth } from '../../../context/UserAuthContext';

const Post = ({ p }) => {
  const { _id, name, username, photo, post, profilePhoto } = p;
  const { user } = useUserAuth();
  const loggedInUser = user ? user : null;
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [commentBoxVisible, setCommentBoxVisible] = useState(false);

  useEffect(() => {
    const fetchPostStats = async () => {
      try {
        const response = await axios.get(`https://twitter-clone2-0-hfe5.onrender.com/post/${_id}/stats`, {
          params: { userId: loggedInUser ? loggedInUser._id : null }
        });
        setLikes(response.data.likes);
        setComments(Array.isArray(response.data.comments) ? response.data.comments.reverse() : []);
        setLiked(response.data.userHasLiked || false);
      } catch (error) {
        console.error('Error fetching post stats:', error);
      }
    };
    fetchPostStats();
  }, [_id, loggedInUser]);

  const handleLike = async () => {
    try {
      if (!loggedInUser) return;
      const userId = loggedInUser._id;
      if (liked) {
        setLikes((prev) => prev - 1);
      } else {
        setLikes((prev) => prev + 1);
      }
      setLiked(!liked);
    } catch (error) {
      console.error('Error liking/unliking post:', error);
    }
  };

  const handleComment = async () => {
    if (!loggedInUser) return;
    if (commentText.trim()) {
      try {
        const newComment = { postId: _id, userId: loggedInUser._id, comment: commentText };
        const response = await axios.post('https://twitter-clone2-0-hfe5.onrender.com/comment', newComment);
        setComments((prevComments) => [...prevComments, response.data.comment]);
        setCommentText('');
      } catch (error) {
        console.error('Error adding comment:', error);
      }
    }
  };

  return (
    <div className='post'>
      <div className='post_avatar'>
        <Avatar src={profilePhoto} />
      </div>
      <div className='post_body'>
        <div className='post_header'>
          <div className='post_headerText'>
            <h3>
              {name}{' '}
              <span className='post_headerSpecial'>
                <VerifiedIcon className='post_badge' /> @{username}
              </span>
            </h3>
          </div>
          <div className='post_headerDescription'>
            <p>{post}</p>
          </div>
          {photo && <img src={photo} alt='' width='500' />}
          <div className='post_footer'>
            <ChatBubbleOutlineIcon
              className='post_footer_icon'
              fontSize='small'
              onClick={() => setCommentBoxVisible(!commentBoxVisible)}
            />
            <span style={{ marginLeft: '5px' }}>{comments.length}</span>
            <RepeatIcon className='post_footer_icon' fontSize='small' />
            {liked ? (
              <FavoriteIcon className='post_footer_icon liked' fontSize='small' onClick={handleLike} />
            ) : (
              <FavoriteBorderIcon className='post_footer_icon' fontSize='small' onClick={handleLike} />
            )}
            <span style={{ marginLeft: '5px' }}>{likes}</span>
            <PublishIcon className='post_footer_icon' fontSize='small' />
          </div>
          {commentBoxVisible && (
            <div className='comment_box visible'>
              <input
                type='text'
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder='Write a comment...'
              />
              <button onClick={handleComment}>Comment</button>
            </div>
          )}
        </div>
        {commentBoxVisible && (
          <div className='comments_section'>
            {comments.map((comment, index) => (
              <div key={index} className='comment'>
                <p><b>{comment.userName}</b>: {comment.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Post;
