const registerForm = document.getElementById('registerForm');

registerForm.addEventListener('submit', async (ev) => {
  ev.preventDefault();
  const username = document.getElementById('username');
  const password = document.getElementById('password');

try{
  const response = await fetch("http://localhoast:3000/register", {
    method: "POST",
    headers: {
      "Content-Type":"aplication/json",
    },
    body: JSON.stringify({
      username: username.value,
      password: password.value,
    }),
  });
  const result = await response.json();
  console.log(result);
}catch(error) {
console.error(error,"here is an error")
} finally {
  username.value='';
  password.value='';
}
});