
function httpRequest(method, id) {
    return new Promise ((resolve, reject) => {
        var request = new XMLHttpRequest();
        request.open(method, "http://localhost:3000/api/products/" + id);
        request.onload = function() {
            if (this.status == 200){    // Si la requête à fonctionnée
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
        id = productId;
    let object =  await httpRequest(method, id);
    return object;
}

// Récupère ou initialise la liste de produits du panier
function getCartList() {
    let list = localStorage.cartList;
    if (list == undefined) {
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

async function cartCreator (cartList) {
    let section = document.getElementById("cart__items"),
        totalQuantity = document.getElementById("totalQuantity"),
        totalPrice = document.getElementById("totalPrice"),
        total = {
            quantity: 0,
            price: 0
        };

    if (cartList.length == 0)  {
        let message = document.createElement("h2");
        message.textContent = "Votre panier est vide";
        section.appendChild(message);
    }
    else {
        for(let cartProduct of cartList) {
            let product = await getProduct(cartProduct.id),
                article = document.createElement("article");
    
            setAttributes(article, {
                "class": "cart__item",
                "data-id": cartProduct.id,
                "data-color": cartProduct.color
            })
    
            article.innerHTML = '\
            <div class="cart__item__img">\
                <img src="'+product.imageUrl+'" alt="Photographie '+product.name+'" />\
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
            '
            section.appendChild(article);

            total.quantity += cartProduct.quantity;
            total.price += product.price * cartProduct.quantity;
        }
    }
    totalQuantity.textContent = total.quantity;
    totalPrice.textContent = total.price;
}

// Fonction principale
async function main () {
    let cartList = getCartList();
    cartCreator(cartList);
}

main();