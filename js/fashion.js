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
const q = query(collection(db, "posts"), where("topic", "==", "Fashion"));
const unsubscribe = onSnapshot(q, async (querySnapshot) => {
  const blog = [];
  querySnapshot.forEach((doc) => {
    blog.push({ id: doc.id, ...doc.data() });
  });

  console.log("Current blog in posts: ", JSON.stringify(blog, null, 2));
  createCard(blog);
});

const createCard = (newCard) => {
  let fashionBlog = document.getElementById("fashionBlog");

  if (!fashionBlog) {
    console.error("fashionBlog not found");
    return;
  }
  fashionBlog.innerHTML = "";

  newCard.forEach((blog) => {
    let mainCard = document.createElement("div");
    mainCard.setAttribute("class", "col-md-6 mb-4");

    mainCard.innerHTML = `
      <div class="card shadow-sm" data-id="${blog.id}">
        <img src="${blog.imageUrl || '../images/default-placeholder.png'}" class="card-img-top" alt="Blog Image" style="height: 250px; object-fit: cover;">
        <div class="card-body">
            <h5 class="card-title d-flex justify-content-between">
                ${blog.title}
                <i class="bi bi-bookmark bookmark-icon"></i>
            </h5>
            <p class="card-text">${blog.blog}</p>
            <p class="text-muted">${blog.timeserver?.toDate().toLocaleString()}</p>
            <p class="fw-bold">${blog.firstName || 'Unknown Author'}</p>
            <p class="fw-bold">${blog.lastName || 'Unknown Author'}</p>
        </div>
      </div>
    `;
    fashionBlog.appendChild(mainCard);
  });
  document.addEventListener("click", function (event) {
    if (event.target.classList.contains("bookmark-icon")) {
      let blogCard = event.target.closest(".card");
      let blogId = blogCard.getAttribute("data-id");

      console.log("Clicked Blog ID:", blogId);

      event.target.classList.toggle("bi-bookmark");
      event.target.classList.toggle("bi-bookmark-fill");
    }
  });
};



