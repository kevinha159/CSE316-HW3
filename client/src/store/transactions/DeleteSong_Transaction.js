import { jsTPS_Transaction } from "../../common/jsTPS";

export default class DeleteSong_Transaction extends jsTPS_Transaction{
    constructor(store, idx, song){
        super();
        this.store = store;
        this.idx = idx;
        this.song = song;
    }

    doTransaction(){
        this.store.deleteSong(this.idx);
    }

    undoTransaction() {
        this.store.insertSong(this.idx, this.song);
    }

}