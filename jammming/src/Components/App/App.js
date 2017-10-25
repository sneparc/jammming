import React, { Component } from 'react';

import './App.css';

import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import {Spotify} from '../../util/Spotify';



class App extends Component {
  constructor(props){
    super(props);
    this.state = {searchResults: [{name: "Livin On a Prayer", artist:"Bon Jovi", album:"1980"}], 
                   playlistName: "Cool Playlist",
                   playlistTracks: []
                 };
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search= this.search.bind(this);
  }

  removeTrack(track) {
    let tracks = this.state.playlistTracks;

    tracks = tracks.filter(currentTrack => {
      if(currentTrack.id === track.id){
        return false;
      }else{
        return true;
      }
    });

    this.setState({playlistTracks: tracks});
  }
    
  addTrack(track){
    let tracks = this.state.playlistTracks;
    if(!tracks.includes(track)) {
       tracks.push(track);
    }
   return this.setState({playlistTracks: tracks});
  }

    updatePlaylistName(name){
      this.setState({playlistName: name});
    }

    savePlaylist() {
    const trackUris = this.state.playlistTracks.map(track => track.uri);
    Spotify.savePlaylist(this.state.playlistName, trackUris).then(() => {
      this.setState({
        playlistName: 'New Playlist',
        playlistTracks: []
      });
    });
  }

    search(term){
      console.log(term);
      Spotify.search(term).then(searchResults => {
      this.setState({searchResults: searchResults})})
    }

    render(){
      return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
            <SearchBar onSearch= {this.search}/>
          <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack}/>
            <Playlist playlistName={this.state.playlistName} playlistTracks={this.state.playlistTracks} onRemove = {this.removeTrack} onNameChange= {this.updatePlaylistName} onSave= {this.savePlaylist}/>
          </div>
        </div>
      </div>
      );
    }
 }

export default App;
