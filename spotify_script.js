// Get the hash of the url (may contain access token or not depending on whether the page is loaded for the first time or redirected)
const hash = window.location.hash
.substring(1)
.split('&')
.reduce(function (initial, item) {
  if (item) {
    var parts = item.split('=');
    initial[parts[0]] = decodeURIComponent(parts[1]);
  }
  return initial;
}, {});

// Set hash to empty
window.location.hash = '';

// Get token from hash if present
let _token = hash.access_token;

const authEndpoint = 'https://accounts.spotify.com/authorize';
const clientId = '2e6af109c2a84f79a78284b4021b49b0';
const redirectUri = 'https://hugo-chan.github.io';
// const redirectUri = 'http://localhost:8000';
const scopes = ['user-top-read'];

// If there is no token, redirect to Spotify authorization, which will redirect back to this page
if (!_token) {
  window.location = `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join('%20')}&response_type=token&show_dialog=true`;
}

// Queries Spotify API for user's top artists/tracks info
const top_info_call = function(endpoint, time_range) {
  $.ajax({
    url: `https://api.spotify.com/v1/me/top/${endpoint}`,
    type: "GET",
    data: {
      limit: 20,
      offset: 0,
      time_range: `${time_range}_term`
    },
    beforeSend: function(xhr){xhr.setRequestHeader('Authorization', 'Bearer ' + _token );},
    success: function(data) { 
      // Do something with the returned data
      data.items.map(function(artist) {
        if (artist.type == "artist") {
          let item = $(`<li class="artist"> <img class="verticallyCenter" src=${artist.images[0].url}> ${artist.name} </li>`);
          item.appendTo($(`#top-${endpoint}-${time_range}`));
        } else {
          let track = artist
          let item = $(`<li class="track"> <img class="verticallyCenter" src=${track.album.images[0].url}> <span class="track-text">${track.name}<br/><span style="font-size:16px">${track.artists[0].name}</span></span> </li>`);
          item.appendTo($(`#top-${endpoint}-${time_range}`));
        }

      });
    }
  });
}

const end_points = ["artists", "tracks"]
const time_range = ["short", "medium", "long"]

// Wait for first batch of info to arrive, then present at once 
$.ajaxSetup({async:false});

for (let i = 0; i < end_points.length; i++) {
  for (let j = 0; j < time_range.length; j++) {
    top_info_call(end_points[i], time_range[j])
  }
  // Second batch no need to wait
  $.ajaxSetup({async:true});
}
