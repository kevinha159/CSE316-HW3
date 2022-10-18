import { jsTPS_Transaction } from "../../common/jsTPS";

export default class MoveSong_Transaction extends jsTPS_Transaction{
    constructor(store, oldIdx, newIdx){
        super();
        this.store = store;
        this.oldIdx = oldIdx;
        this.newIdx = newIdx;
    }

    doTransaction(){
        this.store.moveSong(this.oldIdx, this.newIdx);
    }

    undoTransaction() {
        this.store.moveSong(this.newIdx, this.oldIdx);
    }

}