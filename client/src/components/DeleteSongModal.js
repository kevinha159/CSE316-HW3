import React, { useContext } from 'react';
import {GlobalStoreContext} from '../store'

function DeleteSongModal() {
         
        const {store} = useContext(GlobalStoreContext);
        let name = store.markedSong ? store.markedSong.title : "";
        // if(store.markedSongID !== -1 && store.currentList !== null){
        //     console.log(store.markedSongID);
        //     name =store.currentList.songs[store.markedSongID].name;
        // }
        function confirmHandle(){
            store.hideDeleteSongModal();
            store.addDeleteSongTransaction();
        }

        function cancelHandle(){
            store.hideDeleteSongModal();
        }
        return (
            <div 
                class="modal" 
                id="delete-song-modal" 
                data-animation="slideInOutLeft">
                    <div class="modal-root" id='verify-delete-list-root'>
                        <div class="modal-north">
                            Remove song?
                        </div>
                        <div class="modal-center">
                            <div class="modal-center-content">
                                Are you sure you wish to permanently delete {name} from the playlist?
                            </div>
                        </div>
                        <div class="modal-south">
                            <input type="button" 
                                id="delete-list-confirm-button" 
                                class="modal-button" 
                                onClick={confirmHandle}
                                value='Confirm' />
                            <input type="button" 
                                id="delete-list-cancel-button" 
                                class="modal-button" 
                                onClick={cancelHandle}
                                value='Cancel' />
                        </div>
                    </div>
            </div>
        );
    
}
export default DeleteSongModal;