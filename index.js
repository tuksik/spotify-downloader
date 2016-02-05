var spotifyPlaylist = require('spotify-playlist');
var toUrl = require('./uri-url');
var download = require('./download');
var spotify = require('spotify-data');
var fs = require('fs');
var EasyZip = require('easy-zip').EasyZip;

// uriIN: Spotify playlist URI
// done: Callback when download to uriIN folder is done
// update: Called during download progress
module.exports = function(uriIN, done, update) {

    var uri = uriIN;
    console.log(uri);
    var playlistId = Math.floor(Math.random() * 1000000000) + '';

    spotifyPlaylist.playlistUri(uri, function(err, data){
        console.log("Got playlist");
        if (err == "Fail!"){
            console.log(callback);
            console.log(update);
            update("Invalid playlist");
            done("Invalid playlist");
            return;
        }
        var tracks = data.playlist.tracks
        fs.mkdir("./" + playlistId, function(err)
        {
            if (err == null){
                downloadTracks(playlistId, tracks);
            }else {
                done("Directory creation failed");
            }
        })
    });

    function downloadTracks(playlistId, tracks)
    {
        var total = tracks.length
        var done = 0
        tracks.forEach((track, index)=>{
            spotify.track(track.id, function(err, track2){
                if (track2 && track2.track.album){
                    track.album = track2.track.album
                }else {
                    console.log("No album found");
                    track.album = {}
                }
                toUrl(track, function(err, data){
                    if (data){
                        download(index, playlistId, track, data.id, function (err){
                            done++;
                            console.log(done + " out of " + total + " downloaded");
                            update(done + " out of " + total + " downloaded");
                            if (err){
                                console.log("Download failed for " + track.name);
                            }
                            if (done == total){
                                zip(playlistId)
                            }
                        })
                    }else {
                        console.log("Youtube search failed for " + track.name);
                        done++;
                        if (done == total){
                            zip(playlistId)
                        }
                    }
                });
            });

        });
    }

    function zip(playlistId)
    {
        update("Sucesss!");
        done(null);
        // console.log("WE DONE!");
        // var zip = new EasyZip();
        // zip.zipFolder( './865008045',function(){
        // 	zip.writeToFile( playlistId + '.zip');
        // }, {rootFolder: 'easy-zip6'});
    }
}
