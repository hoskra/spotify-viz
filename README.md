# Fraviz
> Online version of [Fraviz](http://fraviz.herokuapp.com) available on heroku.

## About Music Visualization

* [Awesome Audio Visualization](https://github.com/willianjusten/awesome-audio-visualization)
* [Notes on Music Information Retrieval](https://musicinformationretrieval.com)
* [Listenable accoustic map](http://everynoise.com)
---

## About Spotify Music Analysis

* [Track Analysis (beats, bars ...)](https://spotify-audio-analysis.glitch.me/analysis.html)
* [Track Features Filter](https://www.klangspektrum.digital/)
* [Visualize Track Features](https://spotify-audio-features.glitch.me)
* [Create Spotify Playlist using Analysis](http://smarterplaylists.playlistmachinery.com/)
* [More Spotify Applications](https://developer.spotify.com/community/showcase/)


## Developer Documentation
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
