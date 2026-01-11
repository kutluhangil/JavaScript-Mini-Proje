import axios from "https://cdn.jsdelivr.net/npm/axios@1.6.7/+esm";

// --- Ayarlar ---
axios.defaults.baseURL = "https://jsonplaceholder.typicode.com";
const POSTS_LIMIT = 5;
let currentPage = 1;

// --- HTML Elemanları ---
const userList = document.querySelector("#user-list");
const postList = document.querySelector("#post-list");
const loadUsersBtn = document.querySelector("#load-users");
const loadMoreBtn = document.querySelector("#load-more");
const postForm = document.querySelector("#post-form");

// --- Bildirim Fonksiyonu ---
const notify = (type, message) => {
  let title;
  switch (type) {
    case "success":
      title = "Başarılı";
      break;
    case "error":
      title = "Hata";
      break;
    case "warning":
      title = "Uyarı";
      break;
    case "info":
      title = "Bilgi";
      break;
    default:
      title = "Bildirim";
  }

  iziToast[type]({
    title: title,
    message: message,
    position: "topRight",
    timeout: 3000,
  });
};

// --- Kullanıcı İşlemleri ---
async function loadUsers() {
  try {
    // Destructuring: res.data yerine { data } alıyoruz
    const { data: users } = await axios.get("/users");
    renderUsers(users);
    notify("success", "Kullanıcılar yüklendi!");
  } catch (err) {
    console.error(err);
    notify("error", "Kullanıcılar yüklenemedi.");
  }
}

function renderUsers(users) {
  userList.innerHTML = users
    .map((user) => {
      // Destructuring: Nesne özelliklerini çıkarıyoruz
      const { name, email, company, website } = user;
      return `
        <div class="user-card">
          <h4>${name}</h4>
          <p>📧 ${email}</p>
          <p>🏢 ${company.name}</p>
          <p>🌐 ${website}</p>
        </div>
      `;
    })
    .join("");
}

loadUsersBtn.addEventListener("click", loadUsers);

// --- Gönderi İşlemleri ---

// 1. Gönderileri Getir (Async/Await + Params)
async function loadPosts() {
  try {
    const { data: posts } = await axios.get("/posts", {
      params: { _limit: POSTS_LIMIT, _page: currentPage },
    });

    if (posts.length === 0) {
      notify("info", "Daha fazla gönderi yok.");
      loadMoreBtn.style.display = "none";
      return;
    }

    renderPosts(posts);
    currentPage++;
  } catch (err) {
    console.error(err);
    notify("error", "Gönderiler alınamadı.");
  }
}

function renderPosts(posts) {
  const html = posts
    .map((post) => {
      const { id, title, body } = post; // Destructuring
      // Olay Delegasyonu için data-id ve data-action özniteliklerini ekliyoruz
      // Inline onclick (onclick="...") KULLANMIYORUZ
      return `
        <div class="post-card" id="post-${id}">
          <div class="post-content">
            <h4>${title}</h4>
            <p>${body}</p>
          </div>
          <div class="post-actions">
            <button class="btn primary btn-sm" data-action="edit" data-id="${id}">Düzenle</button>
            <button class="btn danger btn-sm" data-action="delete" data-id="${id}">Sil</button>
          </div>
        </div>
      `;
    })
    .join("");

  postList.insertAdjacentHTML("beforeend", html);
}

loadMoreBtn.addEventListener("click", loadPosts);

// 2. Yeni Gönderi Ekle (Form Submit + Destructuring)
postForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);

  // Form verilerini alırken trim() metodu kullanıyoruz (String metotları konusu)
  const title = formData.get("title").trim();
  const body = formData.get("body").trim();

  if (!title || !body) {
    notify("warning", "Lütfen tüm alanları doldurun.");
    return;
  }

  const newPost = { title, body, userId: 1 };

  try {
    const { data } = await axios.post("/posts", newPost, {
      headers: { "Content-Type": "application/json" },
    });

    // Spread Syntax (...) ile nesne kopyalama
    const fakePostWithId = { ...newPost, id: data.id || Date.now() };

    // Yeni gönderiyi manuel olarak listeye ekle (renderPosts fonksiyonunu burası için özelleştirebiliriz veya manuel HTML oluşturabiliriz)
    const { id, title: pTitle, body: pBody } = fakePostWithId;

    const postHTML = `
    <div class="post-card new-post" id="post-${id}">
      <div class="post-content">
        <h4>${pTitle}</h4>
        <p>${pBody}</p>
      </div>
      <div class="post-actions">
        <button class="btn primary btn-sm" data-action="edit" data-id="${id}">Düzenle</button>
        <button class="btn danger btn-sm" data-action="delete" data-id="${id}">Sil</button>
      </div>
    </div>`;

    postList.insertAdjacentHTML("afterbegin", postHTML);

    notify("success", "Yeni gönderi eklendi!");
    e.target.reset();
  } catch (err) {
    console.error(err);
    notify("error", "Gönderi eklenirken hata oluştu.");
  }
});

// --- Olay Delegasyonu (Event Delegation) ---
// Buttonlara tek tek olay dinleyicisi eklemek yerine, ebeveyn (postList) elemana ekliyoruz.
postList.addEventListener("click", async (e) => {
  const target = e.target;

  // Tıklanan eleman bir buton mu kontrol et
  if (target.tagName !== "BUTTON") return;

  // Dataset üzerinden aksiyon ve ID bilgisini al (Destructuring)
  const { action, id } = target.dataset;

  if (action === "delete") {
    await deletePost(id);
  } else if (action === "edit") {
    await editPost(id);
  }
});

// 3. Gönderi Sil
async function deletePost(id) {
  if (!confirm("Bu gönderiyi silmek istediğine emin misin?")) return;

  try {
    await axios.delete(`/posts/${id}`);

    const postEl = document.getElementById(`post-${id}`);
    if (postEl) {
      postEl.remove();
      notify("success", "Gönderi silindi!");
    }
  } catch (err) {
    console.error(err);
    notify("error", "Silinirken hata oluştu.");
  }
}

// 4. Gönderi Düzenle
async function editPost(id) {
  const postEl = document.getElementById(`post-${id}`);
  const titleEl = postEl.querySelector("h4");
  const bodyEl = postEl.querySelector("p");

  const newTitle = prompt("Yeni başlık:", titleEl.innerText);
  if (newTitle === null) return;

  const newBody = prompt("Yeni içerik:", bodyEl.innerText);
  if (newBody === null) return;

  try {
    await axios.patch(`/posts/${id}`, {
      title: newTitle,
      body: newBody
    });

    titleEl.innerText = newTitle;
    bodyEl.innerText = newBody;

    notify("success", "Gönderi güncellendi!");
  } catch (err) {
    console.error(err);
    notify("error", "Güncelleme başarısız.");
  }
}

// --- Başlangıç ---
loadPosts();
