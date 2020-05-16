import Visualizer from './classes/visualizer'
import { interpolateRgb, interpolateBasis } from 'd3-interpolate'
import { getRandomElement } from './util/array'
import { sin, circle } from './util/canvas'

function drawTree(ctx, startX, startY, len, angle, branchWidth, color1, color2){
  ctx.beginPath();
  ctx.save();
  ctx.translate(startX, startY);
  ctx.rotate(angle * Math.PI/180);
  ctx.moveTo(0,0);
  ctx.lineTo(0, -len);
  ctx.stroke();

  if(len < 10){
    ctx.restore();
    return;
  }

  drawTree(ctx, -len, len * 0.55, angle + 7, branchWidth);
  drawTree(ctx, -len, len * 0.55, angle - 7, branchWidth);

  ctx.restore();
}

export function createStar (points, innerRadius, outerRadius, cx = 0, cy = 0, rotation = 0) {
  const outer = polygon(points, outerRadius, cx, cy, rotation)
  const inner = polygon(points, innerRadius, cx, cy, (360 / points / 2) + rotation)
  const vertices = []
  
  for (var i = 0; i < points; i++) {
    vertices.push({ x: outer[i].x, y: outer[i].y })
    vertices.push({ x: inner[i].x, y: inner[i].y })
  }

  return { outer, inner, vertices }
}


function drawShape (ctx, vertices) {
  vertices.forEach(({ x, y }, i) => {
    if (i === 0) {
      ctx.beginPath()
      ctx.moveTo(x, y)
    } else {
      ctx.lineTo(x, y)
    }
  })

  ctx.closePath()
  return ctx
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
    // ctx.fillStyle = 'rgba(0, 0, 0, .08)'
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

    drawTree(ctx, width/2, height-80, 120, 0, 2, 'white', 'blue');



    // ctx.fill()
  }
}