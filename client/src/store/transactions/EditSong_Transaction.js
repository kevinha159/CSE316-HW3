import { jsTPS_Transaction } from "../../common/jsTPS";

export default class EditSong_Transaction extends jsTPS_Transaction{
    constructor(store, idx, oldSong, newSong){
        super();
        this.store = store;
        this.idx = idx;
        this.oldSong = oldSong;
        this.newSong = newSong;
    }

    doTransaction(){
        this.store.editSong(this.idx, this.newSong);
    }

    undoTransaction() {
        this.store.editSong(this.idx, this.oldsong);
    }

}