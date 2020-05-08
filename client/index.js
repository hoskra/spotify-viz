import { auth } from './classes/sync'
import Example from './example'
import Try1 from './try1'
import Try2 from './try2'
import Try3 from './try3'
import Try4 from './try4'
import Try5 from './try5'
import Try6 from './try6'

import IndexData from './classes/indexData'
import Visualizer from './classes/visualizer'

let GUI_MODE = 1;
let SONG_ID = "";

let JUST_ONCE = true;

let artist, name;
let danceability, energy, key, loudness, mode, speechiness, acousticness, instrumentalness, liveness, valence, tempo;

// $(".gui").addClass("hiden");
// let app = new Try5()

class Index extends Visualizer {
  constructor () {
    super({ volumeSmoothing: 100 })

    if (window.location.hash === '#start') {
      if (GUI_MODE === 0) {$(".gui").removeClass("hiden");} else if (GUI_MODE === 1) {$(".gui").addClass("hiden");$("#song").removeClass("hiden");} else {$("#song").addClass("hiden");}

      $('body').keyup(function(e){
        // user has pressed space
        if(e.keyCode == 32){
          GUI_MODE++
          GUI_MODE = GUI_MODE % 3
          if (GUI_MODE === 0) {
              // all visible
              $(".gui").removeClass("hiden");
            } else if (GUI_MODE === 1) {
              // just song name and artist visible
              $(".gui").addClass("hiden");
              $("#song").removeClass("hiden");
            } else {
              // all hidden
              $("#song").addClass("hiden");
            }
        }
     });

      let app = new Try5();

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
        app = new Try5()
      })
      $("#5").click(()=>{
        app = undefined
        app = new Try6()
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

    $("#no-song").addClass("hiden")

    $("#song-artist").html(artist)
    $("#song-name").html(name)

    if (SONG_ID) {
      if (this.sync.state.currentlyPlaying.id != SONG_ID) {
        location.reload();
      }
    }

    SONG_ID = this.sync.state.currentlyPlaying.id;

    if(JUST_ONCE) {
      JUST_ONCE = false;
      // console.log(this.sync.state)
    }

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

    $("#stats-table").html(
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
      "</table>"
    )

  }
}

let index = new Index()