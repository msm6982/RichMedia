/* Checked by ESLint - https://eslint.org/demo */
// mobile menu
const burgerIcon = document.querySelector("#burger");
const navbarMenu = document.querySelector("#nav-links");

burgerIcon.onclick = () => navbarMenu.classList.toggle("is-active");
