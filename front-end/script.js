
const reg = document.querySelector(".reg");
const log = document.querySelector(".log");
const ads = document.querySelector(".div");
const ads2 = document.querySelector(".div2")
const closeBtn = document.querySelectorAll(".first");

const nameUser = document.querySelector('.name-user')
const email = document.querySelector('.email')
const password = document.querySelector('.password')
const email2 = document.querySelector('.email2')
const password2 = document.querySelector('.password2')
const registerBtn = document.querySelector('.register-btn')
const loginBtn = document.querySelector('.login-btn')
const confirmPassword = document.querySelector('.confirm-password')


registerBtn.addEventListener('click', async () => {
  if (password.value !== confirmPassword.value) {
    Swal.fire({
      title: "Ошибка!",
      text: "Пароли не совпадают. Попробуйте снова.",
      icon: "error"
    })
    return
  }
  await register(nameUser.value, email.value, password.value)
})

document.querySelector("#login-form").addEventListener('submit', async (e) => {
  e.preventDefault()
  await login(email2.value, password2.value)
})

reg.addEventListener('click', () => {
  ads.classList.add("active");

})

log.addEventListener('click', () => {
  ads2.classList.add("active");

})

document.addEventListener('click', (e) => {
  if (!ads.contains(e.target) && !reg.contains(e.target)) {
    ads.classList.remove("active");
  }
  if (!ads2.contains(e.target) && !log.contains(e.target)) {
    ads2.classList.remove("active");
  }
});

closeBtn.forEach(item => {
  item.addEventListener('click', () => {
    ads.classList.remove("active");
    ads2.classList.remove("active");
  })
})

async function register(first_name, email, password) {
  console.log(email, first_name, password)
  try {
    const fetchs = await fetch('http://localhost:5000/api/userRoutes/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        first_name,
        password
      })
    })

    if (fetchs.ok) {
      Swal.fire({
        title: "Отлично!",
        text: `Регистрация прошла успешно`,
        icon: "success"
      })
    } else {
      throw new Error(data.message || "Неизвестная ошибка");
    }
    const data = await fetchs.json()
    console.log(data)
    ads.classList.remove("active");
  } catch (error) {
    Swal.fire({
      title: "Ошибка!",
      text: `С таким email уже зарегистрирован`,
      icon: "error"
    })
  }
}

async function login(email, password) {
  console.log(email, password)
  const fetchs = await fetch('http://localhost:5000/api/userRoutes/loginUser', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email,
      password
    })
  })
  const data = await fetchs.json()
  console.log(data)

  if (fetchs.ok) {
    localStorage.setItem('user_id', data.user.id)
    localStorage.setItem('name_user', data.user.first_name)
    localStorage.setItem('email_user', data.user.email)

    Swal.fire({
      title: "Отлично!",
      text: `Добро пожаловать, ${data.user.first_name}!`,
      icon: "success"
    })
    setTimeout(() => {
      document.location.href = './main.html'
    }, 2000)

    ads2.classList.remove("active");
  } else {
    Swal.fire({
      title: "Ошибка!",
      text: "Вы ввели некорректные данные, повторите попытку",
      icon: "error"
    });
  }


}


email.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    registerBtn.click()
  }
});
password.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    registerBtn.click();
  }
});

email2.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    loginBtn.click()
  }
});
password2.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    loginBtn.click();
  }
});