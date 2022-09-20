export const loadTextXHR = (url,callback) => {
  const xhr = new XMLHttpRequest();
  xhr.onload = callback;
  xhr.onerror = e => console.log(`In onerror - HTTP Status Code = ${e.target.status}`);
  xhr.open("GET",url);
  xhr.send();
};