const Playlist = require('../models/playlist-model')
/*
    This is our back-end API. It provides all the data services
    our database needs. Note that this file contains the controller
    functions for each endpoint.
    
    @author McKilla Gorilla
*/
createPlaylist = (req, res) => {
    const body = req.body;
    console.log("createPlaylist body: " + body);
 
    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a Playlist',
        })
    }
 
    const playlist = new Playlist(body);
    console.log("playlist: " + JSON.stringify(body));
    if (!playlist) {
        return res.status(400).json({ success: false, error: err })
    }
                           
    playlist
        .save()
        .then(() => {
            console.log("1")
            return res.status(201).json({
                success: true,
                playlist: playlist,
                message: 'Playlist Created!',
            })
        })
        .catch(error => {
            return res.status(400).json({
                error,
                message: 'Playlist Not Created!',
            })
        })
}


getPlaylistById = async (req, res) => {
    await Playlist.findOne({ _id: req.params.id }, (err, list) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        return res.status(200).json({ success: true, playlist: list })
    }).catch(err => console.log(err))
}
getPlaylists = async (req, res) => {
    await Playlist.find({}, (err, playlists) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        if (!playlists.length) {
            return res
                .status(404)
                .json({ success: false, error: `Playlists not found` })
        }
        return res.status(200).json({ success: true, data: playlists })
    }).catch(err => console.log(err))
}
getPlaylistPairs = async (req, res) => {
    await Playlist.find({}, (err, playlists) => {
        if (err) {
            return res.status(400).json({ success: false, error: err})
        }
        if (!playlists.length) {
            return res
                .status(404)
                .json({ success: false, error: 'Playlists not found'})
        }
        else {
            // PUT ALL THE LISTS INTO ID, NAME PAIRS
            let pairs = [];
            for (let key in playlists) {
                let list = playlists[key];
                let pair = {
                    _id : list._id,
                    name : list.name
                };
                pairs.push(pair);
            }
            return res.status(200).json({ success: true, idNamePairs: pairs })
        }
    }).catch(err => console.log(err))
}

deletePlaylistById = async (req, res) =>{
    console.log(req.body.id);
    await Playlist.deleteOne({
        _id: req.body.id
    }).then(result => {
        console.log(result);
        return res.status(200).json({message: 'List deleted!'});
    }).catch(err => console.log(err));
}

//replaces whole playlist with the playlist from client, so this deals with add/delete/editing of songs
putPlaylistById = async (req, res) => {
    const playlist = req.body.data.playlist;
    console.log(req.body.data);
    if (!playlist) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a Playlist',
        })
    }

    await Playlist.findOne({ _id: req.body.data.id }, (err, list) => {
        if (err) {
            res.status(400).json({ success: false, error: err })
            return;
        }
        console.log("Found one");
        console.log(playlist);
        list.name = playlist.name;
        list.songs = playlist.songs;
 
        list
        .save()
        .then(() => {
            console.log(1);
            res.status(201).json({
                success: true,
                playlist: playlist,
                message: 'Playlist Modified!',
            }) 
            return;
        })
        .catch(error => {
            console.log(2);
            res.status(400).json({
                error,
                message: 'Playlist Not Modified!',
            })
            return;
        })         
    }).catch(err => console.log(err))

}
module.exports = {
    createPlaylist,
    getPlaylists,
    getPlaylistPairs,
    getPlaylistById,
    deletePlaylistById,
    putPlaylistById
}