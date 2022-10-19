import React, { useContext } from 'react';
import {GlobalStoreContext} from '../store'

function EditSongModal(){

    const {store} = useContext(GlobalStoreContext);
    let title = "";
    let artist = "";
    let youTubeId = "";

    if(store.markedSong){
        title = store.markedSong.title;
        artist = store.markedSong.artist;
        youTubeId = store.markedSong.youTubeId;
        document.getElementById("title").value = title;
        document.getElementById("artist").value = artist;
        document.getElementById("youTubeId").value = youTubeId;
    }
    function confirmHandle(){
        let song = {
            title: document.getElementById("title").value,
            artist: document.getElementById("artist").value,
            youTubeId: document.getElementById("youTubeId").value
        }
        console.log("Song after edit");
        console.log(song);
        console.log(store.markedSong);
        let copy = {
            title: store.markedSong.title,
            artist: store.markedSong.artist,
            youTubeId: store.markedSong.youTubeId
        }
        store.addEditSongTransaction(store.markedSongIdx, copy, song);
        store.hideEditSongModal();

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
                            <input name="title" id = "title" type="text" defaultValue={title} />        
                        </label>
                        <br></br>
                        <label>
                            Artist:
                            <input name="artist" id = "artist" type="text" defaultValue={artist}  />        
                        </label>
                        <br></br>
                        <label>
                            youTubeId:
                            <input name="youTubeId" id = "youTubeId" type="text" defaultValue={youTubeId}  />        
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