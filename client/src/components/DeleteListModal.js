import React, { useContext } from 'react';
import {GlobalStoreContext} from '../store'

function DeleteListModal() {
         
        const {store} = useContext(GlobalStoreContext);
        let name = store.markedList ? store.markedList.name : "";

        function confirmHandle(event){
            event.stopPropagation();
            store.hideDeleteListModal();
            store.deleteMarkedList();
        }

        function cancelHandle(event){
            event.stopPropagation();
            store.hideDeleteListModal();
        }
        return (
            <div 
                class="modal" 
                id="delete-list-modal" 
                data-animation="slideInOutLeft">
                    <div class="modal-root" id='verify-delete-list-root'>
                        <div class="modal-north">
                            Delete playlist?
                        </div>
                        <div class="modal-center">
                            <div class="modal-center-content">
                                Are you sure you wish to permanently delete the {name} playlist?
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
export default DeleteListModal;