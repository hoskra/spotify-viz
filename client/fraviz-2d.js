import Visualizer from './classes/visualizer'
import { interpolateRgb, interpolateBasis } from 'd3-interpolate'
import { getRandomElement } from './util/array'
import { sin, circle } from './util/canvas'

function drawTree(ctx, startX, startY, len, angle, branchWidth, color1, color2, anim1){
  branchWidth = anim1;
  ctx.beginPath();
  ctx.save();
  ctx.translate(startX, startY);
  ctx.strokeStyle = color1;
  ctx.fillStyle = color2;
  ctx.lineWidth = branchWidth;
  ctx.rotate(angle * Math.PI/180);
  ctx.moveTo(0,0);
  ctx.lineTo(0, -len);
  ctx.stroke();

  if(len < 10){
    ctx.restore();
    return;
  }
  // console.log(anim1)
  drawTree(ctx, 0, -len, len * 0.55, angle  + 7, branchWidth);
  drawTree(ctx, 0, -len, len * 0.55, angle - 30, branchWidth);

  ctx.restore();
}

export default class Fraviz2D extends Visualizer {
  constructor () {
    super({ volumeSmoothing: 10 })
    this.theme = ['#18FF2A', '#7718FF', '#06C5FE', '#FF4242', '#18FF2A']



  }

  hooks () {
    // this.sync.on('tatum', tatum => {
      // })

      this.sync.on('segment', segment => {

    })

    // this.sync.on('beat', beat => {

    // })

    this.sync.on('section', section => {
      // console.log(section)
    })
    this.sync.on('bar', beat => {



      this.lastColor = this.nextColor || getRandomElement(this.theme)
      this.nextColor = getRandomElement(this.theme.filter(color => color !== this.nextColor))
    })
  }


  paint ({ ctx, height, width, now }) {
    // const bar = interpolateBasis([0, this.sync.volume * 10, 0])(this.sync.bar.progress)
    // const beat = interpolateBasis([0, this.sync.volume * 300, 0])(this.sync.beat.progress)
    // ctx.fillRect(0, 0, width, height)
    // ctx.lineWidth = bar
    // ctx.strokeStyle = interpolateRgb(this.lastColor, this.nextColor)(this.sync.bar.progress)
    // sin(ctx, now / 50, height / 2, this.sync.volume * 50, 100)
    // ctx.stroke()
    // ctx.fillStyle = 'rgba(0, 0, 0, 1)'
    // ctx.beginPath()
    // ctx.lineWidth = beat
    // circle(ctx, width / 2, height / 2, this.sync.volume * height / 5 + beat / 10)
    // ctx.stroke()

    let beat = this.sync.beat.duration/this.sync.beat.elapsed
    bea

    let bar = this.sync.bar.duration/this.sync.bar.elapsed

    ctx.fillStyle = 'white'
    ctx.fillRect(0, 0, width, height)
    drawTree(ctx, width/2, height-80, 120, 0, 2,  'blue', 'blue', beat);



  }
}