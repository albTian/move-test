export default class Circle {
    constructor(x, y, r, fill, stroke, ctx) {
        this.startingAngle = 0
        this.endAngle = 2 * Math.PI
        this.x = x
        this.y = y

        this.dx = 0
        this.dy = 0

        this.ax = 0
        this.ay = 0

        this.r = r
        this.fill = fill
        this.stroke = stroke

        this.ctx = ctx
    }


    draw() {
        this.ctx.beginPath()
        this.ctx.arc(this.x, this.y, this.r, this.startingAngle, this.endAngle)
        this.ctx.fillStyle = this.fill
        this.ctx.lineWidth = 3
        this.ctx.fill()
        this.ctx.strokeStyle = this.stroke
        this.ctx.stroke()
    }

    update() {
        this.x += this.dx
        this.y += this.dy
        this.draw()
    }
}