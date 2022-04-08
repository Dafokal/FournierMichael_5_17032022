
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

// Retourne la liste des produits
async function getAllProducts() {
    let method = "GET",
        route = "";
    let list =  await httpRequest(method, route);
    return list;
}

// Permet de créer un élément sans devoir taper "document."
function createElement (element) {
    return document.createElement (element);
}

// Permet d'attribuer plusieurs attributs à la fois
function setAttributes(element, attributes) {
    for (let key in attributes) {
        element.setAttribute(key, attributes[key]);
    }
}

// Créé le DOM de la page d'accueil
function productsCreator (productsList) {
    for(let object of productsList) {

        let section = document.getElementById("items"),
            linkContainer = createElement ("a"),
            article = createElement("article"),
            image = createElement("img"),
            title = createElement("h3"),
            description = createElement("p");

        linkContainer.setAttribute("href", "./product.html?id="+object._id);
        setAttributes(image, {"src": object.imageUrl, "alt": object.altTxt});
        title.setAttribute("class", "productName");
        title.textContent = object.name;
        description.setAttribute("class", "productDescription");
        description.textContent = object.description;

        article.append(image, title, description)
        linkContainer.appendChild(article);

        section.appendChild(linkContainer);
    }
}

// Fonction principale
async function main() {
    let productList = await getAllProducts();   // On récupère la liste des produits
    productsCreator(productList);               // On créé le DOM de la page d'accueil
}

main();