
function httpRequest(method, route) {
    return new Promise ((resolve, reject) => {
        var request = new XMLHttpRequest();
        request.open(method, "http://localhost:3000/api/products/" + route);
        request.onload = function() {
            if (this.status === 200){    // Si la requête à fonctionnée
                var response = JSON.parse(this.responseText);
                resolve(response);
            } else {                    // Si la requête à échouée
                var response = console.log("HTTPRequest responded with "+this.status);
                reject(response);
            }
        };
        request.send();
    })
}

// Retourne le produit demandé
async function getProduct(productId) {
    let method = "GET",
        route = productId;
    let object =  await httpRequest(method, route);
    return object;
}

// Envoie la commande
async function postOrder(order) {
    let method = "POST",
        route = order;
    let object =  await httpRequest(method, route);
    return object;
}

// Récupère ou initialise la liste de produits du panier
function getCartList() {
    let list = localStorage.cartList;
    if (list === undefined) {
        list = [];
    }
    else {
        list = JSON.parse(list);
    }
    return list;
}

// Permet d'attribuer plusieurs attributs à la fois
function setAttributes(element, attributes) {
    for (let key in attributes) {
        element.setAttribute(key, attributes[key]);
    }
}

// Créé le contenu initial de la page panier à partir du localStorage
async function cartCreator (cartList) {

    if (cartList.length !== 0)  {
        for(let cartProduct of cartList) {
            let section = document.getElementById("cart__items"),
                product = await getProduct(cartProduct.id),
                article = document.createElement("article");

            setAttributes(article, {
                "class": "cart__item",
                "data-id": cartProduct.id,
                "data-color": cartProduct.color
            })
    
            article.innerHTML = '\
            <div class="cart__item__img">\
                <img src="'+product.imageUrl+'" alt="'+product.altTxt+'" />\
            </div>\
            <div class="cart__item__content">\
                <div class="cart__item__content__description">\
                    <h2>'+product.name+'</h2>\
                    <p>'+cartProduct.color+'</p>\
                    <p>'+product.price+'€</p>\
                </div>\
                <div class="cart__item__content__settings">\
                    <div class="cart__item__content__settings__quantity">\
                        <p>Qté : </p>\
                        <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="'+cartProduct.quantity+'">\
                    </div>\
                    <div class="cart__item__content__settings__delete">\
                        <p class="deleteItem">Supprimer</p>\
                    </div>\
                </div>\
            </div>\
            ';
            section.appendChild(article);
        }
    }
}

// Affiche la quantité et le prix total du panier, indique si le panier est vide
async function totalDisplay (cartList) {
    let totalQuantityContainer = document.getElementById("totalQuantity"),
        totalPriceContainer = document.getElementById("totalPrice"),
        total = {
            quantity: 0,
            price: 0
        };
    
    if (cartList.length === 0)  {
        let message = document.createElement("h2"),
            section = document.getElementById("cart__items");

        message.textContent = "Votre panier est vide";
        section.appendChild(message);

        totalQuantityContainer.textContent = total.quantity
        totalPriceContainer.textContent = total.price;
    }
    else {
        for(let cartProduct of cartList) {
            let product = await getProduct(cartProduct.id);
            total.quantity += cartProduct.quantity;
            total.price += product.price * cartProduct.quantity;
        }
        totalQuantityContainer.textContent = total.quantity;
        totalPriceContainer.textContent = total.price;
    }
}

// Permet de modifier la quantité d'un produit du panier à partir d'un évènement
function modifyQuantity (event, cartList, newQuantity) {
    let id = event.target.closest("article").dataset.id,
        color = event.target.closest("article").dataset.color;

    if (newQuantity <= 0 || newQuantity > 100) {
        alert("Veuillez choisir un nombre d'article(s) entre 1 et 100");
    }
    else {
        for (let cartProduct of cartList) {
            if (id === cartProduct.id && color === cartProduct.color) {
                cartProduct.quantity = parseInt(newQuantity);
                localStorage.cartList = JSON.stringify(cartList);
            }
        }
        totalDisplay(cartList)
    }
}

// Permet de supprimer un produit du panier à partir d'un évènement
function deleteItem (event, cartList) {
    let article = event.target.closest("article"),
        id = event.target.closest("article").dataset.id,
        color = event.target.closest("article").dataset.color;
    
    article.remove();
    for (let cartIndex in cartList) {
        if (id === cartList[cartIndex].id && color === cartList[cartIndex].color) {
            cartList.splice(cartIndex, 1);
            localStorage.cartList = JSON.stringify(cartList);
        }
    }
    totalDisplay(cartList);
}

function submitOrder(event, cartList) {
    event.preventDefault();
    let orderTab = [];
    for (let cartProduct of cartList) {
        orderTab.push(cartProduct.id);
    }

    let contact= {
        firstName: document.getElementById("firstName").value,
        lastName: document.getElementById("lastName").value,
        address: document.getElementById("address").value,
        city: document.getElementById("city").value,
        email: document.getElementById("email").value
    };

    let nameTest = /[^\wàâäàéèêëùûüôòöîìïÿç-]|[\d]/,
        cityTest = /[^ '\wàâäàéèêëùûüôòöîìïÿç-]|[\d]/,
        addressTest = /^([\D])|([^ '\wàâäàéèêëùûüôòöîìïÿç-])/,
        emailTest = /(@)(.+)$/

    if (nameTest.test(contact.firstName) || contact.firstName === "") {
        document.getElementById("firstNameErrorMsg").textContent = "Veuillez entrer un prénom valide";
    };
    if (nameTest.test(contact.lastName) || contact.lastName === "") {
        document.getElementById("lastNameErrorMsg").textContent = "Veuillez entrer un nom valide";
    };
    if (addressTest.test(contact.address) || contact.address === "") {
        document.getElementById("addressErrorMsg").textContent = "Veuillez entrer une addresse valide";
    };
    if (cityTest.test(contact.city) || contact.city === "") {
        document.getElementById("cityErrorMsg").textContent = "Veuillez entrer un nom de ville valide";
    };
    if (emailTest.test(contact.email) === false || contact.email === "") {
        document.getElementById("emailErrorMsg").textContent = "Veuillez entrer une adresse mail valide";
    };
    
}

// Fonction principale
async function main () {
    let cartList = getCartList(),
        cartItems = document.getElementsByClassName("cart__item");

    await cartCreator(cartList);
    totalDisplay(cartList);

    for (let item of cartItems) {
        item.getElementsByClassName("itemQuantity")[0].addEventListener("change", function(event) {
            modifyQuantity(event, cartList, this.value);
        });
        item.getElementsByClassName("deleteItem")[0].addEventListener("click", function(event) {
            deleteItem(event, cartList);
        });
    }

    document.getElementById("order").addEventListener("click", function(event) {
        submitOrder(event, cartList);
    });
}

main();