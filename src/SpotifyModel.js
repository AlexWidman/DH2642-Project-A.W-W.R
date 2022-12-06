import {searchSongs, getSongDetails} from "../src/spotifySource.js";
import resolvePromise from "../src/resolvePromise.js";

class SpotifyModel{
    constructor(nrGuests=2, songArray=[]){
        this.observers = [];
        this.setNumberOfGuests(nrGuests);
        this.songs= songArray;
        this.firstSong = null;
        this.secondSong = null;
        this.searchResultsPromiseState= {};
        this.searchParams= {};
        this.currentDishPromiseState= {};
    }

    /*
    setNumberOfGuests(nr){
        const prevNumber = this.numberOfGuests; //to store previous number for observer before numberOfGuests is changed
        
        if (nr < 1 || !Number.isInteger(nr)){
            throw new Error("number of guests not a positive integer");
        }
        this.numberOfGuests = nr;

        if (prevNumber !== nr){
            this.notifyObservers({setGuests: nr})
        }
    }*/

    addToPlaylist(songToAdd){
        if (!this.songs.some(song => song.id === songToAdd.id)){
            this.songs= [...this.songs, songToAdd];
            this.notifyObservers({addSong: songToAdd});
        }
    }
    
    removeFromPlaylist(songToRemove){
        function hasSameIdCB(song){
            return song.id !== songToRemove.id;
        }
        function findSongCB(song){
            return song.id === songToRemove.id;
        }
        if (this.songs.find(findSongCB)){
            this.songs= this.songs.filter(hasSameIdCB);
            this.notifyObservers({removeSongs: songToRemove});
        }
    }

    setFirstSong(id){
        function notifyACB(){ this.notifyObservers(); }
        if (id === undefined){ return; }
        if (this.firstSong === id){ return; }
        this.firstSong = id
        this.notifyObservers({songID: id});
        resolvePromise(getSongDetails(id), this.currentSongPromiseState, notifyACB.bind(this));
    }

    setSecondSong(id){
        function notifyACB(){ this.notifyObservers(); }
        if (id === undefined){ return; }
        if (this.secondSong === id){ return; }
        this.secondSong = id
        this.notifyObservers({songID: id});
        resolvePromise(getSongDetails(id), this.currentSongPromiseState, notifyACB.bind(this));
    }

    setSearchQuery(q){
        this.searchParams.query= q;
    }

    setSearchType(t){
        this.searchParams.type= t;
    }

    doSearch(queryAndType){
        function notifyACB(){ this.notifyObservers(); }
        resolvePromise(searchDishes(queryAndType), this.searchResultsPromiseState, notifyACB.bind(this));
    }

    addObserver(callback){
        this.observers = [...this.observers, callback];
    }

    removeObserver(callback){
        function isSameCallbackCB(cb){ return cb !== callback; }
        this.observers = this.observers.filter(isSameCallbackCB);
    }

    notifyObservers(payload){
        function invokeObserverCB(obs){ obs(payload); }
        try{ this.observers.forEach(invokeObserverCB); }
        catch(err){ console.error(err); }
    }
}

export default SpotifyModel;