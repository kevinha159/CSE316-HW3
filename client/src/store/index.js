import { createContext, useState } from 'react'
import jsTPS from '../common/jsTPS'
import api from '../api'
import MoveSong_Transaction from './transactions/MoveSong_Transaction';
import AddSong_Transaction from './transactions/AddSong_Transaction';
import DeleteSong_Transaction from './transactions/DeleteSong_Transaction';
import EditSong_Transaction from './transactions/EditSong_Transaction';
export const GlobalStoreContext = createContext({});
/*
    This is our global data store. Note that it uses the Flux design pattern,
    which makes use of things like actions and reducers. 
    
    @author McKilla Gorilla
*/

// THESE ARE ALL THE TYPES OF UPDATES TO OUR GLOBAL
// DATA STORE STATE THAT CAN BE PROCESSED
export const GlobalStoreActionType = {
    CHANGE_LIST_NAME: "CHANGE_LIST_NAME",
    CLOSE_CURRENT_LIST: "CLOSE_CURRENT_LIST",
    CREATE_NEW_LIST: "CREATE_NEW_LIST",
    LOAD_ID_NAME_PAIRS: "LOAD_ID_NAME_PAIRS",
    SET_CURRENT_LIST: "SET_CURRENT_LIST",
    SET_LIST_NAME_EDIT_ACTIVE: "SET_LIST_NAME_EDIT_ACTIVE",
    MARK_LIST_FOR_DELETION: "MARK_LIST_FOR_DELETION",
    MARK_SONG: "MARK_SONG"
}

// WE'LL NEED THIS TO PROCESS TRANSACTIONS
const tps = new jsTPS();

