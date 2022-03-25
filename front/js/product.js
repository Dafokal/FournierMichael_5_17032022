
// Lance une requête HTTP et retourne une promesse munie des données parsées récupérées
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

// Récupère le paramètre id dans l'url de la page
function getUrlId () {
    let href = window.location.href,
        url = new URL(href),
        id = url.searchParams.get("id");
    return id;
}

// Permet de récupérer un élément du DOM avec son id sans devoir taper "document.getElementById"
function getElement (element) {
    return document.getElementById (element);
}

// Permet d'attribuer plusieurs attributs à la fois
function setAttributes(element, attributes) {
    for (let key in attributes) {
        element.setAttribute(key, attributes[key]);
    }
}

// Créé le contenu de la page produit
function productCreator (object) {
    let pageTitle = document.querySelector("title");
        imgContainer = document.getElementsByClassName("item__img"),
        titleContainer = getElement("title"),
        priceContainer = getElement("price"),
        descriptionContainer = getElement("description"),
        optionsContainer = getElement("colors")
        image = document.createElement("img");

    pageTitle.textContent = object.name;

    setAttributes(image, {"src": object.imageUrl, "alt": object.name});
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

// Fonction principale
async function main () {
    let id = getUrlId(),
        product = await getProduct(id);
    productCreator(product);
}

main();