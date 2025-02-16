import React, { useState, useEffect } from "react";
import { auth, provider, db, setDoc, doc, collection, query, where, getDocs } from "./firebase"; // Correct imports
import { signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { onAuthStateChanged } from "firebase/auth"; // Import the missing function
import "./CssFiles/UserEntry.css"; // Import the external CSS file
import TheCreature from "./Assets/PDTheCreature.png";

const UserEntry = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [username, setUsername] = useState("");
  const [usernameAvailable, setUsernameAvailable] = useState(true);
  const [isUsernameSet, setIsUsernameSet] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [dateTime, setDateTime] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const options = { weekday: "long", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" };
      setDateTime(now.toLocaleString("en-GB", options));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        checkUsername(currentUser.uid);
      } else {
        setUser(null);
        setIsUsernameSet(false);
        setIsLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const checkUsername = async (uid) => {
    const usernameRef = collection(db, "Players");
    const q = query(usernameRef, where("uid", "==", uid));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      setIsUsernameSet(true);
      setUsername(querySnapshot.docs[0].data().username);
    } else {
      setIsUsernameSet(false);
    }
    setIsLoading(false);
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      alert("Google login successful!");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handleUsernameSubmit = async (e) => {
    e.preventDefault();
    const usernameRef = collection(db, "Players");
    const q = query(usernameRef, where("username", "==", username));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      await setDoc(doc(db, "Players", username), {
        uid: user.uid,
        username: username,
        money: 1000
      });
      setIsUsernameSet(true);
      navigate("/GameSelection", { state: { username, money: 1000 } });
    } else {
      setUsernameAvailable(false);
    }
  };

  const handleGoToGameSelection = () => {
    if (isUsernameSet) {
      navigate("/GameSelection", { state: { username, money: 1000 } });
    } else {
      alert("You need to set a username first!");
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <>
      <Helmet>
        <title>User Entry</title>
      </Helmet>
      <div className="UE-Container">
        <div className="date-time-display top-left">{dateTime}</div>
        <div className="content-wrapper">
          <img src={TheCreature} className="placeholder-image" />
          <button onClick={handleGoogleLogin}>Sign in with Google</button>

          {user && !isUsernameSet && (
            <div>
              <h3>Please choose a username:</h3>
              <form onSubmit={handleUsernameSubmit}>
                <input
                  type="text"
                  value={username}
                  onChange={handleUsernameChange}
                  placeholder="Enter your username"
                />
                <button type="submit">-→</button>
              </form>
              {!usernameAvailable && <div className="error">Username is already taken. Please choose another one.</div>}
            </div>
          )}

          <button onClick={handleGoToGameSelection}>Go to Game Selection</button>
          {user && isUsernameSet && <div><p>Already Signed In</p></div>}
          {error && <div className="error">{error}</div>}
        </div>
      </div>
    </>
  );
};

export default UserEntry;
