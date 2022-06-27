// Fonctionne avec fichier xls ou xlsx

//chargement librairies xlsx et https
const xlsx = require("xlsx");

const fs = require('fs');
const request = require('request');

function download(url, dest, cb) {
    // on créé un stream d'écriture qui nous permettra
    // d'écrire au fur et à mesure que les données sont téléchargées
    const file = fs.createWriteStream(dest);

    // on lance le téléchargement
    const sendReq = request.get(url);

    // on vérifie la validité du code de réponse HTTP
    sendReq.on('response', (response) => {
        if (response.statusCode !== 200) {
            return cb('Response status was ' + response.statusCode);
        }
    });

    // au cas où request rencontre une erreur
    // on efface le fichier partiellement écrit
    // puis on passe l'erreur au callback
    sendReq.on('error', (err) => {
        fs.unlink(dest);
        cb(err.message);
    });

    // écrit directement le fichier téléchargé
    sendReq.pipe(file);

    // lorsque le téléchargement est terminé
    // on appelle le callback
    file.on('finish', () => {
        // close étant asynchrone,
        // le cb est appelé lorsque close a terminé
        file.close(cb);
    });

    // si on rencontre une erreur lors de l'écriture du fichier
    // on efface le fichier puis on passe l'erreur au callback
    file.on('error', (err) => {
        // on efface le fichier sans attendre son effacement
        // on ne vérifie pas non plus les erreur pour l'effacement
        fs.unlink(dest);
        cb(err.message);
    });
};

// URL of the file
const url_to_download = 'https://api.notarly.fr/vault/aDBu5cfU/Fos3gbw5Ufb_YSnwpSLWjdh6aaQ/4UBPeQ../Format+des+donn%C3%A9es+attendu.xlsx';
const path_file_downloaded = './downloadedfiles';


download(url_to_download, './downloadedfiles/fichier1.xlsx', (err) => {
    if (err) {
        console.error(err);
        return;
    }

    console.log('Téléchargement terminé !');
})




//Lecture du fichier excel
//const wb = xlsx.readFile(fichier.data);
const wb = xlsx.readFile('./downloadedfiles/fichier1.xlsx');
/*Débug
//console.log(Object.keys(wb));
//console.log(wb.SheetNames);
//console.log(wb.Sheets);*/


//Lecture de la feuille 0 du fichier recuperé
const sheetName = wb.SheetNames[0];
const ws = wb.Sheets[sheetName];
/* Debug
console.log(ws); */

//Conversion de la donnée en format json
const json =  xlsx.utils.sheet_to_json(ws);
// Debug
console.log(json);




console.log("hello world");



  
