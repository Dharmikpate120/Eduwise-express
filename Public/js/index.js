// const backendUrl = "http://localhost:5000";

const backendUrl = "https://eduwise-1.onrender.com";
function submitHandler(e) {
  console.log(e);
}
const videoToggle = () => {
  var cookie = getCookie("auth_token");
  console.log("toggling video");
  var loginPending = document.getElementById("login_Warning");
  var loginsuccessful = document.getElementById("video_section");
  if (cookie && cookie !== "") {
    loginPending?.classList.add("hide_login");
    loginsuccessful?.classList.remove("hide_login");
  } else {
    loginsuccessful?.classList.add("hide_login");
    loginPending?.classList.remove("hide_login");
  }
};
async function login() {
  const login_email = document.getElementById("login-email");
  const login_password = document.getElementById("login-password");

  const login = {
    email: login_email.value,
    password: login_password.value,
  };
  var response = await fetch(`${backendUrl}/auth/signin`, {
    method: "POST",
    body: JSON.stringify(login),
    headers: { "Content-Type": "application/json" },
  });
  response = await response.json();
  if (response.success) {
    console.log(response);
    setCookie("auth_token", response.auth_token, 10);

    update_DOM_auth_token();
    videoToggle();
    document
      .getElementsByClassName("js-modal-shopify")[0]
      .classList.remove("is-shown--off-flow");
    document
      .getElementsByClassName("js-modal-shopify")[0]
      .classList.add("is-hidden--off-flow");
  }
}

async function signup() {
  const signup_email = document.getElementById("signup-email");
  const signup_name = document.getElementById("signup-name");
  const signup_password = document.getElementById("signup-password");

  const signup = {
    name: signup_name.value,
    email: signup_email.value,
    password: signup_password.value,
  };
  var response = await fetch(`${backendUrl}/auth/signup`, {
    method: "POST",
    body: JSON.stringify(signup),
    headers: { "Content-Type": "application/json" },
  });
  response = await response.json();
  if (response.success) {
    setCookie("auth_token", response.auth_token, 10);
    update_DOM_auth_token();
    videoToggle();
    document
      .getElementsByClassName("js-modal-shopify")[0]
      .classList.remove("is-shown--off-flow");
    document
      .getElementsByClassName("js-modal-shopify")[0]
      .classList.add("is-hidden--off-flow");
  }
}
async function logout() {
  deleteCookie("auth_token");
  update_DOM_auth_token();
  videoToggle();
}
