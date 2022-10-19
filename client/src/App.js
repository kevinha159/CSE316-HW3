import './App.css';
import { React } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { Banner, EditSongModal, DeleteListModal, DeleteSongModal, ListSelector, PlaylistCards, Statusbar } from './components'
/*
    This is our application's top-level component.
    
    @author McKilla Gorilla
*/
const App = () => {
    return (
        <Router>
            <link rel="stylesheet" type="text/css" href="https://fonts.googleapis.com/css?family=Tangerine"></link>
            <Banner />
            <Switch>
                <Route path="/" exact component={ListSelector} />
                <Route path="/playlist/:id" exact component={PlaylistCards} />
            </Switch>
            <Statusbar />
            <DeleteListModal />
            <DeleteSongModal />
            <EditSongModal />
        </Router>
    )
}

export default App