// WITH THIS WE'RE MAKING OUR GLOBAL DATA STORE
// AVAILABLE TO THE REST OF THE APPLICATION
export const useGlobalStore = () => {
    // THESE ARE ALL THE THINGS OUR DATA STORE WILL MANAGE
    const [store, setStore] = useState({
        idNamePairs: [],
        currentList: null,
        newListCounter: 0,
        listNameActive: false,
        markedSongIdx: -1,
        markedSong: null
    });

    // HERE'S THE DATA STORE'S REDUCER, IT MUST
    // HANDLE EVERY TYPE OF STATE CHANGE
    const storeReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            // LIST UPDATE OF ITS NAME
            case GlobalStoreActionType.CHANGE_LIST_NAME: {
                return setStore({
                    idNamePairs: payload.idNamePairs,
                    currentList: payload.playlist,
                    newListCounter: store.newListCounter,
                    listNameActive: false
                });
            }
            // STOP EDITING THE CURRENT LIST
            case GlobalStoreActionType.CLOSE_CURRENT_LIST: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false
                })
            }
            // CREATE A NEW LIST
            case GlobalStoreActionType.CREATE_NEW_LIST: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    newListCounter: store.newListCounter + 1,
                    listNameActive: false
                })
            }
            // GET ALL THE LISTS SO WE CAN PRESENT THEM
            case GlobalStoreActionType.LOAD_ID_NAME_PAIRS: {
                return setStore({
                    idNamePairs: payload,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false
                });
            }
            // PREPARE TO DELETE A LIST
            case GlobalStoreActionType.MARK_LIST_FOR_DELETION: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    markedList: payload
                });
            }

            case GlobalStoreActionType.MARK_SONG: {
                console.log("Marking song " + payload);
                console.log(store.currentList);
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    markedSongIdx: payload.index,
                    markedSong: payload.song
                });
            }

            // UPDATE A LIST
            case GlobalStoreActionType.SET_CURRENT_LIST: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    newListCounter: store.newListCounter,
                    listNameActive: false
                });
            }
            // START EDITING A LIST NAME
            case GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    newListCounter: store.newListCounter,
                    listNameActive: true
                });
            }
            default:
                return store;
        }
    }
    // THESE ARE THE FUNCTIONS THAT WILL UPDATE OUR STORE AND
    // DRIVE THE STATE OF THE APPLICATION. WE'LL CALL THESE IN 
    // RESPONSE TO EVENTS INSIDE OUR COMPONENTS.

    // THIS FUNCTION PROCESSES CHANGING A LIST NAME
    store.changeListName = function (id, newName) {
        // GET THE LIST
        async function asyncChangeListName(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playist;
                playlist.name = newName;
                async function updateList(playlist) {
                    response = await api.updatePlaylistById(playlist._id, playlist);
                    if (response.data.success) {
                        async function getListPairs(playlist) {
                            response = await api.getPlaylistPairs();
                            if (response.data.success) {
                                let pairsArray = response.data.idNamePairs;
                                storeReducer({
                                    type: GlobalStoreActionType.CHANGE_LIST_NAME,
                                    payload: {
                                        idNamePairs: pairsArray,
                                        playlist: playlist
                                    }
                                });
                            }
                        }
                        getListPairs(playlist);
                    }
                }
                updateList(playlist);
            }
        }
        asyncChangeListName(id);
    }

    store.createNewList = function () {
        async function createNewList(){

            console.log("Calling post playlist");
            let res = await api.postPlaylist({
                name:"Untitled " + store.newListCounter,
                songs:[]
            });

            if(res.data.success){
                storeReducer({
                    type: GlobalStoreActionType.CREATE_NEW_LIST,
                    payload: res.data.playlist
                })
                store.history.push("/playlist/" + res.data.playlist._id);
            }
        }
        createNewList();
    }

    store.addSong = function() {
        async function asyncAddSong(){
            let song = {
                artist: "Unknown",
                title: "Untitled",
                youTubeId: "dQw4w9WgXcQ"
            }
            store.currentList.songs.push(song);
            store.putPlaylist();
        }
        asyncAddSong();
    }

    store.insertSong = function (idx, song) {
        async function asyncInsertSong(idx){
            store.currentList.songs.splice(idx, 0, song);
            store.putPlaylist();
        }
        asyncInsertSong(idx);    
    }

    store.deleteSong = function (idx) {
        async function asyncDeleteSong(idx){
            console.log(store.currentList);
            store.currentList.songs.splice(idx, 1)
            store.putPlaylist();
        }
        asyncDeleteSong(idx);
    }

    store.editSong = function (idx, song){
        async function asyncEditSong(song){
            store.currentList.songs.splice(idx, 1, song);
            store.putPlaylist();
        }
        asyncEditSong(song);
    }

    store.moveSong = function(start, end) {
        console.log(store.currentList);
        let temp = store.currentList.songs[start];
        store.currentList.songs[start] = store.currentList.songs[end];
        store.currentList.songs[end] = temp;
        store.putPlaylist();
    }
    store.clearAllTransactions = function(){
        tps.clearAllTransactions();
    }
    store.addMoveSongTransaction = function (start, end){
        let transaction = new MoveSong_Transaction(store, start, end);
        tps.addTransaction(transaction);
    }

    store.addAddSongTransaction = function () {
        let transaction = new AddSong_Transaction(store);
        tps.addTransaction(transaction);
    }

    store.addDeleteSongTransaction = function (idx, song) {
        console.log(store.markedSongIdx);
        console.log(store.markedSong);
        let transaction = new DeleteSong_Transaction(store, store.markedSongIdx, store.markedSong);
        tps.addTransaction(transaction);
    }

    store.addEditSongTransaction = function (idx, oldSong, newSong) {
        let transaction = new EditSong_Transaction(store, idx, oldSong, newSong);
        tps.addTransaction(transaction);
    }

    store.putPlaylist = function () { 
        async function asyncPutPlaylist(){
            const res = await api.putPlaylistById(store.currentList._id, store.currentList);
            if(res.data.success){
                storeReducer({
                    type: GlobalStoreActionType.SET_CURRENT_LIST,
                    payload: store.currentList
                })
                console.log("Put successful");
            }
        }
        asyncPutPlaylist();
    }

    // THIS FUNCTION PROCESSES CLOSING THE CURRENTLY LOADED LIST
    store.closeCurrentList = function () {
        storeReducer({
            type: GlobalStoreActionType.CLOSE_CURRENT_LIST,
            payload: {}
        });
    }


    // THIS FUNCTION LOADS ALL THE ID, NAME PAIRS SO WE CAN LIST ALL THE LISTS
    store.loadIdNamePairs = function () {
        async function asyncLoadIdNamePairs() {
            const response = await api.getPlaylistPairs();
            if (response.data.success) {
                let pairsArray = response.data.idNamePairs;
                storeReducer({
                    type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                    payload: pairsArray
                });
            }
            else {
                console.log("API FAILED TO GET THE LIST PAIRS");
            }
        }
        asyncLoadIdNamePairs();
    }

    store.setCurrentList = function (id) {
        async function asyncSetCurrentList(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                console.log(playlist);

                if (response.data.success) {
                    storeReducer({
                        type: GlobalStoreActionType.SET_CURRENT_LIST,
                        payload: playlist
                    });
                    store.history.push("/playlist/" + playlist._id);
                }
            }
        }
        asyncSetCurrentList(id);
    }

    store.deleteMarkedList = function () {
        async function asyncDeleteListById() {
            let response = await api.deletePlaylistById(store.markedList._id);
            if (response.status === 200) {
                store.loadIdNamePairs();
            }
        }
        asyncDeleteListById();
    }

    store.deleteMarkedSong = function () {
        async function asyncDeleteMarkedSong() {
            console.log(store.currentList);
            console.log(store.markedSongIdx);
            store.currentList.songs.splice(store.markedSongIdx, 1)
            console.log(store.currentList);
            store.putPlaylist();
        }
        asyncDeleteMarkedSong();        
    }

    store.editMarkedSong = function (song) {
        async function asyncEditMarkedSong(song){
            store.editSong(song);
            store.putPlaylist();        
        }
        asyncEditMarkedSong(song);
    }

    store.getPlaylistSize = function() {
        return store.currentList.songs.length;
    }
    store.undo = function () {
        tps.undoTransaction();
    }
    store.redo = function () {
        tps.doTransaction();
    }

    // THIS FUNCTION ENABLES THE PROCESS OF EDITING A LIST NAME
    store.setlistNameActive = function () {
        storeReducer({
            type: GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE,
            payload: null
        });
    }
    

    store.showDeleteListModal= function (id) {
        let modal = document.getElementById("delete-list-modal");
        modal.classList.add("is-visible");
        storeReducer({
            type: GlobalStoreActionType.MARK_LIST_FOR_DELETION,
            payload: id
        })
    }
    
    store.hideDeleteListModal= function () {
        let modal = document.getElementById("delete-list-modal");
        modal.classList.remove("is-visible");
        storeReducer({
            type: GlobalStoreActionType.SET_CURRENT_LIST,
            payload: store.currentList
        })
    }

    store.showDeleteSongModal= function (obj) {
        let modal = document.getElementById("delete-song-modal");
        modal.classList.add("is-visible");
        storeReducer({
            type: GlobalStoreActionType.MARK_SONG,
            payload: obj
        })
    }
    
    store.hideDeleteSongModal= function () {
        let modal = document.getElementById("delete-song-modal");
        modal.classList.remove("is-visible");
        storeReducer({
            type: GlobalStoreActionType.SET_CURRENT_LIST,
            payload: store.currentList
        })
    }

    store.showEditSongModal= function (obj) {
        let modal = document.getElementById("edit-song-modal");
        modal.classList.add("is-visible");
        storeReducer({
            type: GlobalStoreActionType.MARK_SONG,
            payload: obj
        })
        console.log(store.markedSong);
    }
    
    store.hideEditSongModal= function () {
        let modal = document.getElementById("edit-song-modal");
        modal.classList.remove("is-visible");
        storeReducer({
            type: GlobalStoreActionType.SET_CURRENT_LIST,
            payload: store.currentList
        })
    }

    

    // THIS GIVES OUR STORE AND ITS REDUCER TO ANY COMPONENT THAT NEEDS IT
    return { store, storeReducer };
}