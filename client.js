/* ******************************************************************
 * Constantes de configuration
 */
const apiKey = "a5ab11dd-241f-4ca7-9726-06723117dd5f";
const serverUrl = "https://lifap5.univ-lyon1.fr";



/* ******************************************************************
 * Gestion des tabs "Voter" et "Toutes les citations"
 ******************************************************************** */

/**
 * Affiche/masque les divs "div-duel" et "div-tout"
 * selon le tab indiqué dans l'état courant.
 *
 * @param {Etat} etatCourant l'état courant
 */
function majTab(etatCourant) {
  console.log("CALL majTab");
  const dDuel = document.getElementById("div-duel");
  const dTout = document.getElementById("div-tout");
  const tDuel = document.getElementById("tab-duel");
  const tTout = document.getElementById("tab-tout");
  if (etatCourant.tab === "duel") {
    dDuel.style.display = "flex";
    tDuel.classList.add("is-active");
    dTout.style.display = "none";
    tTout.classList.remove("is-active");
  } else {
    dTout.style.display = "flex";
    tTout.classList.add("is-active");
    dDuel.style.display = "none";
    tDuel.classList.remove("is-active");
  }
}

/**
 * Fonction qui permet d'afficher les citations et de filtrer selon le contenu dans le champ recherche
 *
 * @param {Etat} etatCourant l'état courant
 */
function remplirCit(id){
  document.getElementById("body-citation").innerHTML = " "
  const recherche = document.getElementById("recherche").value
  fetch(serverUrl + "/citations")
    .then(res => res.json())
    .then(data => {
      console.log(data)
      function filtreTexte(arr, recherche) {
        return arr.filter(function(el) {
          if(id == "boutonttecitation")
            return el.quote.toLowerCase().indexOf("".toLowerCase()) !== -1;
          else if (id == "filtrepers")
            return el.character.toLowerCase().indexOf(recherche.toLowerCase()) !== -1;
          else if (id == "filtrecit")
            return el.quote.toLowerCase().indexOf(recherche.toLowerCase()) !== -1;
          })}
      const data_filter = filtreTexte(data, recherche) 
      console.log(data_filter)
      const str = Object.entries(data_filter).map(n => {
         return `<tr><th>X</th><td>${n[1].character}</td><td>${n[1].quote}</td>
         <td><input class="button" onclick = "detail('${n[1]._id}')" type="button" 
         value="Détail"></input></td></</tr>`});
      document.getElementById("body-citation").innerHTML += str.join(" ")
})} 

/**
 * Fonction qui affiche des citations aléatoire à chaque fois que la page s'actualise
 */
function citAlea(){
  fetch(serverUrl + "/citations")
  .then(res => res.json())
  .then(data => {
    const longueur = data.length;
    const id = Object.entries(data).map(n => {
      return n[1]._id});
    const alea = Math.floor(Math.random() * longueur)
    fetch(serverUrl + "/citations/" + id[alea])
      .then(resp => resp.json())
      .then(data => {
        document.getElementById("titre-cita").innerHTML = data.quote
        document.getElementById("perso-origine").innerHTML = `${data.character} dans ${data.origin}`
        if (data.characterDirection == "Right")
          document.getElementById("img").style = "transform: scaleX(-1)"
        document.getElementById("img").src = data.image
      })
      const alea2 = Math.floor(Math.random() * longueur)
      fetch(serverUrl + "/citations/" + id[alea2])
        .then(resp => resp.json())
        .then(data => {
          document.getElementById("titre-cita2").innerHTML = data.quote
          document.getElementById("perso-origine2").innerHTML = `${data.character} dans ${data.origin}`
          if (data.characterDirection == "Left")
            document.getElementById("img2").style = "transform: scaleX(-1)"
          document.getElementById("img2").src = data.image
        }
)})}
citAlea();

/**
 * Fonction détail qui affiche dans une fenetre modale la citation, le personnage,etc...
 * @param {id} id identifiant de la citation 
 */
