import {
    getAuth,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    GoogleAuthProvider, signInWithPopup,
    signOut, sendPasswordResetEmail 
} from "../../frebase.config.js"

const auth = getAuth();
onAuthStateChanged(auth, (user) => {
    // if (user) {
    // const uid = user.uid;
    if (user) {
        // alert("Dont Have Account? SIgnUp first")
        console.log(user);

    } else {
        // window.location.pathname = "/public/index.html"
        console.log("No user");

    }
});
const login = async (e) => {
    e.preventDefault()
    // if(!user){
    //     console.log("no user signed");
    // }
    // else{
    //     console.log(userCredential.user);

    // }
    try {
        const email = document.getElementById("Email")
        const password = document.getElementById("Password")
        const userCredential = await signInWithEmailAndPassword(auth, email.value, password.value)
        console.log(email, password);
        // const user = userCredential.user;
        console.log("user ", userCredential);
        if (userCredential.user) {
            window.location.pathname = "/public/index.html"
        }
        else {
            console.log("No user found");
        }
    }
    catch (error) {
        console.error("error", error)
        const errorCode = error.code;
        const errorMessage = error.message;
    };

}
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("logIn")?.addEventListener("click", login);
});

// continue with google
const provider = new GoogleAuthProvider()
provider.setCustomParameters({ prompt: "select_account" });

const google = () => {
    signInWithPopup(auth, provider)
        .then((result) => {
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            const user = result.user;
            if (user) {
                window.location.pathname = "/public/index.html"
            }
        }).catch((error) => {
            console.error("error", error)
            const errorCode = error.code;
            const errorMessage = error.message;
            const email = error.customData.email;
            const credential = GoogleAuthProvider.credentialFromError(error);
            // ...
        });

}
document.getElementById("google")?.addEventListener("click", google)

// forgotPassword
const forgotPassword=()=>{
    const email = document.getElementById("Email").value
    sendPasswordResetEmail(auth, email)
  try{
    {
        console.log("email sent to the given email");
        
      }
  }
  catch(error){
    console.log("error", Error);
    
    const errorCode = error.code;
    const errorMessage = error.message;
    // ..
  };
    
}
document.getElementById("forgotPassword")?.addEventListener("click", forgotPassword)


// loginBtnFromIndex 
// const loginBtnToLogOut=()=>{
//     const user = auth.currentUser
//     if(user.uid){
//         const userLoginElement = document.getElementById("login")
//             if (userLoginElement) {
//                 userLoginElement.parentNode.remove()
//                 let loginSec = document.getElementById("logIn-sec")
//                 let logOutBtn = document.createElement("button")
//                 let logOutText = document.createTextNode("Log Out")
//                 logOutBtn.appendChild(logOutText)
//                 loginSec.appendChild(logOutBtn)
//             }
//     }
// }
// document.getElementById("login")?.addEventListener("click", loginBtnToLogOut)



const loginBtnToLogOut = () => {
    const user = auth.currentUser;
    if (user && user.uid) {
        const userLoginElement = document.getElementById("login");
        if (userLoginElement) {
            userLoginElement.remove();
        }

        let loginSec = document.getElementById("logIn-sec");
        if (!loginSec) {
            console.error("logIn-sec element not found in DOM!");
            return;
        }

        let logOutBtn = document.createElement("button");
        logOutBtn.innerText = "Log Out";
        logOutBtn.id = "logout";

        loginSec.appendChild(logOutBtn);

        // // Logout Functionality
        // logOutBtn.addEventListener("click", async () => {
        //     await signOut(auth);
        //     console.log("User logged out");
        //     logOutBtn.remove(); 
        //     location.reload(); 
        // });
    }
};
loginBtnToLogOut()

document.getElementById("login")


const logOut = (e) => {
    e.preventDefault()
    signOut(auth).then(() => {

        window.location.pathname = "/public/html/login.html"
        console.log("Sign-out successful");

    }).catch((error) => {
        // An error happened.
    });
    // console.log("clicked");

}
document.getElementById("logOut")?.addEventListener("click", logOut)



