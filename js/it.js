import { collection, db, query, where, onSnapshot, getAuth, onAuthStateChanged, doc, getDoc } from "../../frebase.config.js";

const auth = getAuth();
onAuthStateChanged(auth, async (user) => {
    if (user) {
        const uid = user.uid;
        console.log("Logged-in UID:", uid);

        const userRef = doc(db, "users", uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            const userData = userSnap.data();
            console.log("User Data:", userData);
        } else {
            console.log("User document not found!");
        }
    }
});
const q = query(collection(db, "posts"), where("topic", "==", "Information Technology"));
const unsubscribe = onSnapshot(q, async (querySnapshot) => {
    const blog = [];
    querySnapshot.forEach((doc) => {
        blog.push({ id: doc.id, ...doc.data() });
    });

    console.log("Current blog in posts: ", JSON.stringify(blog, null, 2));
    createCard(blog);
});

const createCard = (newCard) => {
    let foodBlog = document.getElementById("itBlogs");

    if (!itBlogs) {
        console.error("itBlogs not found");
        return;
    }
    itBlogs.innerHTML = "";

    newCard.forEach((blog) => {
        let mainCard = document.createElement("div");
        mainCard.setAttribute("class", "col-md-6 mb-4");

        mainCard.innerHTML = `
      <div class="card shadow-sm">
        <img src="${blog.imageUrl || '../images/default-placeholder.png'}" class="card-img-top" alt="Blog Image" style="height: 250px; object-fit: cover;">
        <div class="card-body">
            <h5 class="card-title">${blog.title}</h5>
            <p class="card-text">${blog.blog}</p>
            <p class="text-muted">${blog.timeserver?.toDate().toLocaleString()}</p>
            <p class="fw-bold">${blog.firstName || 'Unknown Author'}</p>
            <p class="fw-bold">${blog.lastName || 'Unknown Author'}</p>
        </div>
    </div>
    `;
    itBlogs.appendChild(mainCard);
    });
};
