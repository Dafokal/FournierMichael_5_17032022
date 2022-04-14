
function httpRequest(method, route, data) {
    return new Promise ((resolve, reject) => {
        var request = new XMLHttpRequest();
        request.open(method, "http://localhost:3000/api/products/" + route);
        if (method === "POST") {
            request.setRequestHeader("Content-Type","application/json");
        }
        request.onload = function() {
            if (this.status === 200 || this.status === 201){    // Si la requête à fonctionnée
                var response = JSON.parse(this.responseText);
                resolve(response);
            } else {                    // Si la requête à échouée
                var response = console.log("HTTPRequest responded with "+this.status);
                reject(response);
            }
        };
        request.send(data);
    })
}

// Retourne le produit demandé
async function getProduct(productId) {
    let method = "GET",
        route = productId,
        data = ""
    let object =  await httpRequest(method, route, data);
    return object;
}

// Envoie la commande
async function postOrder(order) {
    let method = "POST",
        route = "order",
        data = order;
    let object =  await httpRequest(method, route, data);
    return object;
}

// Vérifie la validité de la liste de produits récupérée, réinitialise et recharge la page en cas d'erreur
async function testCartList(list) {
    try{
        list = JSON.parse(list);
        for (let product of list) {
            if (product.id === "") {
                throw "Empty ID";
            }
            let testId = await getProduct(product.id).catch(function(){
                throw "ID not found";
            })
        }
    }
    catch (error) {
        alert("Données du panier invalides.\n"+error);
        localStorage.removeItem("cartList");
        window.location.reload();
        return;
    }
    return list;
}

// Récupère ou initialise la liste de produits du panier
async function getCartList() {
    let list = localStorage.cartList;
    if (list === undefined) {
        list = [];
    }
    else {
        list = await testCartList(list);
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

function testForm(form) {
    let nameTest = /[^\wàâäàéèêëùûüôòöîìïÿç-]|[\d]/,
        cityTest = /[^ '\wàâäàéèêëùûüôòöîìïÿç-]|[\d]/,
        addressTest = /^([\D])|([^ '\wàâäàéèêëùûüôòöîìïÿç-])/,
        emailTest = /(@)(.+)$/,
        trigger = false;

    const firstNameErrorMsg = document.getElementById("firstNameErrorMsg"),
        lastNameErrorMsg = document.getElementById("lastNameErrorMsg"),
        addressErrorMsg = document.getElementById("addressErrorMsg"),
        cityErrorMsg = document.getElementById("cityErrorMsg"),
        emailErrorMsg = document.getElementById("emailErrorMsg");
    
    firstNameErrorMsg.textContent = "";
    lastNameErrorMsg.textContent = "";
    addressErrorMsg.textContent = "";
    cityErrorMsg.textContent = "";
    emailErrorMsg.textContent = "";

    if (nameTest.test(form.firstName) || form.firstName === "") {
        firstNameErrorMsg.textContent = "Veuillez entrer un prénom valide";
        trigger = true;
    }
    if (nameTest.test(form.lastName) || form.lastName === "") {
        lastNameErrorMsg.textContent = "Veuillez entrer un nom valide";
        trigger = true;
    }
    if (addressTest.test(form.address) || form.address === "") {
        addressErrorMsg.textContent = "Veuillez entrer une addresse valide";
        trigger = true;
    }
    if (cityTest.test(form.city) || form.city === "") {
        cityErrorMsg.textContent = "Veuillez entrer un nom de ville valide";
        trigger = true;
    }
    if (emailTest.test(form.email) === false || form.email === "") {
        emailErrorMsg.textContent = "Veuillez entrer une adresse mail valide";
        trigger = true;
    }

    if (trigger === false) {
        return true;
    }
    else {
        return false;
    }
}

async function submitOrder(event) {
    event.preventDefault();

    let cartList = await getCartList(),
        form= {
            firstName: document.getElementById("firstName").value,
            lastName: document.getElementById("lastName").value,
            address: document.getElementById("address").value,
            city: document.getElementById("city").value,
            email: document.getElementById("email").value
        };

    if (testForm(form) === true) {
        let orderTab = [];
        for (let cartProduct of cartList) {
            orderTab.push(cartProduct.id);
        }

        if (orderTab.length > 0) {
            let order = {
                contact: form,
                products: orderTab
                },
                postData = await postOrder(JSON.stringify(order)),
                orderId = postData.orderId;
            
            window.location = "/front/html/confirmation.html?orderId=" + orderId;
        }
        else {
            alert("Votre panier est vide.");
        }
    }
    
}

// Fonction principale
async function main () {
    let cartList = await getCartList(),
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
        submitOrder(event);
    });
}

main();