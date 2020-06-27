import { ctx, intersects } from './canvas.js'

export default class Cluster {
    constructor(x, y) {
        this.pos = {
            x: x,
            y: y
        }
        this.radius = 0
        this.cluster = []

        this.hover = false
    }

    nextSquareRoot(num) {
        if (Math.floor(Math.sqrt()) === Math.sqrt()) {
            return Math.floor(Math.sqrt(num)) 
        } else {
            return Math.floor(Math.sqrt(num)) + 1
        }
    }

    getArrangement() {
        var num = this.cluster.length
        var arrangement = []
        var nsr = this.nextSquareRoot(num)
        
        while (num !== 0) {
            var row = Math.min(nsr, num)
            num -= row
            arrangement.push(row)
        }

        return arrangement
    }

    arrange() {
        var index = 0
        var arrangement = this.getArrangement()
        var sizeY = -(arrangement.length * 100) / 2
        for (var row = 0; row < arrangement.length; row++) {
            if (row > 0 && arrangement[row] % 2 !== arrangement[row - 1] % 2) {
                sizeY -= 11
            }

            var sizeX = -(arrangement[row] * 100) / 2
            for (var i = 0; i < arrangement[row]; i++) {
                this.cluster[index].setPos({x: this.pos.x + sizeX + 50, y: this.pos.y + sizeY + 50})
                this.cluster[index].setSpeed({x: 0, y: 0})
                this.cluster[index].setAcceleration({x: 0, y: 0})
                this.cluster[index].fixed = true
                sizeX += 100
                index++
            }
            sizeY += 100
        }
    }

    // boolean of a circle is within this cluster
    circleWithin(circle) {
        var areaX = circle.pos.x - this.pos.x
        var areaY = circle.pos.y - this.pos.y
        return areaX * areaX + areaY * areaY <= this.radius * this.radius
    }

    // larger radius within
    circleWithinLarge(circle) {
        var areaX = circle.pos.x - this.pos.x
        var areaY = circle.pos.y - this.pos.y
        return areaX * areaX + areaY * areaY <= this.radius * this.radius
    }

    // returns the circle being grabed
    grab() {
        for (const circle of this.cluster) {
            if (intersects(circle)) {
                this.remove(circle)
                return circle
            }
        }
    }
    



    draw() {
        this.radius = 2*this.nextSquareRoot(this.cluster.length)*50/Math.sqrt(2)
        
        ctx.beginPath()
        ctx.arc(this.pos.x, this.pos.y, this.radius, 0, 2 * Math.PI)
        ctx.fillStyle = this.hover ? "rgb(211,211,211)" : "rgb(255,255,255)"
        ctx.lineWidth = 3
        ctx.fill()
        ctx.strokeStyle = "black"
        ctx.stroke()

        for (const circle of this.cluster) {
            // if (!this.circleWithin(circle)) {
            //     // console.log('removed')
            //     this.remove(circle)
            // }
            circle.update()
        }

    }

    remove(circle) {
        this.cluster.splice(this.cluster.indexOf(circle), 1)
        this.arrange()
    }

    add(circle) {
        this.cluster.push(circle)
        this.arrange()
    }
}