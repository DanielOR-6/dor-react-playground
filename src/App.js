import React from 'react';
import Login from "./components/auth/Login";
import SignUp from "./components/auth/SignUp";
import AuthDetails from './components/auth/AuthDetails';

import "./App.scss";


function App() {

   /*useEffect(() => {
      fetch("/api")
         .then(response => response.json())
         .then(data => {
            setBackendData(data)
         })
         .catch(error => {
            console.warn(error);
         })
   }, []); // Empty array so it only runs on the first render.*/

   return (
      <div className="page-container">
         <Login />
         <SignUp />
         <AuthDetails />
      </div>
   )
}

export default App