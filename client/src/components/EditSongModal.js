import React, { useContext } from 'react';
import {GlobalStoreContext} from '../store'

function EditSongModal(){

    const {store} = useContext(GlobalStoreContext);

    function confirmHandle(){
        store.hideEditSongModal();
        let song = {
            title: document.getElementById("title").value,
            artist: document.getElementById("artist").value,
            youTubeId: document.getElementById("youTubeId").value
        }
        store.editMarkedSong(song);
    }

    function cancelHandle(){
        store.hideEditSongModal();
    }
    console.log("IN editmodal");
    return  (
        <div 
            class="modal" 
            id="edit-song-modal" 
            data-animation="slideInOutLeft">
                <div class="modal-root" id='verify-delete-list-root'>
                    <div class="modal-north">
                        Edit Song
                    </div>
                    <div class="modal-center">
                    <form>        
                        <label>
                            Title:
                            {/* <input name="title" type="text" value={""} onChange={this.handleInputChange} />         */}
                        </label>
                        <br></br>
                        <label>
                            Artist:
                            {/* <input name="artist" type="text" value={""} onChange={this.handleInputChange} />         */}
                        </label>
                        <br></br>
                        <label>
                            youTubeId:
                            {/* <input name="youTubeId" type="text" value={""} onChange={this.handleInputChange} />         */}
                        </label>
                    </form>
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

export default EditSongModal;