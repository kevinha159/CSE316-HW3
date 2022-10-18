import { jsTPS_Transaction } from "../../common/jsTPS";

export default class AddSong_Transaction extends jsTPS_Transaction{
    constructor(store, oldIdx, newIdx){
        super();
        this.store = store;
        this.oldIdx = oldIdx;
        this.newIdx = newIdx;
    }

    doTransaction(){
        this.store.addSong(this.oldIdx, this.newIdx);
    }

    undoTransaction() {
        this.store.deleteSong(this.store.currentList.songs.length-1);
    }

}