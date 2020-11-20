//
const db = firebase.firestore();

// Variable btnLogOut que captura el boton 'Salir' para el logout del usuario
var btnLogOut = document.getElementById('btnLogOut');
var idLogoutBtnMovil = document.getElementById('idLogoutBtnMovil');

//
var idRegistrarDocenteBtn = document.getElementById('idRegistrarDocenteBtn');
var idListaDocentesBtn = document.getElementById('idListaDocentesBtn');

var idCurrentImageh5 = document.getElementById('idCurrentImageh5');

var defaultImageForm = document.getElementById('defaultImageForm');

// Funcion getUsers() que recupera los datos guardados en la base de datos de firebase, en la coleccion 'lms-roles'
const getUsers = () => db.collection('lms-roles').get();

// Funcion getOptions() que recupera los datos guardados en la base de datos de firebase, en la coleccion 'lms-roles'
const getOptions = () => db.collection('lms-opciones').get();

    
const saveDefectImage = (defaultImageName, defaultImageUrl) => db.collection("lms-opciones").doc("I15m4a89g618E37rd5WQ").set({
        defaultImageName,
        defaultImageUrl,
    })
    .then(function() {
        console.log("Document successfully written!");
        location.reload();
    })
    .catch(function(error) {
        console.error("Error writing document: ", error);
    });

// Fucnion currentImage que muestra el nombre de la imagen por defecto si existe una imagen por defecto
currentImage = async function () {
    const currentDefaultImage = await getOptions();
    if (currentDefaultImage.docs[0]) {
        console.log('existe registro');
        if (currentDefaultImage.docs[0].data().defaultImageName) {
            console.log('existe');
            idCurrentImageh5.textContent = currentDefaultImage.docs[0].data().defaultImageName;
        } else {
            console.log('noexiste');
            idCurrentImageh5.textContent = 'No hay imagen por defecto';
        }
    } else {
        console.log('no existe registro');
        idCurrentImageh5.textContent = 'No existe registro';
    }
    
}

uploadImageFile = function(){
    var defaultImageFile = defaultImageForm['inputDefaultImage'].files[0];
    console.log(defaultImageFile);
    if (!defaultImageFile) {
        alert('Seleccione una imagen')
    }else{

        var storageDocRef = storage.ref('/lmsImages/'+defaultImageFile.name)
        var uploadFile = storageDocRef.put(defaultImageFile);
        uploadFile.on('state_changed', function (snapshot) {
            
        }, function (error) {
            console.log(error);

        }, function () {
                
            console.log('Documento subido');
            uploadFile.snapshot.ref.getDownloadURL().then(function (url) {
                console.log(url);
                console.log(defaultImageFile.name);

                saveDefectImage(defaultImageFile.name, url);
                // saveDocuments(defaultImageFile.name, refid, url, 'pdf', 'documentCV');
                
            })
        });
    }
};

// Funcion initApp() utilizada para verificar si un usuario esta autenticado
function initApp() {
    // var state;
    firebase.auth().onAuthStateChanged(async function(user) {    
        if (user) {
            document.getElementById('dropdown1Text').textContent = user.displayName;
            idDropdown.setAttribute('style', '');
            var userRol = '';
            var userEnable = false;
            await db.collection("lms-roles").where("idUser", "==", user.uid)
            .get()
            .then(function(querySnapshot) {
                querySnapshot.forEach(function(doc1) {
                    userRol = doc1.data().rolName;
                    userEnable = doc1.data().userEnable;
                });                
            })
            .catch(function(error) {
                console.log("Error getting documents: ", error);
            });

            console.log('User is signed in', user.displayName, userRol);
            if (userEnable == true) {
                if (userRol!='Administrador') {
                    location.href = 'listaDocentes.html'
                } else {
                    idRegistrarDocenteBtn.setAttribute('style', '');
                    idListaDocentesBtn.setAttribute('style', '');
                            
                }
                
            }else{
                location.href = 'deshabilitado.html';
            }
            
            
        } else {
            console.log('User is signed out');
            
            location.href = 'index.html';
        }
    });

    // Funcion que se ejecuta cuando se realice un evento 'click' en el boton de salir o logout
    btnLogOut.addEventListener('click', (e) => {

        // Se ejecuta la funcion signOut() de firebase para el logout del usuario
         firebase.auth().signOut().then(function() {
            console.log('Log out successful');
             // Sign-out successful.
            }).catch(function(error) {
            // An error happened.
        });
    });
    idLogoutBtnMovil.addEventListener('click', (e) => {

        // Se ejecuta la funcion signOut() de firebase para el logout del usuario
         firebase.auth().signOut().then(function() {
            console.log('Log out successful');
             // Sign-out successful.
            }).catch(function(error) {
            // An error happened.
        });
    });

    // Se realiza el guardado de la imagen por defecto en la coleccion 'lms-opciones'
    defaultImageForm.addEventListener('submit', (e) => {
        e.preventDefault();
        uploadImageFile();
    });
}

// Funcion que se ejecuta mediante el evento 'DOMContentLoaded' (el documento listaUsuarios.html a sido cargado)
window.addEventListener('DOMContentLoaded', (e) => {
    initApp();
    
    currentImage();

    // Inicializa el modal para mostrase despues de realizar alguna funcion que requiera del modal
    $('.modal').modal();
})