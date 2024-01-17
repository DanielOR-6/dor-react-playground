import React, { useState } from "react";
import { GoogleAuthProvider, createUserWithEmailAndPassword, deleteUser, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth } from "../../firebase";
import axios from "axios";
import "./SignUp.scss";

const SignUp = () => {

   const [formData, setFormData] = useState({});
   const [passwordMessage, setPasswordMessage] = useState(null);

   const signUpWithGoogle = (ev) => {
      ev.preventDefault();

      const currentUser = auth.currentUser;

      if (currentUser) {
         alert("You need to log out first:", currentUser.email);
         return;
      }

      const provider = new GoogleAuthProvider();

      signInWithPopup(auth, provider)
         .then(result => {

            const user = result.user;

            const mongoData = {
               _id: user.uid, 
               username: user.displayName, 
               email: user.email, 
               created_at: new Date(), 
               updated_at: new Date(), 
            };

            if (user.phoneNumber) {
               mongoData["phone"] = user.phoneNumber;
            }

            axios.post("/users/signup", mongoData)
                  .then(res => {
                     if (res.status = 200) {
                        console.log("Created user succesfully:", res.data);
                     } else {
                        console.warn("Error creating mongo user");
                        deleteUser(auth.currentUser).then(() => {
                           console.log("Firebase user deleted");
                        })
                        .catch(error => {
                           console.warn("Error deleting firebase user:", error);
                        })
                     }
                  })
                  .catch(error => {
                     console.warn("Error on mongo request:", error);
                     deleteUser(auth.currentUser).then(() => {
                        console.log("Firebase user deleted");
                     })
                     .catch(error => {
                        console.warn("Error deleting firebase user:", error);
                     })
                  })

            console.log("Success on google sign in:", result.user);
         })
         .catch(error => {
            console.warn("Error on google sign in:", error);   
         });

   }

   const signUp = (ev) => {
      try {
         ev.preventDefault();

         const currentUser = auth.currentUser;

         if (currentUser) {
            alert("You need to log out first:", currentUser.email);
            return;
         }

         let error = false;

         if (formData.password !== formData.repassword) {
            setPasswordMessage("Passwords don't match.");
            error = true;
         } else {
            setPasswordMessage(null);
         }

         if (error) {
            return;
         }

         createUserWithEmailAndPassword(auth, formData.email, formData.password)
            .then((userCredential) => {
               const user = userCredential.user;

               const mongoData = {
                  _id: user.uid, 
                  username: formData.username, 
                  email: formData.email, 
                  created_at: new Date(), 
                  updated_at: new Date(), 
               };

               if (formData.age && formData.age.length > 0) {
                  mongoData["age"] = parseInt(formData.age);
               }

               if (formData.phone && formData.phone.length > 0) {
                  mongoData["phone"] = formData.phone;
               }

               axios.post("/users/signup", mongoData)
                  .then(res => {
                     if (res.status = 200) {
                        console.log("Created user succesfully:", res.data);
                     } else {
                        console.warn("Error creating mongo user");
                        deleteUser(auth.currentUser).then(() => {
                           console.log("Firebase user deleted");
                        })
                        .catch(error => {
                           console.warn("Error deleting firebase user:", error);
                        })
                     }
                  })
                  .catch(error => {
                     console.warn("Error on mongo request:", error);
                     deleteUser(auth.currentUser).then(() => {
                        console.log("Firebase user deleted");
                     })
                     .catch(error => {
                        console.warn("Error deleting firebase user:", error);
                     })
                  });
            })
            .catch(error => {
               if (error.code === "auth/email-already-in-use") {
                  setPasswordMessage("Email already in use. Please, try a different one.");
               } else {
                  setPasswordMessage("Unknown error. Contact customer support support@test.com");
               }
            })

      } catch (error) {
         console.warn("Error on sign in:", error);
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
      <section className="signup-form">
         <h3>Sign up form</h3>
         <form onSubmit={signUp}>
            <label>
               <span>Username</span>
               <input 
                  required
                  name="username"
                  type="text"
                  id="signup-form-username"
                  placeholder="Input your username..."
                  value={formData.username ?? ""}
                  onChange={handleInputChange}
               />
            </label>
            <label>
               <span>Email</span>
               <input 
                  required
                  name="email"
                  type="text"
                  id="signup-form-email"
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
                  id="signup-form-password"
                  placeholder="Input your password..."
                  value={formData.password ?? ""}
                  onChange={handleInputChange}
               />
            </label>
            <label>
               <span>Repeat password</span>
               <input 
                  required
                  name="repassword"
                  type="password"
                  id="signup-form-repassword"
                  placeholder="Repeat your password..."
                  value={formData.repassword ?? ""}
                  onChange={handleInputChange}
               />
               <span className="form-message">{passwordMessage}</span>
            </label>
            <div className="form-separator"></div>
            <label>
               <span>Age</span>
               <input 
                  name="age"
                  type="number"
                  id="signup-form-age"
                  placeholder="Input your age..."
                  value={formData.age ?? ""}
                  onChange={handleInputChange}
               />
            </label>
            <label>
               <span>Phone number</span>
               <input 
                  name="phone"
                  type="text"
                  id="signup-form-phone"
                  placeholder="Input your phone..."
                  value={formData.phone ?? ""}
                  onChange={handleInputChange}
               />
            </label>
            <button type="button" onClick={signUpWithGoogle}>Log In with Google</button>
            <input type="submit" value="Sign Up"/>
         </form>
      </section>
   )
}

export default SignUp;