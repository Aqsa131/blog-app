import { getAuth, 
    onAuthStateChanged, 
    collection, addDoc, db, 
    serverTimestamp, query, 
    where, onSnapshot, deleteDoc, 
    doc, updateDoc, getDoc  } from "../../frebase.config.js"


document.addEventListener("DOMContentLoaded", function () {
    const topicButton = document.getElementById("selectedTopic");
    const topics = document.querySelectorAll("#topicList .dropdown-item");

    topics.forEach(item => {
        item.addEventListener("click", function (event) {
            event.preventDefault();
            topicButton.textContent = this.textContent;
        });
    });
});
const auth = getAuth();
// needs to be fix
// onAuthStateChanged(auth, (user) => {
//     // const uid = user.uid;
//     let showBtn = document.getElementById("createBlog")
//         if(!showBtn){
//             console.log("no button found");
//             return;
//         }
//         if(user){
//             showBtn.style.display = "inline-block"
//             console.log("user is loggedin", user);
//         }
//         else{
//             showBtn.style.display = "none"
//             console.log("no user found");

//         }
// });

onAuthStateChanged(auth, async (user) => {
    if (user) {
        const uid = user.uid;
        const fetchRealTimeData = (userID) => {
            const topic = ["Fashion", "Food", "Trending Content", "Travel", "Information Technology", "Styling"]
            const q = query(collection(db, "posts"),
                where("userID", "==", userID),
                where("topic", "in", topic))
            // console.log("useruid===",userID, topic)
            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                const cities = [];
                querySnapshot.forEach((doc) => {
                    cities.push({ id: doc.id, ...doc.data() });;
                });
                console.log("Current posts ", cities);
                createCard(cities) //yahan array wala cities he jisko ham posts bhi kar saktay hen
            });
        }
        console.log(user);
        fetchRealTimeData(uid)
    } else {
        // window.location.pathname = "/public/index.html"
        console.log("No user")
    }
})
// const uploadImageToCloudinary = async (imageFile) => {
//     const formData = new FormData();
//     formData.append("file", imageFile);
//     formData.append("upload_preset", firebaseBlogs); 

//     try {
//         const response = await fetch("https://api.cloudinary.com/v1_1/your_cloud_name/image/upload", {
//             method: "POST",
//             body: formData,
//         });

//         if (!response.ok) {
//             throw new Error("Failed to upload image");
//         }

//         const data = await response.json();
//         return data.secure_url; 
//     } catch (error) {
//         console.error("Error uploading image:", error);
//         return null;
//     }
// };

const addBlog = async (e) => {
    e.preventDefault();

    const titleElement = document.getElementById("blogTitle");
    const blogElement = document.getElementById("blogContent");
    const topicElement = document.getElementById("selectedTopic");
    const imageFile = document.getElementById("imageUpload").files[0];
    // const firstName = document.getElementById("firstName").value
    // const lastName = document.getElementById("lastName").value


    const title = titleElement.value;
    const blog = blogElement.value;
    const topic = topicElement.textContent;

    if (!title || !blog || !topic || !imageFile) {
        alert("Please fill all fields!");
        return;
    }
    else{
        alert("Blog Uploaded Successfully")
    }
    try {
        const imageUrl = await uploadImageToCloudinary(imageFile);
        const docRef = await addDoc(collection(db, "posts"), {
            title,
            blog,
            topic,
            imageUrl,
            // firstName,
            // lastName,
            userID: auth.currentUser?.uid,
            timeserver: serverTimestamp(),
        });
        console.log("Document written with ID: ", docRef.id);
        document.getElementById("blogForm").reset();
        document.getElementById("previewImage").style.display = "none";
    } catch (e) {
        console.error("Error adding document: ", e);
    }
};

document.addEventListener("DOMContentLoaded", function () {
    const addBlogBtn = document.getElementById("addBlogs");

    if (!addBlogBtn) {
        console.error("Button with ID 'addBlogs' not found ");
        return;
    }

    addBlogBtn.addEventListener("click", addBlog);
});

