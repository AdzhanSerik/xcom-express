const postBtn = document.querySelector(".post-btn");
const modal = document.querySelector(".modal-post");
const closeBtn = document.querySelector(".close-modal");
const user_id = localStorage.getItem("user_id")
const login_btn = document.querySelector(".login-btn")
const logout_btn = document.querySelector(".logout-btn")

document.querySelector(".close-modal").addEventListener("click", () => {
    document.querySelector(".modal-post").classList.add("hidden");
});

document.querySelector(".post-btn").addEventListener("click", () => {
    const userId = localStorage.getItem('user_id')
    if (!userId) {
        Swal.fire({
            title: "Вы должны быть залогинены, чтобы создать пост!",
            text: `Ошибка`,
            icon: "error"
        })
    }
    document.querySelector(".modal-post").classList.remove("hidden");
});

document.addEventListener('click', (e) => {
    if (!modal.contains(e.target) && !postBtn.contains(e.target)) {
        modal.classList.add("hidden");
    }

});

document.querySelector('form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.querySelector('.title').value;
    const text_post = document.querySelector('.text-post').value;
    const user_id = localStorage.getItem('user_id');
    await createPost(user_id, title, text_post);
    modal.classList.add("hidden");
    await renderAll()
})

async function createPost(user_id, title, text_post) {
    try {
        const response = await fetch('http://localhost:5000/api/postsRoutes/posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user_id,
                title,
                text_post
            })
        })
    } catch (error) {
        console.log(error)
    }
}

async function getAllPosts() {
    try {
        const response = await fetch('http://localhost:5000/api/postsRoutes/posts')
        const posts = await response.json()
        return posts
    } catch (error) {
        console.log(error)
    }
}
async function likePost(post_id, user_id) {
    const response = await fetch(`http://localhost:5000/api/likesRoutes/likes`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ post_id, user_id }),
    })
    const result = await response.json()
    console.log(result)
    renderPosts()
}

const renderProfile = () => {
    const userEmail = localStorage.getItem('email_user')
    const nameUser = localStorage.getItem('name_user')
    const profileContainer = document.querySelector(".profile")
    if (userEmail && nameUser) {
        document.querySelector('.profile').innerHTML = `
        <p class="profile-email text-white text-xl">Привет, ${nameUser}!</p>    
        <p class="profile-email text-xl">${userEmail}</p>
        `;
    } else {
        profileContainer.innerHTML = ""
    }
}
renderProfile()

async function renderPosts() {
    document.querySelector('.main').innerHTML = '';
    const posts = await getAllPosts();
    const likes = await getAllLikes();
    const user_id = localStorage.getItem('user_id');

    posts.forEach(post => {
        const dateTime = new Date(post.createdAt).toLocaleString();
        const userLikes = likes.filter(like => like.post_id == post.post_id);
        const userLiked = userLikes.some(like => like.user_id == user_id);
        console.log(userLiked)

        document.querySelector('.main').insertAdjacentHTML('afterbegin', `
            <div class="border-slate-600 border rounded-xl mb-6">
                <div class="lenta-user flex items-start gap-4 mt-5 px-6 py-4">
                    <i class="fa-solid fa-user-tie text-5xl"></i>
                    <div class="profile flex flex-col">
                        <p class="text-3xl">${post.users.email}</p>
                        <p class="text-slate-500">${dateTime}</p>
                    </div>
                    <i class="fa-solid fa-circle-check text-blue-400 text-3xl"></i>
                </div>
                <div class="lenta-body px-6 py-2 text-2xl">
                    <p class="font-bold">${post.title}</p>
                    <p>${post.text_post}</p>
                </div>
                <div class="users-stats flex items-center gap-4 p-5">
                    <i class="fa-solid fa-heart cursor-pointer ${userLiked ? 'text-red-600 scale-110' : 'text-gray-400'} transition-all duration-300 ease-in-out hover:scale-125 active:scale-95" 
                        onclick="likePost('${post.post_id}', '${user_id}')"
                        data-post-id="${post.post_id}">
                    </i>
                    <span class="font-bold">${userLikes.length}</span>
                    <i class="comments-count fa-solid fa-comment"></i><span data-comment="${post.post_id}"></span>
                    <i class="fa-solid fa-bookmark text-yellow-500"></i></i><span data-favorite="">0</span>
                </div>
                <div class="users-comment flex items-center p-5 gap-3">
                    <input data-id="${post.post_id}" class="bg-white text-black w-full rounded-full p-3 placeholder:pl-1" placeholder="Комментарии..." type="text">
                    <button type="button" onclick="createCommentt('${post.post_id}', '${user_id}', event)"
                        class="bg-white hover:bg-gray-300 text-black rounded-full px-4 py-2 transition-all duration-300">
                        Оставить комментарий
                    </button>
                </div>
                <p class="font-bold text-2xl p-5">Комментарии</p>
                <div class="comments" data-idcomment="${post.post_id}"></div>
            </div>
        `);
    });

    await renderComments();
}