function detail(id){
  clic()
  fetch(serverUrl + "/citations/" + id)
  .then(res => res.json())
  .then(data => {
    document.getElementById("det-citation").innerHTML = "Citation: " + data.quote
    document.getElementById("det-character").innerHTML = "Nom du personnage: "+data.character
    document.getElementById("det-image").src = data.image
    document.getElementById("det-direction").innerHTML = "Direction: "+data.characterDirection
    document.getElementById("det-origin").innerHTML = "Origine: " +  data.origin
      document.getElementById("det-addedBy").innerHTML = "Ajouté par: " + data.addedBy
    })}


/**
 * Fonction qui ajoute une citation au serveur
 */
function Ajoutercitation()
{
  const formcitation = document.getElementById("add-citation").value;
  const formorigin = document.getElementById("add-origin").value;
  const formcharacter = document.getElementById("add-character").value;
  const formdirectionleft = document.getElementById("add-directionleft").value;
  const formimage = document.getElementById("add-image").value;
  if((formcitation | formorigin | formcharacter)== null)
    document.getElementById("resultat").innerHTML = "L'un des champs n'est pas remplit"
  else
  {
    console.log(formdirectionleft)
    fetch(serverUrl + "/citations",
    {
      method: 'POST',
      headers: { "x-api-key": apiKey, 'Content-Type': 'application/json'},
      body: JSON.stringify({ "quote" : formcitation,"origin":formorigin,
      "character":formcharacter,"characterDirection":formdirectionleft,
      "image":formimage } ), })
      .then((r) => r.json())
      .then((data) => {
        data.quote = formcitation
        data.origin = formorigin
        data.character = formcharacter
        console.log(formdirectionleft)
        if(formdirectionleft == "on")
          data.characterDirection = "Left";
          else
          data.characterDirection = "Right";
        data.image = formimage
    })}}

/**
 * Fonction qui ouvre la fenetre modale détail de citation quand on clique sur le bouton détail d'une citation
 */
function clic()
{
  document.getElementById('modal').className = "modal is-active"; 
}

/**
 * Fonction qui ferme la fenetre modale des détail des citations et d'ajout de citation quand on clique sur la croix
 */
function croix()
{
  document.getElementById('modal').className = "modal";
  document.getElementById('modalajout').className = "modal";
}

/**
 * Fenetre qui ouvre la fenetre modale d'ajout de citation quand on clique sur le bouton ajouter une citation 
 */
function fenetreaddcit()
{
  document.getElementById('modalajout').className = "modal is-active";
}


/**
 * fonction connexion qui test une cle API
 */
function testAPI(){
  const APIID = document.getElementById("pass").value;
  const disp = document.getElementById("APICHAMP");
  //const elt5 = document.getElementById("btn-open-login-modal");
  const a = document.getElementById("CONNEXIONBOUT");
  fetch(serverUrl + "/whoami", { headers: { "x-api-key": APIID } })
  .then((response) => response.json())
  .then((jsonData) => {
    if (jsonData.status && Number(jsonData.status) != 200) {
    }
      else {
        disp.innerHTML = "Bonjour " + jsonData.login ;
        a.innerHTML = '<input class="button" type="submit" onclick="history.go(0)" value="Deconnexion"></input>';
      } 
}
  )
}
testAPI();

/**
 * Mets au besoin à jour l'état courant lors d'un click sur un tab.
 * En cas de mise à jour, déclenche une mise à jour de la page.
 *
 * @param {String} tab le nom du tab qui a été cliqué
 * @param {Etat} etatCourant l'état courant
 */
function clickTab(tab, etatCourant) {
  console.log(`CALL clickTab(${tab},...)`);
  if (etatCourant.tab !== tab) {
    etatCourant.tab = tab;
    majPage(etatCourant);
  }
}

/**
 * Enregistre les fonctions à utiliser lorsque l'on clique
 * sur un des tabs.
 *
 * @param {Etat} etatCourant l'état courant
 */
function registerTabClick(etatCourant) {
  console.log("CALL registerTabClick");
  document.getElementById("tab-duel").onclick = () =>
    clickTab("duel", etatCourant);
  document.getElementById("tab-tout").onclick = () =>
    clickTab("tout", etatCourant);
}

/* ******************************************************************
 * Gestion de la boîte de dialogue (a.k.a. modal) d'affichage de
 * l'utilisateur.
 * ****************************************************************** */

/**
 * Fait une requête GET authentifiée sur /whoami
 * @returns une promesse du login utilisateur ou du message d'erreur
 */
