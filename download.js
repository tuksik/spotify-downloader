var Downloader = require("./Downloader");
var dl = new Downloader();
var ffmetadata = require("ffmetadata");
var request = require('request');
var fs = require('fs');

module.exports = function(index, directory, track, id, callback){
    dl.getMP3({videoId: id, name:  directory + '/' + index + '.mp3'}, function (err, res){
        if(err){
            console.log("MP3 Download failed");
            callback(err);
        }
        else{
            console.log("Song "+ toString(track) + " was downloaded to " + res.file);
            var writeStream = fs.createWriteStream('./' + directory + '/' + index + '.png')
            request(track.cover).pipe(writeStream);
            writeStream.on('finish', function(){
                var data = {
                    title: track.name,
                    artist: track.artists.join(", "),
                    album: track.album.name
                };

                var options = {
                    attachments: ['./' + directory + '/' + index + '.png'],
                };
                ffmetadata.write(res.file, data, options, function(err) {
                    if (err){
                        callback(err); return;
                    }
                    fs.unlink('./' + directory + '/' + index + '.png', function(err){
                        callback(null);
                    });
                });
            })
            writeStream.on('error', function(err){
                console.log("Write stream for png failed!");
                callback(err);
            })
        }
    })

    function toString(track)
    {
        var str =  track.artists.join(" ") + " - " + track.name + ".mp3";
        str.replace(/\//g, "-");
        return str;
    }
}
