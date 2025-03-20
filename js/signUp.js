import { getAuth, 
    createUserWithEmailAndPassword, 
    onAuthStateChanged, db, collection, 
    addDoc,
} from "../../frebase.config.js"


const auth = getAuth();
onAuthStateChanged(auth, (user) => {
    if (user) {
        const uid = user.uid;
    } else {
    }
});

const register = async () => {
    const email = document.getElementById("exampleInputEmail1").value
    const password = document.getElementById("Password").value
    const pass = document.getElementById("confirmPassword").value
    const firstName = document.getElementById("firstName").value
    const lastName = document.getElementById("lastName").value
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    try {
        const user = userCredential.user;
        console.log(email, password, user);
        const userRef = await addDoc(collection(db, "users"), {
            email,
            firstName,
            lastName,
        });
        console.log("Document written with ID: ", userRef.id);
        if (user) {
            alert('USer Signup Successfully')
            window.location.pathname = "/public/index.html"
        }
        
    }
    catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ..
    };
}
document.getElementById("signUpSubmit")?.addEventListener("click", register)

// password
let showPassword = false
const eyeBtn = () => {
    let icon = document.querySelector('.eyeOpenPass')
    let pass = document.getElementById("Password")

    if (!showPassword) {
        icon.classList.add("fa-eye")
        pass.type = "text"
    }
    else {
        icon.classList.remove("fa-eye")
        pass.type = "password"
    }
    showPassword = !showPassword
}
document.getElementById("openEyeBtnPass")?.addEventListener("click", eyeBtn)

// confirm password
const eyeBtnComfirmPAss = () => {
    let icon = document.querySelector('.eyeOpen')
    let pass = document.getElementById("confirmPassword")

    if (!showPassword) {
        icon.classList.add("fa-eye")
        pass.type = "text"
    }
    else {
        icon.classList.remove("fa-eye")
        pass.type = "password"
    }
    showPassword = !showPassword

}
document.getElementById("openEyeBtn")?.addEventListener("click", eyeBtnComfirmPAss)
