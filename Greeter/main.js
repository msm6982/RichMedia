


document.querySelector("#btn-hello").onclick = () => greet("Hello!");
document.querySelector("#btn-goodbye").onclick = function(){greet("Goodbye!")};

function greet(msg) {
    // 3A - get name of person from the <input>
    let name =  document.querySelector("#input-firstname").value || "No Name";
    console.log(name);

    // 3B - get a reference to the #output <p>
    let output = document.querySelector("#output");

    // 3C - update HTML of #output <p>
    output.innerHTML = `${msg} ${name}!`
}


function greet2(evt)
{
    let msg = "Primal Scream";
    if(evt.target.id == "btn-hello") msg = "Hello there ";
    if(evt.target.id == "btn-goodbye") msg = "CYA";

    // 3A - get name of person from the <input>
    let name =  document.querySelector("#input-firstname").value || "No Name";
    console.log(name);

    // 3B - get a reference to the #output <p>
    let output = document.querySelector("#output");

    // 3C - update HTML of #output <p>
    output.innerHTML = `${msg} ${name}!`
}
/*
// 3 - create a sayHello() function
function sayHello() 
{
    // 3A - get name of person from the <input>
    let name =  document.querySelector("#input-firstname").value || "No Name";
    console.log(name);

    // 3B - get a reference to the #output <p>
    let output = document.querySelector("#output");

    // 3C - update HTML of #output <p>
    output.innerHTML = Hi name!
}
*/

function doubleIt(num){
    return num*2;
}

const doubleIt2 = (num) => {
    return num*2;
}

const doubleIt3 = (num) => num*2;

const doubleIt4 = num => num*2;
