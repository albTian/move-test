import * as utils from './utils.js'
import { ctx, planet } from './canvas.js'


export default class Circle {
    constructor(x, y, radius, fill, stroke) {
        this.startingAngle = 0
        this.endAngle = 2 * Math.PI
        this.x = x
        this.y = y

        this.dx = 0
        this.dy = 0

        this.ax = 0
        this.ay = 0

        this.radius = radius
        this.fill = fill
        this.stroke = stroke
        this.fixed = false

        // this.ctx = ctx
    }


    draw() {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, this.startingAngle, this.endAngle)
        ctx.fillStyle = this.fill
        ctx.lineWidth = 3
        ctx.fill()
        ctx.strokeStyle = this.stroke
        ctx.stroke()
    }

    speedUp() {
        this.dx += 1
        this.dy += 1
    }

    setSpeed(velocity) {
        console.log()
        this.dx = velocity.x
        this.dy = velocity.y
    }

    update() {
        if (this.fixed) {
            this.draw()
            return
        }

        // bounce off walls
        if (this.x + this.radius > 2560 || this.x + this.radius < 0) {
            this.dx = -this.dx
        }
        if (this.y + this.radius > 1400 || this.y - this.radius < 0) {
            this.dy = -this.dy
        }

        // update position
        this.x += this.dx
        this.y += this.dy

        // updates velocity
        this.dx += this.ax
        this.dy += this.ay

        // reset acceleration
        this.ax = 0
        this.ay = 0

        // dampening
        var frictionx = -Math.sign(this.dx) * Math.abs(this.dx) * utils.friction
        var frictiony = -Math.sign(this.dy) * Math.abs(this.dy) * utils.friction

        // gravity
        var distx = this.x - planet.x
        var disty = this.y - planet.y
        // console.log(distx)
        // console.log(disty)
        
        var distTotal = Math.hypot(distx, disty)
        // console.log(distTotal)
        this.ax = -(distx / Math.pow(distTotal, 2)) * utils.bigG + frictionx
        this.ay = -(disty / Math.pow(distTotal, 2)) * utils.bigG + frictiony
        console.log(this.ax)
        console.log(this.ay)

        // var distx = planet.x - this.x
        // var disty = planet.y - this.y

        // this.ax = Math.sign(distx) * .5
        // this.ay = Math.sign(disty) * .5

        this.draw()
    }
}