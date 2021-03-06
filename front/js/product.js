
// Lance une requête HTTP et retourne une promesse munie des données parsées récupérées
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

// Récupère la valeur du paramètre id dans l'url de la page
function getUrlId () {
    let href = window.location.href,
        url = new URL(href),
        id = url.searchParams.get("id");
    return id;
}

// Permet de récupérer un élément du DOM avec son id sans devoir taper "document.getElementById"
function getElement (element) {
    return document.getElementById(element);
}

// Permet d'attribuer plusieurs attributs à la fois
function setAttributes(element, attributes) {
    for (let key in attributes) {
        element.setAttribute(key, attributes[key]);
    }
}

// Créé le contenu de la page produit
function productCreator (object) {
    let pageTitle = document.querySelector("title"),
        imgContainer = document.getElementsByClassName("item__img"),
        titleContainer = getElement("title"),
        priceContainer = getElement("price"),
        descriptionContainer = getElement("description"),
        optionsContainer = getElement("colors"),
        image = document.createElement("img");

    pageTitle.textContent = object.name;

    setAttributes(image, {"src": object.imageUrl, "alt": object.altTxt});
    imgContainer[0].appendChild(image);

    titleContainer.textContent = object.name;
    priceContainer.textContent = object.price;
    descriptionContainer.textContent = object.description;
    description.textContent = object.description;

    for(let color of object.colors) {
        let option = document.createElement("option");
        option.setAttribute("value", color);
        option.textContent = color;
        optionsContainer.appendChild(option);
    }
}

// Vérifie la validité de la liste de produits récupérée, la réinitialise et recharge la page en cas d'erreur
async function checkCartList(list) {
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
        list = await checkCartList(list);
    }
    return list;
}

// Vérifie la sélection de l'utilisateur et ajoute le(s) produit(s) choisi(s) dans la liste du panier
async function addProduct(productId) {
    let colorSelected = getElement("colors").value,
        quantitySelected = parseInt(getElement("quantity").value);
    
    if (colorSelected === "") {
        alert("Veuillez choisir une couleur");
    }
    else if (quantitySelected <= 0 || quantitySelected > 100) {
        alert("Veuillez choisir un nombre d'article entre 1 et 100");
    }
    else {
        let productSelected = {
                id : productId,
                color : colorSelected,
                quantity : quantitySelected
            },
            cartList = await getCartList(),
            productAdded = false;
        
        for (cartProduct of cartList) {
            if (productSelected.id === cartProduct.id && productSelected.color === cartProduct.color) {
                if (cartProduct.quantity + productSelected.quantity > 100) {
                    alert("Le nombre d'article total pour un produit doit être compris entre 1 et 100.\
                        \nVous avez déjà "+cartProduct.quantity+" articles correspondant au modèle et à la couleur choisie dans votre panier.");
                    return;
                }
                else {
                    cartProduct.quantity += productSelected.quantity;
                    productAdded = true;
                }
            }
        }
        if (productAdded === false) {
            cartList.push(productSelected);
        }
        localStorage.cartList = JSON.stringify(cartList);
        quantitySelected === 1 ? alert("Le produit a été ajouté au panier") : alert("Les produits ont été ajoutés au panier");
    }
}

// Fonction principale
async function main () {
    let id = getUrlId(),
        product = await getProduct(id);
    productCreator(product);

    getElement("addToCart").addEventListener("click", function() {
        addProduct(id)
    });
}

main();