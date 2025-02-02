import React, { useState, useEffect } from "react";
import { auth, provider, db, setDoc, doc, collection, query, where, getDocs } from "./firebase"; // Correct imports
import { signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { onAuthStateChanged } from "firebase/auth"; // Import the missing function

const UserEntry = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [username, setUsername] = useState("");
  const [usernameAvailable, setUsernameAvailable] = useState(true);
  const [isUsernameSet, setIsUsernameSet] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Track loading state
  const navigate = useNavigate();

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        checkUsername(currentUser.uid); // Check if the user has a username
      } else {
        setUser(null);
        setIsUsernameSet(false); // Reset isUsernameSet when logged out
        setIsLoading(false); // End loading when there's no user
      }
    });

    return () => unsubscribe(); // Clean up the listener
  }, []);

  // Check if the user already has a username set in the database
  const checkUsername = async (uid) => {
    const usernameRef = collection(db, "Players");
    const q = query(usernameRef, where("uid", "==", uid));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      // User already has a username set
      setIsUsernameSet(true);
      setUsername(querySnapshot.docs[0].data().username); // Set the username
    } else {
      // No username set yet
      setIsUsernameSet(false);
    }
    setIsLoading(false); // End loading once the check is complete
  };

  // Handle Google login
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      alert("Google login successful!");
    } catch (err) {
      setError(err.message);
    }
  };
  

  // Handle username input
  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  // Handle form submission for username
  const handleUsernameSubmit = async (e) => {
    e.preventDefault();
    const usernameRef = collection(db, "Players");
    const q = query(usernameRef, where("username", "==", username));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      // Username is available, save it
      await setDoc(doc(db, "Players", username), {
        uid: user.uid,
        username: username,
      });
      setIsUsernameSet(true);
      navigate("/GameSelection", { state: { username } });
    } else {
      // Username already taken
      setUsernameAvailable(false);
    }
  };

  // Handle navigation to GameSelection
  const handleGoToGameSelection = () => {
    if (isUsernameSet) {
      navigate("/GameSelection", { state: { username } });
    } else {
      alert("You need to set a username first!");
    }
  };

  // Don't render anything until username check is complete (prevent flickering)
  if (isLoading) return <div>Loading...</div>;

  return (
    <>
      <Helmet>
        <title>User Entry</title>
      </Helmet>
      <div className="UE-Container">
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
              <button type="submit">Submit</button>
            </form>
            {!usernameAvailable && <div className="error">Username is already taken. Please choose another one.</div>}
          </div>
        )}

        {user && isUsernameSet && (
          <div>
            <h3>Welcome, {username}!</h3>
            <p>Your username is already set.</p>
          </div>
        )}

        <button onClick={handleGoToGameSelection}>
          Go to Game Selection
        </button>

        {error && <div className="error">{error}</div>}
      </div>
    </>
  );
};

export default UserEntry;