function fetchWhoami() {
  return fetch(serverUrl + "/whoami", { headers: { "x-api-key": apiKey } })
    .then((response) => response.json())
    .then((jsonData) => {
      if (jsonData.status && Number(jsonData.status) != 200) {
        return { err: jsonData.message };
      }
      return jsonData;
    })
    .catch((erreur) => ({ err: erreur }));
}

/**
 * Fait une requête sur le serveur et insère le login dans
 * la modale d'affichage de l'utilisateur.
 *
 * @param {Etat} etatCourant l'état courant
 * @returns Une promesse de mise à jour
 */
function lanceWhoamiEtInsereLogin(etatCourant) {
  return fetchWhoami().then((data) => {
    etatCourant.login = data.login; // qui vaut undefined en cas d'erreur
    etatCourant.errLogin = data.err; // qui vaut undefined si tout va bien
    majPage(etatCourant);
    // Une promesse doit renvoyer une valeur, mais celle-ci n'est pas importante
    // ici car la valeur de cette promesse n'est pas utilisée. On renvoie
    // arbitrairement true
    return true;
  });
}

/**
 * Affiche ou masque la fenêtre modale de login en fonction de l'état courant.
 * Change la valeur du texte affiché en fonction de l'état
 *
 * @param {Etat} etatCourant l'état courant
 */
 function majModalLogin(etatCourant) {
  const modalClasses = document.getElementById("mdl-login").classList;
  if (etatCourant.loginModal) {
    modalClasses.add("is-active");
    const elt = document.getElementById("elt-affichage-login");

    const ok = etatCourant.login !== undefined;
    if (!ok) {
      elt.innerHTML = `<span class="is-error">${etatCourant.errLogin}</span>`;
    } else {
      elt.innerHTML = `Bonjour ${etatCourant.login}.`;
    }
  } else {
    modalClasses.remove("is-active");
  }
}
/**
 * Déclenche l'affichage de la boîte de dialogue du nom de l'utilisateur.
 * @param {Etat} etatCourant
 */
function clickFermeModalLogin(etatCourant) {
  etatCourant.loginModal = false;
  majPage(etatCourant);
}

/**
 * Déclenche la fermeture de la boîte de dialogue du nom de l'utilisateur.
 * @param {Etat} etatCourant
 */
function clickOuvreModalLogin(etatCourant) {
  etatCourant.loginModal = true;
  lanceWhoamiEtInsereLogin(etatCourant);
  majPage(etatCourant);
}

/**
 * Enregistre les actions à effectuer lors d'un click sur les boutons
 * d'ouverture/fermeture de la boîte de dialogue affichant l'utilisateur.
 * @param {Etat} etatCourant
 */
function registerLoginModalClick(etatCourant) {
  document.getElementById("btn-close-login-modal1").onclick = () =>
    clickFermeModalLogin(etatCourant);
  document.getElementById("btn-close-login-modal2").onclick = () =>
    clickFermeModalLogin(etatCourant);
  document.getElementById("btn-open-login-modal").onclick = () =>
    clickOuvreModalLogin(etatCourant);
}



  




/* ******************************************************************
 * Initialisation de la page et fonction de mise à jour
 * globale de la page.
 * ****************************************************************** */

/**
 * Mets à jour la page (contenu et événements) en fonction d'un nouvel état.
 *
 * @param {Etat} etatCourant l'état courant
 */
function majPage(etatCourant) {
  console.log("CALL majPage");
  majTab(etatCourant);
  majModalLogin(etatCourant);
  registerTabClick(etatCourant);
  registerLoginModalClick(etatCourant);
}

/**
 * Appelé après le chargement de la page.
 * Met en place la mécanique de gestion des événements
 * en lançant la mise à jour de la page à partir d'un état initial.
 */
function initClientCitations() {
  console.log("CALL initClientCitations");
  const etatInitial = {
    tab: "duel",
    loginModal: false,
    login: undefined,
    errLogin: undefined,
  };
  majPage(etatInitial);
}

// Appel de la fonction init_client_duels au après chargement de la page
document.addEventListener("DOMContentLoaded", () => {
  console.log("Exécution du code après chargement de la page");
  initClientCitations();
});
