import { useContext } from 'react'
import { GlobalStoreContext } from '../store'
import { useHistory } from 'react-router-dom'
/*
    This toolbar is a functional React component that
    manages the undo/redo/close buttons.
    
    @author McKilla Gorilla
*/
function EditToolbar() {
    const { store } = useContext(GlobalStoreContext);
    const history = useHistory();

    let enabledButtonClass = "playlister-button";

    function handleUndo() {
        store.undo();
    }
    function handleRedo() {
        store.redo();
    }
    function handleClose() {
        history.push("/");
        store.closeCurrentList();
    }

    function handleAdd(){
        store.addAddSongTransaction();
    }

    let canUndo = false;
    let canRedo = false;
    let canClose = false;
    let canAdd = false;
    if(store.currentList !== null && store.modalOpen === false){
        canUndo = store.hasUndo();
        canRedo = store.hasRedo();
        canClose = true;
        canAdd = true;
    }

    return (
        <span id="edit-toolbar">
            <input
                type="button"
                id='add-song-button'
                disabled={!canAdd}
                value="+"
                className={enabledButtonClass}
                onClick={handleAdd}
            />
            <input
                type="button"
                id='undo-button'
                disabled={!canUndo}
                value="⟲"
                className={enabledButtonClass}
                onClick={handleUndo}
            />
            <input
                type="button"
                id='redo-button'
                disabled={!canRedo}
                value="⟳"
                className={enabledButtonClass}
                onClick={handleRedo}
            />
            <input
                type="button"
                id='close-button'
                disabled={!canClose}
                value="&#x2715;"
                className={enabledButtonClass}
                onClick={handleClose}
            />
        </span>);
}

export default EditToolbar;