import {
  db, collection, query, orderBy, limit, getDocs
} from "../../frebase.config.js"


// recent posts

async function fetchRecentBlogs() {
    try {
        const blogsRef = collection(db, "posts");
        const q = query(blogsRef, orderBy("timeServer", "desc"), limit(5)); 
        const querySnapshot = await getDocs(q);

        const blogContainer = document.getElementById("blog-container");
        if (!blogContainer) {
            console.error("Error: blog-container not found!");
            return;
        }
        blogContainer.innerHTML = ""; 

        querySnapshot.forEach((doc) => {
            const blogData = doc.data();
            displayBlog(blogData);
        });
    } catch (error) {
        console.error("Error fetching blogs: ", error);
    }
}



function displayBlog(blog) {
    const blogContainer = document.getElementById("blog-container");

    const blogElement = document.createElement("div");
    blogElement.classList.add("blog");

    let dateFormatted = "N/A";
    if (blog.timeServer && blog.timeServer.toDate) {
        dateFormatted = blog.timeServer.toDate().toLocaleString(); // Fixed formatting
    }

    blogElement.innerHTML = `
      <h3>${blog.title}</h3>
      <p>${blog.blog}</p>
      <p><small>Posted on: ${dateFormatted}</small></p>
    `;

    blogContainer.appendChild(blogElement);
    console.log("helloe");
    
}
document.addEventListener("DOMContentLoaded", function () {
    console.log("Page loaded!");
    const blogContainer = document.getElementById("blog-container");
    console.log(blogContainer); // Check if it's null

    if (!blogContainer) {
        console.error("Error: blog-container not found!");
        return;
    }

    fetchRecentBlogs();
});

document.addEventListener("DOMContentLoaded", function () {
    console.log("Page loaded!");
    console.log(document.getElementById("blog-container")); // Debugging step
    fetchRecentBlogs();
});

window.fetchRecentBlogs = fetchRecentBlogs;
