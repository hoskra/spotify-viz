import { auth } from './classes/sync'
import Try1 from './try1'
import Try2 from './try2'
import Try3 from './try3'
import Try4 from './try4'
import Try5 from './try5'
import Try6 from './try6'
import Fraviz from './fraviz'
import Fraviz2 from './fraviz2'
import Example from './example'

import Visualizer from './classes/visualizer'

let GUI_MODE = 0;
let SONG_ID = "";

let JUST_ONCE = true;

let artist, name;
let danceability, energy, key, loudness, mode, speechiness, acousticness, instrumentalness, liveness, valence, tempo;

function showHideGUI(){
  console.log("clicked")
  if (GUI_MODE === 0) {
    $(".gui").addClass("hiden");
    GUI_MODE = 1
  } else {
    $(".gui").removeClass("hiden");
      GUI_MODE = 0
  }
}

class Index extends Visualizer {
  constructor () {
    super({ volumeSmoothing: 100 })

    if (window.location.hash === '#start') {

      if (GUI_MODE === 0) {$(".gui").removeClass("hiden");}
      else {$(".gui").addClass("hiden")}

      let app = new Fraviz2();
      $("#stats").addClass("hiden");




      $("#song").removeClass("hiden")
      $('body').keyup((e) => {
        if(e.keyCode == 32){
          showHideGUI()
        } else if (e.keyCode == 97) {
          app = undefined
          app = new Try4()  // basic stats
          $(".gui").removeClass("hiden");
        } else if (e.keyCode == 98) {
          app = undefined
          app = new Try2()  // wierd dancing trees
          $(".gui").removeClass("hiden");
        } else if (e.keyCode == 99) {
          app = undefined
          app = new Try5()
          $(".gui").removeClass("hiden");
        } else if (e.keyCode == 100) {
          app = undefined
          app = new Fraviz()
          location.reload();
        } else if (e.keyCode == 101) {
          app = undefined
          app = new Fraviz2()
          $("#stats").addClass("hiden");
        }
      });


      $("#1").click(()=>{
        app = undefined
        app = new Try4()  // basic stats
        $(".gui").removeClass("hiden");
      })
      $("#2").click(()=>{
        app = undefined
        app = new Try2()  // wierd dancing trees
        $(".gui").removeClass("hiden");
      })
      $("#3").click(()=>{
        app = undefined
        app = new Try5()
        $(".gui").removeClass("hiden");
      })
      $("#4").click(()=>{
        app = undefined
        app = new Fraviz()
        $(".gui").removeClass("hiden");
      })
      $("#5").click(()=>{
        app = undefined
        app = new Fraviz2()
        $("#stats").addClass("hiden");
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
      // reload window on song change
      if (this.sync.state.currentlyPlaying.id != SONG_ID) {
        location.reload();
      }
    }

    SONG_ID = this.sync.state.currentlyPlaying.id;

    if(JUST_ONCE) {
      JUST_ONCE = false;
      console.log("danceability: " + this.sync.state.trackFeatures.danceability);
      console.log("energy: " + this.sync.state.trackFeatures.energy);
      console.log("key: " + this.sync.state.trackFeatures.key);
      console.log("loudness: " + this.sync.state.trackFeatures.loudness);
      console.log("mode: " + this.sync.state.trackFeatures.mode);
      console.log("speechiness: " + this.sync.state.trackFeatures.speechiness);
      console.log("acousticness: " + this.sync.state.trackFeatures.acousticness);
      console.log("instrumentalness: " + this.sync.state.trackFeatures.instrumentalness);
      console.log("liveness: " + this.sync.state.trackFeatures.liveness);
      console.log("valence: " + this.sync.state.trackFeatures.valence);
      console.log("tempo: " + this.sync.state.trackFeatures.tempo);
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