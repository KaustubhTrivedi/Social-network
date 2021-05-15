import React, { useEffect, useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import "./Post.css";
import { db } from "./firebase";
function Post({ postId, username, caption, imageUrl }) {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState('');

  useEffect(() => {
    let unsubscribe;
    if (postId) {
      unsubscribe = db
        .collection("posts")
        .doc(postId)
        .collection("comments")
        .onSnapshot((snapshot) => {
          setComments(snapshot.docs.map((doc) => doc.data()));
        });
      return () => {
        unsubscribe();
      };
    }
  }, [postId]);
  const postComment = (event) => {

  };
  return (
    <div className="post">
      <div className="post__header">
        <Avatar
          className="post__avatar"
          src="/assets/images/avatar.jpg"
          alt={username}
        />
        <h3 className="post__username">{username}</h3>
      </div>
      {/* header ends  */}
      <img className="post__image" src={imageUrl} alt="userImage"></img>
      {/* image  */}
      {/* likes bar */}
      <div className="post_comments">
        {comments.map((comment) => {
          <p>
            <strong>{comment.username}</strong> {comment.text}
          </p>
        })}
      </div>
      <div>
          <p><strong>{username}</strong>{caption}</p>
      </div>
      <form className="post__commentBox">
        <input
          className="post__input"
          type="text"
          placeholder="Add a comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        ></input>
        <button
          className="post__button"
          disabled={!comment}
          type="submit"
          onClick={postComment}
        >
          Post
        </button>
      </form>
    </div>
  );
}

export default Post;
