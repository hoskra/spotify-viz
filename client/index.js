import { auth } from './classes/sync'
import Example from './example'
import Try1 from './try1'
import Try2 from './try2'
import Try3 from './try3'
import Try4 from './try4'

import Visualizer from './classes/visualizer'

let artist, name;
let artistElement, nameElement;

let danceability;
let energy;
let key;
let loudness;
let mode;
let speechiness;
let acousticness;
let instrumentalness;
let liveness;
let valence;
let tempo;
let duration_ms;

let hiddenGui = false;

class Index extends Visualizer {
  constructor () {
    super({ volumeSmoothing: 100 })

    if (window.location.hash === '#start') {

      $('body').keyup(function(e){
        if(e.keyCode == 32){
            // user has pressed space
            if (hiddenGui) {
              hiddenGui = false;
              $(".gui").removeClass("hiden");
            } else {
              hiddenGui = true;
              $(".gui").addClass("hiden");
            }
        }
     });

      let app = new Try3();

      $("#2").click(()=>{
        app = undefined
        app = new Try2()
      })
      $("#3").click(()=>{
        app = undefined
        app = new Try3()
      })
      $("#4").click(()=>{
        app = undefined
        app = new Try4()
      })

  } else {
    auth()
  }

}
hooks () {
}

paint ({ ctx, height, width, now }) {
    artist = this.sync.state.currentlyPlaying.artists[0].name
    name = this.sync.state.currentlyPlaying.name

    $("#song-artist").html(artist)
    $("#song-name").html(name)

    danceability = this.sync.state.trackFeatures.danceability;
    energy = this.sync.state.trackFeatures.energy;
    key = this.sync.state.trackFeatures.key;
    loudness = this.sync.state.trackFeatures.loudness;
    mode = this.sync.state.trackFeatures.mode;
    speechiness = this.sync.state.trackFeatures.speechiness;
    acousticness = this.sync.state.trackFeatures.acousticness;
    instrumentalness = this.sync.state.trackFeatures.instrumentalness;
    liveness = this.sync.state.trackFeatures.liveness;
    valence = this.sync.state.trackFeatures.valence;
    tempo = this.sync.state.trackFeatures.tempo;
    duration_ms = this.sync.state.trackFeatures.duration_ms;

    $("#stats").html(
      "<table>" +
        "<tr><td>danceability</td><td>" + danceability + "</td></tr>" +
        "<tr><td>energy</td><td>" + energy + "</td></tr>" +
        "<tr><td>key</td><td>" + key + "</td></tr>" +
        "<tr><td>loudness</td><td>" + loudness + "</td></tr>" +
        "<tr><td>mode</td><td>" + mode + "</td></tr>" +
        "<tr><td>speechiness</td><td>" + speechiness + "</td></tr>" +
        "<tr><td>acousticness</td><td>" + acousticness + "</td></tr>" +
        "<tr><td>instrumentalness</td><td>" + instrumentalness + "</td></tr>" +
        "<tr><td>liveness</td><td>" + liveness + "</td></tr>" +
        "<tr><td>valence</td><td>" + valence + "</td></tr>" +
        "<tr><td>tempo</td><td>" + tempo + "</td></tr>" +
        "<tr><td>duration_ms</td><td>" + duration_ms + "</td></tr>" +
      "</table>"
    )

  }
}

let index = new Index()