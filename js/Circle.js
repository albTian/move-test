import * as utils from './utils.js'
import { ctx } from './canvas.js'


export default class Circle {
    constructor(x, y, radius, fill, stroke) {


        this.pos = {x: x, y: y}
        this.vel = {x: 0, y: 0}
        this.acc = {x: 0, y: 0}

        this.dest = null

        this.forces = []
        this.radius = radius
        this.fill = fill
        this.stroke = stroke
        this.fixed = false
        this.grabbed = false

        // this.ctx = ctx
    }


    draw() {
        ctx.beginPath()
        ctx.arc(this.pos.x, this.pos.y, this.radius, 0, 2 * Math.PI)
        ctx.fillStyle = this.fill
        ctx.lineWidth = 3
        ctx.fill()
    }

    // animates this to a point. used in rearange
    moveTo(point) {
        if (!this.fixed) {
            this.reset()
            this.dest = point
        }
        // this.pos = point
        // this.fixed = true
    }

    // adds a force to be applied next time step
    addForce(force) {
        this.forces.push(force)
    }

    // correct signange is up to the user, not circle.
    applyForce(force) {
        this.acc.x += force.x
        this.acc.y += force.y
    }

    reset() {
        // console.log('reset')
        this.vel = {x: 0, y: 0}
        this.acc = {x: 0, y: 0}
    }

    update() {
        if (this.fixed) {
            this.reset()
            this.draw()
            return
        }

        
        // bounce off walls
        if (this.pos.x + this.radius > 2560 || this.pos.x + this.radius < 0) {
            this.vel.x = -this.vel.x
        }
        if (this.pos.y + this.radius > 1400 || this.pos.y - this.radius < 0) {
            this.vel.y = -this.vel.y
        }
        // friction applies to all circles, all the time
        utils.applyFriction(this, .01)
        
        this.forces.map(force => this.applyForce(force))

        // updates velocity
        this.vel.x += this.acc.x
        this.vel.y += this.acc.y
        
        // update position
        this.pos.x += this.vel.x
        this.pos.y += this.vel.y
        
        // resets acceleration and forces
        this.acc = {x: 0, y: 0}
        
        // resets the forces
        this.forces = []
        
        
        if (this.dest) {
            // this.pos = this.dest
            var fakePlanet = {
                pos: this.dest
            }
            utils.applyPull(this, this.dest)
            if (utils.dist(this.pos, this.dest) < 4) {
                this.pos = this.dest
                this.dest = null
                this.fixed = true
            }
            // this.dest = null
            // this.fixed = true
            // return

        }
        this.draw()
    }
}