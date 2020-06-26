import * as utils from './utils.js'
import { ctx, planet, clusterArray } from './canvas.js'


export default class Circle {
    constructor(x, y, radius, fill, stroke) {


        this.pos = {x: x, y: y}
        this.vel = {x: 0, y: 0}
        this.acc = {x: 0, y: 0}

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
        // ctx.strokeStyle = this.stroke
        // ctx.stroke()
    }

    // increase the magintude of vel
    speedUp() {
        this.vel.x += Math.sign(this.vel.x)
        this.vel.y += Math.sign(this.vel.y)
    }

    setPos(pos) { this.pos = pos }

    // set the speed to vel
    setSpeed(vel) { this.vel = vel }

    // set acceleration to
    setAcceleration(acc) { this.acc = acc }

    addForce(force) {
        this.forces.push(force)
    }

    // correct signange is up to the user, not circle.
    applyForce(force) {
        this.acc.x += force.x
        this.acc.y += force.y
    }

    update() {
        if (this.fixed) {
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

        // update position
        this.pos.x += this.vel.x
        this.pos.y += this.vel.y

        // updates velocity
        this.vel.x += this.acc.x
        this.vel.y += this.acc.y

        // resets acceleration and forces
        this.acc = {x: 0, y: 0}
        utils.applyFriction(this)
        
        for (const force of this.forces) {
            this.acc.x += force.x
            this.acc.y += force.y
        }
        
        // resets the forces
        this.forces = []


        // dampening
        // var friction = {
        //     x: -Math.sign(this.vel.x) * Math.abs(this.vel.x) * utils.friction,
        //     y: -Math.sign(this.vel.y) * Math.abs(this.vel.y) * utils.friction
        // }
        // var frictionx = -Math.sign(this.vel.x) * Math.abs(this.vel.x) * utils.friction
        // var frictiony = -Math.sign(this.vel.y) * Math.abs(this.vel.y) * utils.friction

        this.draw()
    }
}