import { loadTextXHR } from "./utils.js";

const btnTaffy = document.querySelector("#button-1");
const btnViking = document.querySelector("#button-2");
const outputTaffy = document.querySelector("#output-1");
const outputViking = document.querySelector("#output-2");

btnTaffy.onclick = () => loadTextXHR("data/taffy-facts.txt", e => outputTaffy.innerHTML = e.target.responseText);
btnViking.onclick = () => loadTextXHR("data/viking-facts.txt", e => outputViking.innerHTML = e.target.responseText);
