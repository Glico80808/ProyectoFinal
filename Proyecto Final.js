
principal();

async function principal () {

const respuesta = await fetch ('./ProyectoFinal.json');
const productosBD = await respuesta.json();
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
const shopContent = document.getElementById("shopContent");
const verCarrito = document.getElementById("verCarrito")
const modalContainer = document.getElementById("modal-container")
const cantidadCarrito = document.getElementById("cantidadCarrito");
const inputBuscador = document.getElementById("buscador");
let botonBuscar = document.getElementById("buscar");
botonBuscar.addEventListener("click", () => filtrar(productosBD, inputBuscador));

renderizarTarjetas(productosBD);

   function filtrar(productosBD, input) {
      let productosBDFiltrados = productosBD.filter(producto => producto.nombre.toLowerCase().includes(input.value));
      renderizarTarjetas(productosBDFiltrados);
   }
   function renderizarTarjetas(productosBD) {
      let contenedor = document.getElementById("shopContent");
      contenedor.innerHTML = ""

      productosBD.forEach((product) => {
         let content = document.createElement("div");
         content.className = "card";
         content.innerHTML = `  
    <img src= "${product.img}" >
    <h3> ${product.nombre}</h3>
    <p class = "price">${product.precio} $ </p>
    `;

         contenedor.append(content);

         let comprar = document.createElement("button");
         comprar.innerText = "comprar";
         comprar.className = "comprar";

         content.append(comprar);

         comprar.addEventListener("click", () => {

            const repeat = carrito.some((repeatProduct) => repeatProduct.id === product.id);

            if (repeat) {
               carrito.map((prod) => {
                  if (prod.id === product.id) {
                     prod.cantidad++;
                  }

               });
               lanzarTostada("Unidad agregada");
            } else {
               carrito.push({
                  id: product.id,
                  img: product.img,
                  nombre: product.nombre,
                  precio: product.precio,
                  cantidad: product.cantidad,
               });

               lanzarTostada("Producto agregado al carrito");
            }
            console.log(carrito);
            carritoCounter();
            saveLocal();
         });
      });
   }


   const pintarCarrito = () => {
      modalContainer.innerHTML = ""
      modalContainer.style.display = "flex";
      const modalHeader = document.createElement("div");
      modalHeader.className = "modal-header"
      modalHeader.innerHTML = `
       <h1 class="modal-header-title"> Carrito.</h1>
    `;
      modalContainer.append(modalHeader);

      const modalbutton = document.createElement("h1");
      modalbutton.innerText = "x";
      modalbutton.className = "modal-header-button";

      modalbutton.addEventListener("click", () => {
         modalContainer.style.display = "none";
      })

      modalHeader.append(modalbutton);


      carrito.forEach((product) => {
         let carritoContent = document.createElement("div");
         carrito.className = "modal-content";
         carritoContent.innerHTML = `
       <img src= "${product.img}">
       <h3> ${product.nombre}</h3>
       <p>${product.precio} $ </p>
       <span class = "restar"> - </span>
       <p>Cantidad: ${product.cantidad}</p>
       <span class = "sumar"> + </span>
       <p> Total : ${product.cantidad * product.precio}</p>
       <span class = "delete-product"> ❌</span>
    `;

         modalContainer.append(carritoContent);

         let restar = carritoContent.querySelector(".restar")
         let sumar = carritoContent.querySelector(".sumar")

         restar.addEventListener("click", () => {
            if (product.cantidad !== 1) {
               product.cantidad--;
            }
            saveLocal()
            pintarCarrito();
         });

         sumar.addEventListener("click", () => {
            product.cantidad++;
            saveLocal()
            pintarCarrito();
         });

         let eliminar = carritoContent.querySelector(".delete-product");

         eliminar.addEventListener("click", () => {
            eliminarProducto(product.id);

         })
      });



      const total = carrito.reduce((acc, el) => acc + el.precio * el.cantidad, 0);

      const totalBuying = document.createElement("div");
      totalBuying.className = "total-content";
      totalBuying.innerHTML = `TOTAL A PAGAR: ${total} $`
      const botonFinalizarCompra = document.createElement("button");
      botonFinalizarCompra.id = "finalizarCompra";
      botonFinalizarCompra.textContent = "Finalizar compra";
      totalBuying.appendChild(botonFinalizarCompra);
      modalContainer.append(totalBuying)

   };
   verCarrito.addEventListener("click", pintarCarrito);

   const eliminarProducto = (id) => {
      const foundId = carrito.find((element) => element.id === id);

      carrito = carrito.filter((productoId) => {
         return productoId !== foundId;

      });
      carritoCounter();
      saveLocal()
      pintarCarrito();
   };

   const carritoCounter = () => {
      cantidadCarrito.style.display = "block";

      const carritoLength = carrito.length;

      localStorage.setItem("carritoLength", JSON.stringify(carritoLength));
      cantidadCarrito.innerText = JSON.parse(localStorage.getItem("carritoLength"));
   };
   carritoCounter();






//set item
const saveLocal = () => {
   localStorage.setItem("carrito", JSON.stringify(carrito));
};

//get item 

JSON.parse(localStorage.getItem("carrito"));

let finalizarTodo = document.getElementById("finalizarCompra");

finalizarTodo.addEventListener("click", () => {
   console.log("Clic en finalizar compra")
   carrito = [];
   localStorage.removeItem("carritoLength");
   carritoCounter();
   pintarCarrito();
   lanzarAlerta("Compra finalizada!", "Gracias por su compra", "success");
});


function lanzarAlerta(title, text, icon) {
   Swal.fire({
      title: title,
      text: text,
      icon: icon
   })
}

function lanzarTostada(text) {
   Toastify({
      text: text,
      duration: 3000,
      destination: "https://github.com/apvarun/toastify-js",
      newWindow: true,
      close: true,
      gravity: "bottom", // `top` or `bottom`
      position: "right", // `left`, `center` or `right`
      stopOnFocus: true, // Prevents dismissing of toast on hover
      style: {
         background: "linear-gradient(to right, #00b09b, #96c93d)",
      },
   }).showToast();
}
}