import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import "./Login.scss";

const Login = () => {

   const [formData, setFormData] = useState({});
   const [formMessage, setFormMessage] = useState(null);

   const login = (ev) => {
      try {
         ev.preventDefault();

         // Firebase login.
         signInWithEmailAndPassword(auth, formData.email, formData.password)
            .then(userCredential => {
               console.log("User loged in:", userCredential.user);
            })
            .catch(error => {
               setFormMessage("Couldn't log user: Invalid credentials.");
            });

      } catch (error) {
         console.warn("Error on sign in:", error);
         setFormMessage(error.code);
      }
   };

   const handleInputChange = (ev) => {
      try {
         const name = ev.target.name;
         const value = ev.target.value;

         setFormData((values) => ({...values, [name]: value, }));

      } catch (error) {
         console.warn("Error handling input change:", error);
      }
   }

   return (
      <section className="login-form">
         <h3>Login form</h3>
         <form onSubmit={login}>
            <label>
               <span>Email</span>
               <input 
                  required
                  name="email"
                  type="text"
                  id="login-form-email"
                  placeholder="Input your email..."
                  value={formData.email ?? ""}
                  onChange={handleInputChange}
               />
            </label>
            <label>
               <span>Password</span>
               <input 
                  required
                  name="password"
                  type="password"
                  id="login-form-password"
                  placeholder="Input your password..."
                  value={formData.password ?? ""}
                  onChange={handleInputChange}
               />
               {formMessage && <span>{formMessage}</span>}
            </label>
            <input type="submit" value="Log In"/>
         </form>
      </section>
   )
}

export default Login;