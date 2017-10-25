
const clientId = '52994b4fd6c742269818fa707c79205e'; // Insert client ID here.
const redirectUri = "http://localhost:3000/"; // Have to add this to your accepted Spotify redirect URIs on the Spotify API.
let accessToken;

export const Spotify = {
  getAccessToken() {
    if (accessToken) {
      return accessToken;
    }
    const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
    const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);
    if (accessTokenMatch && expiresInMatch) {
      accessToken = accessTokenMatch[1];
       window.setTimeout(() => accessToken = '', expiresInMatch * 1000);
    window.history.pushState('Access Token', null, '/');
    return accessToken;
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
    }}).then(response=>{
      return response.json();
    }).then(jsonResponse=>{
      if(jsonResponse.tracks){
        return jsonResponse.tracks.items.map(track=>({
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
      
      let userId;
      return fetch('https://api.spotify.com/v1/me', {headers: headers}).then(response=>{
        return response.json();
      }).then(jsonResponse=>{
        userId = jsonResponse.user_id;
      })

    return fetch("https://api.spotify.com/v1/users/" + userId + "/playlists",
    {
      headers: {'Authorization': `Bearer ${accessToken}`},
      method: 'POST',
      body: JSON.stringify({'name': playlistName})
    })
    .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Request failed!');
        }
    },networkError => console.log(networkError.message))
    .then(
        jsonResponse => {
          console.log(jsonResponse.id);
          if (jsonResponse.id) {
              return playlistId = jsonResponse.id
          }
        }
      )
  
  let playlistId;
  return fetch(`https://api.spotify.com/v1/users/{user_id}/playlists/{playlist_id}/tracks`,
      {
        headers: headers,
        method: 'POST',
        body: JSON.stringify({URI: trackUris}),
      }
    ).then(response=>{
      return response.json();
    }).then(jsonResponse=>{
      playlistId = jsonResponse.id;
    })
    }else{
      return
    }
    
}
}

export default Spotify;