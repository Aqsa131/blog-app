import { doc, getDoc, updateDoc, arrayUnion, arrayRemove, getAuth, onAuthStateChanged } from "../../frebase.config.js";

const auth = getAuth();
let currentUser = null;

// Check logged-in user
onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUser = user;
    console.log("User logged in:", user.uid);
  } else {
    console.log("No user logged in");
  }
});

// Function to toggle bookmark
async function toggleBookmark(blogId, icon) {
  if (!currentUser) {
    alert("Please log in to save favourites!");
    return;
  }

  const userId = currentUser.uid;
  const userRef = doc(db, "users", userId);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    let userData = userSnap.data();
    let favBlogs = userData.favourites || [];

    if (favBlogs.includes(blogId)) {
      // Remove blog from favourites
      await updateDoc(userRef, { favourites: arrayRemove(blogId) });
      console.log("Blog removed from favourites!");
      icon.classList.remove("bi-bookmark-fill");
    } else {
      // Add blog to favourites
      await updateDoc(userRef, { favourites: arrayUnion(blogId) });
      console.log("Blog added to favourites!");
      icon.classList.add("bi-bookmark-fill");
    }
  } else {
    console.log("User document not found!");
  }
}

// Bookmark click event listener
document.addEventListener("click", async function (event) {
  if (event.target.classList.contains("bookmark-icon")) {
    let blogCard = event.target.closest(".card");
    let blogId = blogCard.getAttribute("data-id");

    console.log("Toggling favourite for Blog ID:", blogId);
    await toggleBookmark(blogId, event.target);
  }
});
