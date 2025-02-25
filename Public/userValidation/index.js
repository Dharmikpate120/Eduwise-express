function getCookie(name) {
  var value = null;
  document.cookie.split(";").map((element) => {
    var arr = element.split("=");
    if (arr[0] === ` ${name}` || arr[0] === name) {
      value = arr[1];
    }
  });
  return value;
}

function setCookie(name, value, days) {
  let date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  let expires = "expires=" + date.toUTCString();
  document.cookie = name + "=" + value + ";" + expires;
}

function deleteCookie(name) {
  document.cookie = `${name}=; expires=000`;
}

const update_DOM_auth_token = () => {
  var loginPending = document.getElementById("auth_pending");
  var loginsuccessful = document.getElementById("auth_successfull");
  const cookie = getCookie("auth_token");
  console.log(cookie);
  if (cookie && cookie !== "") {
    loginPending.classList.add("hide_login");
    loginsuccessful.classList.remove("hide_login");
  } else {
    loginsuccessful.classList.add("hide_login");
    loginPending.classList.remove("hide_login");
  }
};
update_DOM_auth_token();
