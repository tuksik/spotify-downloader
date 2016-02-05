var YoutubeMp3Downloader = require('youtube-mp3-downloader');

var Downloader = function() {
    var self = this;

    //Configure YoutubeMp3Downloader with your settings
    self.YD = new YoutubeMp3Downloader({
        "outputPath": ".",    // Where should the downloaded and encoded files be stored?
        "youtubeVideoQuality": "lowest",       // What video quality should be used?
        "queueParallelism": 200,                  // How many parallel downloads/encodes should be started?
        "progressTimeout": 2000                 // How long should be the interval of the progress reports
    });

    self.callbacks = {};

    self.YD.on("finished", function(data) {

        if (self.callbacks[data.videoId]) {
            self.callbacks[data.videoId](null,data);
        } else {
            console.log("Error: No callback for videoId!");
        }

    });

    self.YD.on("error", function(error) {
        console.log(error);
    });

}

Downloader.prototype.getMP3 = function(track, callback){
    var self = this;

    // Register callback
    self.callbacks[track.videoId] = callback;
    // Trigger download
    self.YD.download(track.videoId, track.name);

}

module.exports = Downloader;
