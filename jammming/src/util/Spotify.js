
const clientId = '52994b4fd6c742269818fa707c79205e'; // Insert client ID here.
const redirectUri = "http://localhost:3000/"; // Have to add this to your accepted Spotify redirect URIs on the Spotify API.
let accessToken;

const Spotify = {
  getAccessToken() {
    if (accessToken) {
      return accessToken;
    }
    const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
    const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);
    if (accessTokenMatch && expiresInMatch) {
      accessToken = accessTokenMatch[1];
      return accessToken;
      window.setTimeout(() => accessToken = '', expiresIn * 1000);
	  window.history.pushState('Access Token', null, '/');
    } else {
      const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;
      window.location = accessUrl;
    } 


  },
  
  search(term) {
    const accessToken = Spotify.getAccessToken();
    return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, 
    {
       headers: {Authorization: `Bearer ${accessToken}`
    }).then(response=>{
      return response.json();
    }).then(jsonResponse=>{
      if(jsonResponse.tracks){
        return jsonResponse.tracks.map(track=>({
          id: track.id,
          name: track.name,
          artist: track.artists[0].name,
          album: track.album.name,
          uri: track.uri
        }))
      }else{
        return [];
      }
    })

  },

  savePlaylist(playlistName, trackUris){
    if(playlistName && trackUris){
      const accessToken = Spotify.getAccessToken();
      const headers = {
        Authorization:  `Bearer ${accessToken}`
      };
      
      const userId;
      return fetch('https://api.spotify.com/v1/me', {headers: headers}).then(response=>{
        return response.json();
      }).then(jsonResponse=>{
        userId = jsonResponse.user_id;
      })
    }else{
      return
    }

    const playlistID;
    return fetch( `https://api.spotify.com/v1/users/{user_id}/playlists`, {
      headers: headers,
      method: 'POST',
      body: JSON.stringify({userId}),
      name: playlistName
    }).then(response=>{
      return response.json();
    }).then(jsonResponse=>{
      playlistID = jsonResponse.id;
    })

  }
  return fetch(`https://api.spotify.com/v1/users/{user_id}/playlists/{playlist_id}/tracks`,
      {
        headers: headers,
        method: 'POST',
        body: JSON.stringify({userId}),
        URI: trackUris
      }
    ).then(response=>{
      return response.json();
    }).then(jsonResponse=>{
      playlistID = jsonResponse.id;
    })

}

export default Spotify;