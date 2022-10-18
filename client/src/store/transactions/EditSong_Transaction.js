import { jsTPS_Transaction } from "../../common/jsTPS";

export default class EditSong_Transaction extends jsTPS_Transaction{
    constructor(store, idx, oldSong, newSong){
        super();
        this.store = store;
        this.idx = idx;
        this.oldSong = oldSong;
        this.newSong = newSong;
    }

    doTransaction = ()=>{
        console.log("Doing transaction")
        console.log(this.newSong);
        this.store.editSong(this.idx, this.newSong);
    }

    undoTransaction = () => {
        console.log("Undoing transaction");
        console.log(this.oldSong);
        console.log(this.idx);
        this.store.editSong(this.idx, this.oldSong);
    }

}