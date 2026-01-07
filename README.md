<h1>📦 Mini Project — REST Dashboard (Users & Posts Manager)</h1>

<p>
This mini project is designed to practice working with REST APIs using real HTTP requests.
The application is built on top of the <b>JSONPlaceholder API</b> and demonstrates
CRUD operations, pagination, query parameters, and error handling in a practical way.
</p>

<hr />

<h2>🎯 Project Goal</h2>
<ul>
  <li>Manage users and posts using the JSONPlaceholder API</li>
  <li>Practice CRUD operations in a real-world scenario</li>
  <li>Understand pagination and query parameters</li>
  <li>Handle asynchronous requests and errors properly</li>
</ul>

<hr />

<h2>🛠️ Technologies & Concepts Used</h2>
<ul>
  <li><b>HTTP / HTTPS</b> — Communication with backend APIs</li>
  <li><b>REST API</b> — Working with <code>/users</code> and <code>/posts</code> endpoints</li>
  <li><b>Axios</b> — Sending HTTP requests</li>
  <li><b>CRUD Operations</b> — Create, Read, Update, Delete</li>
  <li><b>Query Parameters</b> — Filtering and pagination</li>
  <li><b>async / await</b> — Asynchronous programming</li>
  <li><b>try / catch</b> — Error handling</li>
  <li><b>Browser DevTools (Network tab)</b> — Request inspection</li>
</ul>

<hr />

<h2>🖥️ Application Features</h2>

<h3>👤 Users Page</h3>
<ul>
  <li><b>"Load Users"</b> button fetches data from <code>/users</code></li>
  <li>Displays user name, email, and company information</li>
</ul>

<h3>📝 Posts Page</h3>
<ul>
  <li>Initially loads <b>5 posts</b></li>
  <li><b>"Load More"</b> button implements pagination using <code>_limit</code> and <code>_page</code></li>
  <li>New posts are appended to the existing list</li>
</ul>

<h3>➕ Create Post</h3>
<ul>
  <li>Simple form with <code>title</code> and <code>body</code> fields</li>
  <li>Sends a <b>POST</b> request to <code>/posts</code></li>
  <li>On success, the new post is added to the UI</li>
</ul>

<h3>✏️ Update Post</h3>
<ul>
  <li>Each post contains an <b>Edit</b> button</li>
  <li>Uses <b>PATCH</b> request to update post content</li>
</ul>

<h3>🗑️ Delete Post</h3>
<ul>
  <li><b>Delete</b> button removes the post</li>
  <li>Sends a <b>DELETE</b> request to the API</li>
  <li>Deleted post is removed from the interface</li>
</ul>

<h3>⚠️ Error Handling</h3>
<ul>
  <li>All async requests are wrapped with <code>try / catch</code></li>
  <li>User-friendly error messages are shown using <code>alert</code> or <code>iziToast</code></li>
</ul>

<hr />

<h2>📂 Project Structure</h2>

<pre>
/project
 ├── index.html
 ├── style.css
 └── app.js
</pre>

<hr />

<h2>📜 Sample Markup</h2>

<h3>index.html</h3>

<pre>
&lt;body&gt;
  &lt;button id="load-users"&gt;Load Users&lt;/button&gt;
  &lt;ul id="user-list"&gt;&lt;/ul&gt;

  &lt;h2&gt;Posts&lt;/h2&gt;
  &lt;button id="load-posts"&gt;Load Posts&lt;/button&gt;
  &lt;ul id="post-list"&gt;&lt;/ul&gt;
  &lt;button id="load-more"&gt;Load More&lt;/button&gt;

  &lt;h2&gt;New Post&lt;/h2&gt;
  &lt;form id="post-form"&gt;
    &lt;input type="text" name="title" placeholder="Title" required /&gt;
    &lt;textarea name="body" placeholder="Content" required&gt;&lt;/textarea&gt;
    &lt;button type="submit"&gt;Add&lt;/button&gt;
  &lt;/form&gt;
&lt;/body&gt;
</pre>

<hr />

<h2>📜 JavaScript Logic (app.js)</h2>

<pre>
import axios from "https://cdn.jsdelivr.net/npm/axios@1.6.7/dist/axios.min.js";

axios.defaults.baseURL = "https://jsonplaceholder.typicode.com";

// Load users
document.querySelector("#load-users").addEventListener("click", async () => {
  try {
    const res = await axios.get("/users");
    const markup = res.data
      .map(user => `&lt;li&gt;${user.name} - ${user.email}&lt;/li&gt;`)
      .join("");
    document.querySelector("#user-list").innerHTML = markup;
  } catch (error) {
    alert("Failed to load users");
  }
});

// Pagination for posts
let page = 1;
const limit = 5;

async function loadPosts() {
  try {
    const res = await axios.get("/posts", {
      params: { _limit: limit, _page: page }
    });

    const markup = res.data
      .map(post => `
        &lt;li&gt;
          &lt;b&gt;${post.title}&lt;/b&gt;
          &lt;p&gt;${post.body}&lt;/p&gt;
        &lt;/li&gt;
      `)
      .join("");

    document
      .querySelector("#post-list")
      .insertAdjacentHTML("beforeend", markup);

    page++;
  } catch (error) {
    alert("Failed to load posts");
  }
}

document.querySelector("#load-posts").addEventListener("click", loadPosts);
document.querySelector("#load-more").addEventListener("click", loadPosts);

// Create new post
document.querySelector("#post-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const form = e.target;
  const newPost = {
    title: form.title.value,
    body: form.body.value,
  };

  try {
    await axios.post("/posts", newPost, {
      headers: { "Content-Type": "application/json" },
    });

    alert("Post successfully created!");
    form.reset();
  } catch (error) {
    alert("Failed to create post");
  }
});
</pre>

<hr />

<h2>📌 Final Notes</h2>
<p>
This mini project brings together all essential backend interaction concepts:
HTTP requests, REST architecture, CRUD operations, pagination, and error handling.
It serves as a solid foundation for building more complex front-end applications
that communicate with real APIs.
</p>

<p><b>Happy coding! 🚀</b></p>
