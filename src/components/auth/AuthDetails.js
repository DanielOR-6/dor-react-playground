import { onAuthStateChanged, signOut } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { auth,  } from "../../firebase";

const AuthDetails = () => {
   const [authUser, setAuthUser] = useState(null);

   useEffect(() => {
      const listen = onAuthStateChanged(auth, (user) => {
         if (user) {
            setAuthUser(user);
         } else {
            setAuthUser(null);
         }
      });

      return () => {
         listen();
      }
   }, []);

   const userSignOut = () => {
      signOut(auth)
         .then(() => {
            console.log("Loged out!");
         })
         .catch(error => {
            console.log("Error loging out:", error);
         })
   };

  return (
    <>
      { authUser ? <p>Signed in as {authUser.email}</p> : <p>Logged Out</p> }
      <button onClick={userSignOut}>Log Out</button>
   </>
  )
}

export default AuthDetails;