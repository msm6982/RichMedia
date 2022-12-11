const template = document.createElement("template");
template.innerHTML = `
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.3/css/bulma.min.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" integrity="sha512-iBBXm8fW90+nuLcSKlbmrPcLa0OT92xO1BIsZ+ywDWZCvqsWgccV3gFoRBv0z+8dLJgyAHIhR35VZc2oM/gI1w==" crossorigin="anonymous" referrerpolicy="no-referrer" />

<nav class="navbar has-shadow is-white">
    <!-- log / brand -->
    <div class="navbar-brand">
      <a class="navbar-item" href="index.html">
      <i class="fas fa-bolt"></i>
      </a>
      <a class="navbar-burger" id="burger">
        <span></span>
        <span></span>
        <span></span>
      </a>
    </div>
    

    <div class="navbar-menu" id="nav-links">
      <div class="navbar-start">
        <a id = "home" class="navbar-item is-hoverable" href="home.html">
          Home
        </a>

        <a id = "app" class="navbar-item is-hoverable" href="index.html">
          App
        </a>
      
        <a id = "documentation" class="navbar-item is-hoverable" href="documentation.html">
          Documentation
        </a>
      </div> <!-- end navbar-start -->
    </div>
  </nav>
`;

// NavBar web comment
class NavBar extends HTMLElement{
    constructor(){
        super();

        this.attachShadow({mode:"open"});
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        
    }


    connectedCallback() {
        // Create span element and add it to shadow dom 
        
        const burgerIcon = this.shadowRoot.querySelector("#burger");
        const navbarMenu = this.shadowRoot.querySelector("#nav-links")


        const currentpage = this.dataset.currentpage ? this.dataset.currentpage : "home";

        // Show which page the user is currently on
        const pageIndication = this.shadowRoot.querySelector(`#${currentpage}`);

        pageIndication.disabled = true;
        pageIndication.removeAttribute("href");
        pageIndication.classList.remove("is-hoverable");
        //pageIndication.classList.remove("navbar-item");
        pageIndication.classList.add("has-text-weight-bold");


        burgerIcon.onclick = () => {
            navbarMenu.classList.toggle('is-active');
        }

    }
    
}

customElements.define('nav-bar', NavBar);