async function renderComments() {
    const comments = await getAllComments();
    const allPosts = document.querySelectorAll('.comments');

    allPosts.forEach(item => {
        const postId = item.getAttribute('data-idcomment');
        const filterComments = comments.filter(comment => comment.post_id == postId);
        item.parentElement.querySelector(`[data-comment="${postId}"]`).innerHTML = filterComments.length;
        const sortComments = filterComments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        item.innerHTML = "";

        let mainComments = 1;
        let moreButton = null;

        function renderVisibleComments() {
            item.innerHTML = "";

            sortComments.slice(0, mainComments).forEach(comment => {
                const timeDate = new Date(comment.createdAt).toLocaleString();
                item.insertAdjacentHTML('beforeend', `
                    <div class="comment flex flex-col border-slate-600 border-t-1">
                        <div class="flex items-start gap-4 mt-5 px-6 py-4">
                            <i class="fa-solid fa-user-tie text-5xl"></i>
                            <div class="profile flex flex-col">
                                <p>${comment.users.email}</p>
                                <p class="text-slate-500">${timeDate}</p>
                            </div>
                        </div>
                        <div class="flex items-start gap-4 mt-5 mb-5 px-6">
                            <p>${comment.comment_text}</p>
                        </div>
                    </div>
                `);
            });

            if (moreButton) {
                moreButton.remove();
            }

            if (filterComments.length > 1) {
                moreButton = document.createElement("button");
                moreButton.textContent = mainComments >= filterComments.length ? "Скрыть" : "Еще";
                moreButton.classList.add("more-comments-btn", "bg-none", "p-6", "text-blue-600", "cursor-pointer", "hover:text-blue-200", "ease-in", "duration-100");
                moreButton.addEventListener("click", () => {
                    if (mainComments >= filterComments.length) {
                        mainComments = 1
                    } else {
                        mainComments += 3
                    }
                    renderVisibleComments()
                })
                item.appendChild(moreButton);
            }
        }

        renderVisibleComments();
    });
}


async function createCommentt(post_id, user_id, event) {
    event.preventDefault()
    const comment = document.querySelector(`[data-id="${post_id}"]`).value
    await fetch('http://localhost:5000/api/commentsRoutes/comments', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            user_id,
            post_id,
            comment_text: comment
        })
    })
    await renderAll()
}

async function getAllComments() {
    try {
        const response = await fetch('http://localhost:5000/api/commentsRoutes/comments')
        const comments = await response.json()
        return comments
    } catch (error) {
        console.log(error)
    }
}

async function getAllLikes() {
    try {
        const response = await fetch('http://localhost:5000/api/likesRoutes/likes')
        const likes = await response.json()
        return likes
    } catch (error) {
        console.log(error)
    }
}

document.querySelector('.logout-btn').addEventListener('click', () => {
    window.location.href = './index.html'
    localStorage.removeItem('name_user')
    localStorage.removeItem('email_user')
    localStorage.removeItem('user_id')
    document.location.reload()
})

document.querySelector('.login-btn').addEventListener('click', () => {
    window.location.href = './index.html'
})

const name_user = localStorage.getItem('name_user')
if (!name_user) {
    document.querySelector('.logout-btn').style.display = 'none'
    document.querySelector('.login-btn').style.display = 'block'
}
else {
    document.querySelector('.logout-btn').style.display = 'block'
    document.querySelector('.login-btn').style.display = 'none'
}

async function renderAll() {
    await renderPosts()
    await renderComments()
    await getAllLikes()
}
renderAll()