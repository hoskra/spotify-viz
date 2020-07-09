import { auth } from './classes/sync'
import Try1 from './try1'
import Try2 from './try2'
import Try3 from './try3'
import Try4 from './try4'
import Try5 from './try5'
import Try6 from './try6'
import Fraviz from './fraviz'
import Fraviz2D from './fraviz-2d'
import Example from './example'

// import IndexData from './classes/indexData'
import Visualizer from './classes/visualizer'

let GUI_MODE = 0;
let SONG_ID = "";

let JUST_ONCE = true;

let artist, name;
let danceability, energy, key, loudness, mode, speechiness, acousticness, instrumentalness, liveness, valence, tempo;

// $(".gui").addClass("hiden");
// let app = new Try5()


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

      let app = new Fraviz();

      $("#song").removeClass("hiden")
      $('body').keyup((e) => {
        if(e.keyCode == 32){
          showHideGUI()
        } else if (e.keyCode == 97) {
          app = undefined
          app = new Try4()  // basic stats
        } else if (e.keyCode == 98) {
          app = undefined
          app = new Try2()  // wierd dancing trees
        } else if (e.keyCode == 99) {
          app = undefined
          app = new Try5()
        } else if (e.keyCode == 100) {
          app = undefined
          app = new Fraviz()
          location.reload();
        }
      });


      $("#1").click(()=>{
        app = undefined
        app = new Try4()  // basic stats
      })
      $("#2").click(()=>{
        app = undefined
        app = new Try2()  // wierd dancing trees
      })
      $("#3").click(()=>{
        app = undefined
        app = new Try5()
      })
      $("#4").click(()=>{
        app = undefined
        app = new Fraviz()
        location.reload();
      })

      // let app = new Try1();
      // let app = new Try2();
      // let app = new Try3();
      // let app = new Try4();
      // let app = new Try5();
      // let app = new Fraviz();
      // let app = new Fraviz2D();

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