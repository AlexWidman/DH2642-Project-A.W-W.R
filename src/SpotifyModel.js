import {searchSpotify, getSongDetails} from "../src/spotifySource.js";
import resolvePromise from "../src/resolvePromise.js";

class SpotifyModel{
    constructor(songArray=[]){
        this.observers = [];
        this.songs= songArray;
        this.firstSong = null;
        this.secondSong = null;
        this.searchResultsPromiseState= {};
        this.searchParams= {};
        this.firstSongPromiseState= {};
        this.secondSongPromiseState= {};
    }

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
        resolvePromise(getSongDetails(id), this.firstSongPromiseState, notifyACB.bind(this));
    }

    setSecondSong(id){
        function notifyACB(){ this.notifyObservers(); }
        if (id === undefined){ return; }
        if (this.secondSong === id){ return; }
        this.secondSong = id
        this.notifyObservers({songID: id});
        resolvePromise(getSongDetails(id), this.secondSongPromiseState, notifyACB.bind(this));
    }

    setSearchQuery(q){
        this.searchParams.query= q;
    }

    setSearchType(t){
        this.searchParams.type= t;
    }

    doSearch(queryAndType){
        function notifyACB(){ this.notifyObservers(); }
        resolvePromise(searchSpotify(queryAndType), this.searchResultsPromiseState, notifyACB.bind(this));
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