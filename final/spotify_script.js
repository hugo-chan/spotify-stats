// Get the hash of the url
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
window.location.hash = '';


// Set token
let _token = hash.access_token;

const authEndpoint = 'https://accounts.spotify.com/authorize';

// Replace with your app's client ID, redirect URI and desired scopes
const clientId = '2e6af109c2a84f79a78284b4021b49b0';
const redirectUri = 'https://hugo-chan.github.io/index.html';
// const redirectUri = 'http://localhost:8000';
const scopes = [
    'user-top-read'
];

// If there is no token, redirect to Spotify authorization
if (!_token) {
    window.location = `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join('%20')}&response_type=token&show_dialog=true`;
}

$.ajaxSetup({async:false});

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

top_info_call("artists", "short")
top_info_call("artists", "medium")
top_info_call("artists", "long")
top_info_call("tracks", "short")
top_info_call("tracks", "medium")
top_info_call("tracks", "long")
// top_info_call("artists", "short")

// // Make a call using the token
// $.ajax({
//    url: "https://api.spotify.com/v1/me/top/tracks",
//    type: "GET",
//    data: {
//        limit: 50,
//        offset: 0,
//        time_range: "short_term"
//    },
//    beforeSend: function(xhr){xhr.setRequestHeader('Authorization', 'Bearer ' + _token );},
//    success: function(data) { 
//      // Do something with the returned data
//      data.items.map(function(track) {
//         console.log(track)
//         let item = $(`<li class="track"> <img class="verticallyCenter" src=${track.album.images[0].url}> <span class="track-text">${track.artists[0].name} <br/> ${track.name}</span> </li>`);
//         item.appendTo($('#top-tracks-short'));
//      });
//    }
// });
// //  <img class="verticallyCenter" src=${track.album.images[0].url}>

// // $.ajax({
// //    url: "https://api.spotify.com/v1/me/top/artists",
// //    type: "GET",
// //    data: {
// //        limit: 50,
// //        offset: 0,
// //        time_range: "medium_term"
// //    },
// //    beforeSend: function(xhr){xhr.setRequestHeader('Authorization', 'Bearer ' + _token );},
// //    success: function(data) { 
// //      // Do something with the returned data
// //      data.items.map(function(artist) {
// //         let item = $(`<li> <img class="verticallyCenter" src=${artist.images[0].url}> ${artist.name} </li>`);
// //        item.appendTo($('#top-artists-medium'));
// //      });
// //    }
// // });

// // // Make a call using the token
// // $.ajax({
// //    url: "https://api.spotify.com/v1/me/top/artists",
// //    type: "GET",
// //    data: {
// //        limit: 50,
// //        offset: 0,
// //        time_range: "long_term"
// //    },
// //    beforeSend: function(xhr){xhr.setRequestHeader('Authorization', 'Bearer ' + _token );},
// //    success: function(data) { 
// //      // Do something with the returned data
// //      data.items.map(function(artist) {
// //         let item = $(`<li> <img class="verticallyCenter" src=${artist.images[0].url}> ${artist.name} </li>`);
// //        item.appendTo($('#top-artists-long'));
// //      });
// //    }
// // });

