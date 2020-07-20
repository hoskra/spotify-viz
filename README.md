# Fraviz
> Online version of [Fraviz](http://fraviz.herokuapp.com) available on heroku.

## Important Spotify API endpoinds

* [Get Audio Analysis for a Track](https://developer.spotify.com/documentation/web-api/reference/tracks/get-audio-analysis)
* [Get Audio Features for a Track](https://developer.spotify.com/documentation/web-api/reference/tracks/get-audio-features/)
* [Get a Track](https://developer.spotify.com/documentation/web-api/reference/tracks/get-track/)

## About Music Visualization

* [Awesome Audio Visualization](https://github.com/willianjusten/awesome-audio-visualization)
* [Notes on Music Information Retrieval](https://musicinformationretrieval.com)
* [Listenable accoustic map](http://everynoise.com)
---

## Applications made using Spotify music analysis

* [Track Analysis (beats, bars ...)](https://spotify-audio-analysis.glitch.me/analysis.html)
* [Track Features Filter](https://www.klangspektrum.digital/)
* [Visualize Track Features](https://spotify-audio-features.glitch.me)
* [Create Spotify Playlist using Analysis](http://smarterplaylists.playlistmachinery.com/)
* [More Spotify Applications](https://developer.spotify.com/community/showcase/)


## Fraviz Developer Documentation
> Project forked from [spotify-viz](https://github.com/zachwinter/spotify-viz).

### Used Libraries

* [three.js](https://github.com/mrdoob/three.js/)
* [d3-interpolate](https://github.com/d3/d3-interpolate)

### Running Locally

1. Create a new Spotify app in your [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/).
2. Add `http://localhost:8001/callback` to your app's Redirect URIs. Note your app's `Client ID` and `Client Secret`.
3. Create a file named `.env` in the project's root directory with the following values:

```bash
CLIENT_ID=YOUR_CLIENT_ID_HERE
CLIENT_SECRET=YOUR_CLIENT_SECRET_HERE
REDIRECT_URI=http://localhost:8001/callback
PROJECT_ROOT=http://localhost:8001
NODE_ENV=development
```
4. Install and serve using NPM.
```bash
npm i
npm run serve
```
## WebGL 

> Links from book: Beginning WebGL for HTML5 pdf (https://www.docdroid.net/kg1s/beginning-webgl-for-html5-pdf#page=7)

### Demos
https://www.khronos.org/webgl/wiki/Demo_Repository
http://madebyevan.com/webgl-water/
http://ibiblio.org/e-notes/webgl/gpu/contents.htm
http://www.ro.me/tech/
https://experiments.withgoogle.com/search?q=WebGL


### Learning WebGL
http://learnwebgl.brown37.net

### HTML
https://www.w3.org/TR/html5-diff/

### Javascript
http://crockford.com/javascript/
https://jquery.com
https://www.json.org/json-en.html

### Framework list
https://www.khronos.org/webgl/wiki/User_Contributions

### WebGL best practices
https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices

## WebGL Specifications
https://www.khronos.org/registry/webgl/specs/latest/

## Music Theory
https://learningmusic.ableton.com/index.html

## Threejs Links
  * [Three.js Fundamentals](https://threejsfundamentals.org)
  * [Three.js 2013](http://stemkoski.github.io/Three.js/#hello-world)
  * [Random Terrain](https://alteredqualia.com/three/examples/webgl_terrain_dynamic.html)