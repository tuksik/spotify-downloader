// Turns spotify uri into youtube url
var search = require('youtube-search')

module.exports = function(track, callback)
{

    var opts = {
      maxResults: 1,
      key: 'AIzaSyCbJ0IAbAa_lBZkwGlIIvO6N8v4WwKxI8I',
      type: 'video'
    }

    search(toString(track), opts, function(err, results) {
      if (err)
      {
          callback(err, null)
      }else {
          callback(null, results[0])
      }
    })

    function toString(track)
    {
        return track.artists.join(" ") + " - " + track.name
    }
}
