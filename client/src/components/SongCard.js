import React, { useContext, useState } from 'react'
import { GlobalStoreContext } from '../store'

function SongCard(props) {
    const { store } = useContext(GlobalStoreContext);
    const [draggedTo, setDrag] = useState(false);

    function handleDragStart(event){
        event.dataTransfer.setData("song", event.target.id);
    }
    function handleDragOver(event) {
        event.preventDefault();
    }
    function handleDragEnter(event){
        event.preventDefault();
        setDrag(true);
    }
    function handleDragLeave(event){
        event.preventDefault();
        setDrag(false);
    }
    function handleDrop(event){
        event.preventDefault();
        let target = event.target;
        let targetId = target.id;
        targetId = targetId.substring(target.id.indexOf("-") + 1);
        let sourceId = event.dataTransfer.getData("song");
        sourceId = sourceId.substring(sourceId.indexOf("-") + 1);
        
        setDrag(false);

        // ASK THE MODEL TO MOVE THE DATA
        store.addMoveSongTransaction(parseInt(sourceId), parseInt(targetId));
    }

    function handleRemove(event){
        event.stopPropagation();
        event.preventDefault();
        store.showDeleteSongModal({song, index});
        
    }

    function handleEditSong(event){
        event.stopPropagation();
        store.showEditSongModal({song,index});
    }

    const { song, index } = props;
    let cardClass = "list-card unselected-list-card";
    console.log("in songcard");
    return (
        <div
            key={index}
            id={'song-' + index + '-card'}
            className={cardClass}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            draggable="true"
            onDoubleClick={handleEditSong}
        >
            {index + 1}.
            <a
                id={'song-' + index + '-link'}
                className="song-link"
                href={"https://www.youtube.com/watch?v=" + song.youTubeId}>
                {song.title} by {song.artist}
            </a>
            <input
                type="button"
                id={"remove-song-" + index}
                className="list-card-button"
                value={"\u2715"}
                onClick={handleRemove}
            />
        </div>
    );
}

export default SongCard