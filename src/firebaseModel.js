import SpotifyModel from "./SpotifyModel.js";
import { getSongDetails } from "./SpotifySource.js";
import firebaseConfig from "./firebaseConfig.js";

// Initialise firebase
firebase.initializeApp(firebaseConfig);
const Dbase = getDatabase();
const REF = "SpotifyModel31"

function observerRecap(model) {
    function checkPayload(payload) {
        console.log(payload)
    }
    model.addObserver(checkPayload)
}

function firebaseModelPromise() {
    function makeBigPromiseACB(firebaseData) {
        if (!firebaseData.val() || Object.keys(firebaseData.val()).length === 0) { return new SpotifyModel(); }
        const songPromiseArray= Object.keys(firebaseData.val().songs || []).map(makeSongPromiseCB);
        function createModelACB(songArray){
            return new SpotifyModel(songArray);
        }
        return Promise.all(songPromiseArray).then(createModelACB);
    }
    function makeSongPromiseCB(songId){
        return getSongDetails(songId);
    }
    return firebase.database().ref(Dbase + REF).once("value").then(makeBigPromiseACB);
}

function updateFirebaseFromModel(model) {
    function observePayloadACB(payload) {
        if (!payload || payload<0 ) { return; }
        
        else if(payload.firstSong){
            firebase.database().ref(Dbase + REF +"/firstSong").set(model.firstSong)
        }
        else if(payload.secondSong){
            firebase.database().ref(Dbase + REF +"/secondSong").set(model.secondSong)
        }
        /*
        else if (payload.addToPlaylist) {
            firebase.database().ref(Dbase + REF +"/songs/"+ payload.addToPlaylist.id).set(payload.addToPlaylist.name)
        }
        else if (payload.removeFromPlaylist) {
            firebase.database().ref(Dbase + REF +"/songs/"+ payload.removeFromPlaylist.id).set(null)
        }    
        */
    }
    model.addObserver(observePayloadACB)
    return;
}
console.log(updateFirebaseFromModel)

function updateModelFromFirebase(model) {
    function songChangedInFirebaseACB(firebaseData){ model.setFirstSong(firebaseData.val());}
    firebase.database().ref(Dbase + REF +"/firstSong").on("value", songChangedInFirebaseACB);

    function songChangedInFirebaseACB(firebaseData){ model.setSecondSong(firebaseData.val());}
    firebase.database().ref(Dbase + REF +"/secondSong").on("value", songChangedInFirebaseACB);

    function songAddedInFirebaseACB(firebaseData){
        function responseSongDataACB(song) {
            model.addToPlaylist(song);
        }
        function fetchSongDataBasedOnID(songId) {
            function checkSongDuplicateCB(song) {
                return song.id === songId;
            }
            return model.songs.find(checkSongDuplicateCB);    
        }
        if (!fetchSongDataBasedOnID(+firebaseData.key)) {
            getSongDetails(+firebaseData.key).then(responseSongDataACB);
        }
    }
    firebase.database().ref(Dbase + REF +"/songs").on("child_added", songAddedInFirebaseACB);

    function songRemovedInFirebaseACB(firebaseData){ model.removeFromMenu({ id: +firebaseData.key });}
    firebase.database().ref(Dbase + REF +"/songs").on("child_removed",  songRemovedInFirebaseACB);
    return;
}
export {observerRecap, firebaseModelPromise, updateFirebaseFromModel, updateModelFromFirebase};