const createCard = (newCard) => {
    let mainConatiner = document.getElementById("mainConatiner");
    // console.log("Main Container:", mainConatiner); 

    if (!mainConatiner) {
        console.error("mainConatiner not found in the DOM!");
        return;
    }
    mainConatiner.innerHTML = "";
    newCard.forEach((blog) => {
        let mainCard = document.createElement("div");
        mainCard.setAttribute("class", "mainCard");
        mainCard.innerHTML = `
            <div class="row">
                <div class="fashionBlog col-md-9">
                    <h2>${blog.topic}</h2>
                    <p>${blog.timeserver?.toDate().toLocaleString()}</p>
                    <h4>${blog.title}</h4>
                    <p>${blog.blog}</p>
                    <p class="fw-bold">${blog.firstName || 'Unknown Author'}</p>
                    <p class="fw-bold">${blog.lastName || 'Unknown Author'}</p>

                    <div style="margin-top: 20px;">
                        <button class="editBlog" data-id="${blog.id}" 
                            style="width: 120px; height: 40px; background-color: rebeccapurple; border: none; color: white; border-radius: 5px; cursor: pointer; margin-right: 10px; transition: background-color 0.3s;">
                            Edit
                        </button>

                        <button class="deleteBlog" data-id="${blog.id}"  
                            style="width: 120px; height: 40px; background-color:red; border: none; color: white; border-radius: 5px; cursor: pointer; transition: background-color 0.3s;">
                            Delete
                        </button>
                    </div>
                     <hr/>
                </div>
               
                <div class="col-md-3">
                    <img src="${blog.imageUrl}" alt="Blog Image" style="max-width: 100%; height: auto; border-radius: 5px;" />
                </div>
            </div>
        `;
        mainConatiner.appendChild(mainCard);
    });
    document.addEventListener("click", async (e) => {
        if (e.target.classList.contains("deleteBlog")) {
            let blogID = e.target.getAttribute("data-id");
            if (blogID) {
                await deleteBlog(blogID);
            } else {
                console.error("Blog ID not found!");
            }
        }
    });
    
    const deleteBlog = async (blogID) => {
        try {
            await deleteDoc(doc(db, "posts", blogID));
            console.log("id deleted", blogID);

        }
        catch (error) {
            console.error("not deleted")
        }
    }
};
// Edit Blog
document.addEventListener("click", async (e) => {
    if (e.target.classList.contains("editBlog")) {
        let blogID = e.target.getAttribute("data-id").trim();
        
        if (blogID) {
            // Edit page pe redirect with Blog ID
            window.location.href = `/public/html/editBlog.html?id=${blogID}`;
        } else {
            console.error("Blog ID not found!");
        }
    }
});
const urlParams = new URLSearchParams(window.location.search);
const blogID = urlParams.get("id");

const titleElement = document.getElementById("editTitle");
const blogElement = document.getElementById("editContent");
const blogIDElement = document.getElementById("editBlogID");

const loadBlogData = async () => {
    if (!blogID) {
        console.error("No Blog ID found in URL!");
        return;
    }

    const blogRef = doc(db, "posts", blogID);
    const blogSnap = await getDoc(blogRef);

    if (blogSnap.exists()) {
        const blogData = blogSnap.data();

        titleElement.value = blogData.title;
        blogElement.value = blogData.blog;
        blogIDElement.value = blogID;
    } else {
        console.error("No such blog found!");
    }
};

// Call the function to load data
loadBlogData();

// Firestore me data update karna
const updateBlog = async () => {
    const updatedTitle = titleElement.value;
    const updatedBlog = blogElement.value;
    try {
        const blogRef = doc(db, "posts", blogID);
        await updateDoc(blogRef, {
            title: updatedTitle,
            blog: updatedBlog,
            updatedAt: serverTimestamp(),
        });

        alert("Blog updated successfully!");
        
        // Redirect wapas blog list page pe
        window.location.href = "/public/html/EditBlog.html"; 
    } catch (error) {
        console.error("Error updating blog:", error);
    }
};

// Update button event listener
document.getElementById("updateBlogBtn").addEventListener("click", updateBlog);



async function uploadImageToCloudinary(file) {
    if (!file) {
        console.error("No file selected for upload!");
        return null;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "firebaseBlogs"); // Correct preset name

    try {
        const response = await fetch("https://api.cloudinary.com/v1_1/dd0hhsmim/image/upload", {
            method: "POST",
            body: formData,
        });

        const data = await response.json();

        if (data.error) {
            console.error("Cloudinary Error:", data.error.message);
            return null;
        }

        console.log("Cloudinary Response:", data);
        return data.secure_url; // Return image URL
    } catch (error) {
        console.error("Cloudinary Upload Error:", error);
        return null;
    }
}