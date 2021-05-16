import React, { useEffect, useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import "./Post.css";
import firebase from 'firebase/app';
import { db } from "./firebase";
function Post({ postId, username,caption, user, imageUrl }) {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");

  useEffect(() => {
    let unsubscribe;
    if (postId) {
      unsubscribe = db
        .collection("posts")
        .doc(postId)
        .collection("comments")
        .orderBy("timestamp", "desc")
        .onSnapshot((snapshot) => {
          setComments(snapshot.docs.map((doc) => doc.data()));
        });
      return () => {
        unsubscribe();
      };
    }
  }, [postId]);
  const postComment = (event) => {
    event.preventDefault();
    db.collection("posts").doc(postId).collection("comments").add({
      text: comment,
      username: user.displayName,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
    setComment("");
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
      <p><strong>{username}</strong>{caption}</p>
      <div className="post_comments">
        {comments.map((comment) => (
          <p>
            <strong>{comment.username}</strong> {comment.text}
          </p>
        ))}
      </div>
      {/* <div>
          <p><strong>{username}</strong>{caption}</p>
      </div> */}
      {user ? (<div>
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
      </div>):(<p>Please login to write comment</p>)}
      
    </div>
  );
}

export default Post;
