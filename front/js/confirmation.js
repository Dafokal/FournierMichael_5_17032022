
// Récupère la valeur du paramètre orderId dans l'url de la page
function getUrlorderId () {
    let href = window.location.href,
        url = new URL(href),
        orderId = url.searchParams.get("orderId");
    return orderId;
}

// Fonction principale
function main () {
    let orderId = getUrlorderId();
    document.getElementById("orderId").textContent = orderId;
}

main();