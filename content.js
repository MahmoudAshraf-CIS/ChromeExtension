console.log('content.js')

//alert('content')

var greeting = "hola, ";
const p = document.createElement("p");
p.textContent = "as";
document.body.insertBefore(p, document.body.firstChild);
var element = document.createElement("button");
//Assign different attributes to the element. 
//element.type = type;
element.innerHTML = "Do Something";
element.style.backgroundColor = "yellow";
element.style.width = "300px"
element.style.height = "300px"
element.style.zIndex = "-10"
element.style.top = "-10"

element.addEventListener("click", function() {
    console.log('click!')
    var cookies = document.cookie.split(";");
    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        var eqPos = cookie.indexOf("=");
        var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
});

console.log('bbbb')

document.body.appendChild(element, document.body.firstChild);
//document.body.insertBefore(element, document.body.firstChild);
/* 
var x = document.getElementsByClassName("style-scope ytd-subscribe-button-renderer");
console.log(x)
x.onclick = function() {
    console.log("hover")
    alert('content')
}; */