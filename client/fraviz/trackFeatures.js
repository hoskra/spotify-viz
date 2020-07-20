/*
  Modality:
  0  .. minor
  1  .. major
  -1 .. no result
*/

export function getTrackFeatures(state) {


  if (state) {
    state.forEach(e => {
      console.log(e.tempo)
    });
  } else {
    console.log("Error occured. Application may not run as expected.")
  }
}