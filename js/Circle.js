import { friction } from './utils.js'

export default class Circle {
    constructor(x, y, radius, fill, stroke, ctx) {
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

        this.ctx = ctx
    }


    draw() {
        this.ctx.beginPath()
        this.ctx.arc(this.x, this.y, this.radius, this.startingAngle, this.endAngle)
        this.ctx.fillStyle = this.fill
        this.ctx.lineWidth = 3
        this.ctx.fill()
        this.ctx.strokeStyle = this.stroke
        this.ctx.stroke()
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

        // dampening
        this.ax = -Math.sign(this.dx) * Math.abs(this.dx) * friction
        this.ay = -Math.sign(this.dy) * Math.abs(this.dy) * friction

        this.draw()
    }
}