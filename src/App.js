import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import { Button, Input } from "@material-ui/core";
import { auth, db } from "./firebase";
import "./App.css";
import Post from "./Post";
import ImageUpload from "./ImageUpload";

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}


const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    outline: 0,
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  //user Authentication states
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [posts, setPosts] = useState([]);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [user, setUser] = useState(null);
  //---------------------------//

  useEffect(()=> {
    document.title="Instagram"
  },[])
  //user authentication starts
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        // user logged in
        console.log(authUser);
        setUser(authUser);
      } else {
        //user logged out
        setUser(null);
      }
    });
    return () => {
      unsubscribe();
    };
  }, [user, username]);
  //firebase data fetch
  useEffect(() => {
    db.collection("posts")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        setPosts(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            post: doc.data(),
          }))
        );
      });
  }, []);
  const signUp = (event) => {
    event.preventDefault();

    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName: username,
        });
      })
      .catch((error) => alert(error.message));
  };

  const signIn = (event) => {
    event.preventDefault();
    auth
      .signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message));
    setOpen(false);
  };

  const signOut = (event) => {
    event.preventDefault();
    auth.signOut();
    setUser(null);
  };
  //open Modal
  const handleOpen = () => {
    setOpen(true);
  };
  //close Modal
  const handleClose = () => {
    setOpen(false);
  };
  const handleOpenSignIn = () => {
    setOpenSignIn(true);
  };
  //close Modal
  const handleCloseSignIn = () => {
    setOpenSignIn(false);
  };

  //User Authentication Ends

  //Storing Posts

  return (
    <div className="App">
      <div className="app__header app__logoHeader">
        <img
          className="app_headerImage"
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
          alt="headerImage"
          x
        />

        {user ? (
          <Button onClick={signOut}>Logut</Button>
        ) : (
          <div>
            <Button onClick={handleOpenSignIn}>Sign In</Button>
            <Button onClick={handleOpen}>Sign Up</Button>
          </div>
        )}
      </div>

      <div className="app__posts">
        <div className="app_postsLeft">
          {posts.map(({ id, post }) => (
            <Post
              key={id}
              postId={id}
              username={post.username}
              caption={post.caption}
              imageUrl={post.imageUrl}
            />
          ))}
        </div>
        {/* <div className="app__postsRight">
          <InstagramEmbed
            url="https://www.instagram.com/p/CO1fxbaJK4o/"
            maxWidth={320}
            clientAccessToken="123|456"
            hideCaption={false}
            containerTagName="div"
            protocol=""
            injectScript
            onLoading={() => {}}
            onSuccess={() => {}}
            onAfterRender={() => {}}
            onFailure={() => {}}
          />
        </div> */}
      </div>
      {/* header ends here */}

      {/* signup Modal */}
      <Modal className="modal" open={open} onClose={handleClose}>
        <div style={modalStyle} className={classes.paper}>
          <center>
            <img
              className="app__headerImage"
              src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
              alt="Instagram Logo"
            ></img>
            <form className="app__signup">
              <Input
                placeholder="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              ></Input>
              <Input
                placeholder="email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              ></Input>
              <Input
                placeholder="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              ></Input>
              <Button type="submit" onClick={signUp}>
                Sign Up
              </Button>
            </form>
          </center>
        </div>
      </Modal>
      {/* signIn Modal */}
      <Modal className="modal" open={openSignIn} onClose={handleCloseSignIn}>
        <div style={modalStyle} className={classes.paper}>
          <center>
            <img
              className="app__headerImage"
              src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
              alt="Instagram Logo"
            ></img>
            <form className="app__signup">
              <Input
                placeholder="email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              ></Input>
              <Input
                placeholder="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              ></Input>
              <Button type="submit" onClick={signIn}>
                Sign In
              </Button>
            </form>
          </center>
        </div>
      </Modal>
      <div className="app__imageUpload">
        {user ? (
          <ImageUpload username={user.displayName} />
        ) : (
          <h3>You need to login to upload</h3>
        )}
      </div>
    </div>
  );
}

export default App;
