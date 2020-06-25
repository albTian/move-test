import Circle from './Circle.js'
import Buffer from './Buffer.js'
import Cluster from './Cluster.js'
import * as utils from './utils.js'
 


//reference to the canvas element
const c = document.querySelector("canvas")
c.width = window.innerWidth
c.height = window.innerHeight

//reference to 2d context
export const ctx = c.getContext("2d")


//add listeners
document.addEventListener('mousemove', move, false)
document.addEventListener('mousedown', setDraggable, false)
document.addEventListener('mouseup', setDraggable, false)

//key track of circle focus and focused index
var focused = {
    key: 0,
    state: false
}

//track mouse position on mousemove
var mousePosition
//track state of mousedown and up
var isMouseDown

// array for everything that needs to be drawn
var toDraw = []

var mouseBuffer = new Buffer(10, 0)

//main draw method
function draw() {
    //clear canvas
    ctx.clearRect(0, 0, c.width, c.height)
    drawCircles()
}

// // gravity
// var distx = this.pos.x - planet.pos.x
// var disty = this.pos.y - planet.pos.y


// var distTotal = Math.hypot(distx, disty)
// this.acc.x = -(distx / Math.pow(distTotal, 2)) * utils.bigG + frictionx
// this.acc.y = -(disty / Math.pow(distTotal, 2)) * utils.bigG + frictiony

function applyFriction(circle) {
    var friction = {}
    friction.x = -Math.sign(circle.vel.x) * Math.abs(circle.vel.x) * utils.friction
    friction.y = -Math.sign(circle.vel.y) * Math.abs(circle.vel.y) * utils.friction
    circle.addForce(friction)
}

function applyGravity(circle) {
    // hard coded planet
    var distx = circle.pos.x - planet.pos.x
    var disty = circle.pos.y - planet.pos.y
    var distTotal = Math.hypot(distx, disty)

    var gravity = {}
    gravity.x = -(distx / Math.pow(distTotal, 2)) * utils.bigG
    gravity.y = -(disty / Math.pow(distTotal, 2)) * utils.bigG
    circle.addForce(gravity)
}

// applies the universal forces and draws circles
function drawCircles() {
    for (const circle of circleArray) {
        applyFriction(circle)
        applyGravity(circle)
        // var friction = {}
        // friction.x = -Math.sign(circle.vel.x) * Math.abs(circle.vel.x) * utils.friction
        // friction.y = -Math.sign(circle.vel.y) * Math.abs(circle.vel.y) * utils.friction
        // circle.addForce(friction)
        circle.update()
    }

}

function move(e) {
    if (!isMouseDown) {
        return
    }
    getMousePosition(e)

    mouseBuffer.addValue(mousePosition)

    //if any circle is focused
    if (focused.state) {
        // circleArray[focused.key].pos.x = mousePosition.x
        // circleArray[focused.key].pos.y = mousePosition.y
        circleArray[focused.key].pos = mousePosition
        circleArray[focused.key].fixed = true
        // draw()
        return
    }

    // no circle currently focused check if circle is hovered
    // to check if circle is hovered. If so, set focused to true then this won't run again
    for (var i = 0; i < circleArray.length; i++) {
        if (intersects(circleArray[i])) {
            circleArray.move(i, 0)
            focused.state = true
            break
        }
    }
    // draw()
}

//set mousedown state
function setDraggable(e) {
    var t = e.type
    if (t === "mousedown") {
        isMouseDown = true
    } else if (t === "mouseup") {
        isMouseDown = false

        // throwing a circle
        if (focused.state) {
            circleArray[focused.key].fixed = false
            circleArray[focused.key].setSpeed(mouseBuffer.instantVelocity())
        }
        releaseFocus()
    }
}

function releaseFocus() {
    focused.state = false
}

function getMousePosition(e) {
    var rect = c.getBoundingClientRect()
    mousePosition = {
        x: Math.round(e.x - rect.left),
        y: Math.round(e.y - rect.top)
    }
}

//detects whether the mouse cursor is between x and y relative to the radius specified
function intersects(circle) {
    // subtract the x, y coordinates from the mouse position to get coordinates 
    // for the hotspot location and check against the area of the radius
    var areaX = mousePosition.x - circle.pos.x
    var areaY = mousePosition.y - circle.pos.y
    //return true if x^2 + y^2 <= radius squared.
    return areaX * areaX + areaY * areaY <= circle.radius * circle.radius
}

Array.prototype.move = function (old_index, new_index) {
    if (new_index >= this.length) {
        var k = new_index - this.length
        while ((k--) + 1) {
            this.push(undefined)
        }
    }
    this.splice(new_index, 0, this.splice(old_index, 1)[0])
}

//make some circles
var c1 = new Circle(50, 50, 50, "red", "black")
var c2 = new Circle(200, 50, 50, "green", "black")
var c3 = new Circle(350, 50, 50, "blue", "black")

//initialise our circles
var circleArray = [c1, c2, c3]

export var planet = new Circle(500, 500, 50, "black", "black")
planet.fixed = true

var cluster1 = new Cluster(500, 500)


function animate() {
    requestAnimationFrame(animate)
    ctx.clearRect(0, 0, innerWidth, innerHeight)
    planet.update()
    drawCircles()

}

animate()