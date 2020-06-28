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
document.addEventListener('mousedown', mouseDown, false)
document.addEventListener('mouseup', mouseUp, false)

// red lol
const transRed = "rgba(255, 0, 0, .5)"

// master array of clusters to be drawn
var clusterArray = []

//key track of circle focus and focused index
var focused = {
    key: 0,
    state: false
}

// // object with x:0, y: 0
const zero = {
    x: 0,
    y: 0
}

// track mouse position on mousemove
var mousePosition

// track state of mousedown and up
var isMouseDown

// track state of mouse moving, used for buffer to detect stillness
var isMouseMoving

// currently grabbed circle
var grabbedCircle

// cluster we want grabbedCircle to travel to
var targetCluster

// buffer for mouse position calculations
var mouseBuffer = new Buffer(3, 0)


// When the mouse moves
function move(e) {
    isMouseMoving = true
    getMousePosition(e)

    clusterArray.map(cluster => cluster.hover = intersects(cluster))
    if (!isMouseDown) {
        return
    }

    mouseBuffer.addValue(mousePosition)

    //if any circle is focused
    if (focused.state) {
        grabbedCircle.pos = mousePosition
        grabbedCircle.fixed = true
        return
    }

    // no circle currently focused check if circle is hovered
    // to check if circle is hovered. If so, set focused to true then this won't run again

    // loop within cluster, not circle array
    for (const cluster of clusterArray) {
        if (intersects(cluster)) {
            grabbedCircle = cluster.grab()
            break
        }
    }
    if (grabbedCircle && intersects(grabbedCircle)) {
        grabbedCircle.pos = mousePosition
        grabbedCircle.fixed = true
        focused.state = true
    }

    // draw()
}

function mouseDown(e) {
    isMouseDown = true
}

function mouseUp(e) {
    isMouseDown = false
    if (focused.state) {
        // throwing circle
        setTargetCluster()
        grabbedCircle.fixed = false
        grabbedCircle.vel = mouseBuffer.instantVelocity()
    }
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
export function intersects(circle) {
    // subtract the x, y coordinates from the mouse position to get coordinates 
    // for the hotspot location and check against the area of the radius
    var areaX = mousePosition.x - circle.pos.x
    var areaY = mousePosition.y - circle.pos.y
    //return true if x^2 + y^2 <= radius squared.
    return areaX * areaX + areaY * areaY <= circle.radius * circle.radius
}

function addCluster(newCluster) {
    clusterArray.push(newCluster)
    // arrangeClusters()
}

function getClusterArrangement() {
    var num = clusterArray.length
    var arrangement = []
    var nsr = utils.nextSquareRoot(num)

    while (num !== 0) {
        var row = Math.min(nsr, num)
        num -= row
        arrangement.push(row)
    }
    return arrangement

}

function arrangeClusters() {
    var index = 0
    var arrangement = getClusterArrangement()
    var sizeY = -(arrangement.length * 500) / 2
    for (var row = 0; row < arrangement.length; row++) {
        if (row > 0 && arrangement[row] % 2 !== arrangement[row - 1] % 2) {
            sizeY -= 11
        }

        var sizeX = -(arrangement[row] * 100) / 2
        for (var i = 0; i < arrangement[row]; i++) {
            clusterArray[index].pos = { x: innerWidth / 4 + sizeX + 50, y: innerHeight / 4 + sizeY + 50 }
            clusterArray[index].arrange()
            sizeX += 1000
            index++
        }
        sizeY += 500
    }
}

// If grabbedCircle is thrown, finds the target cluster it needs to go to
// use math or some shit
function setTargetCluster() {
    for (const cluster of clusterArray) {
        // TODO: ALGO TO FIND TARGET CLUSTER HERE
        if (cluster.cluster.length > 4) {
            targetCluster = cluster
            return
        }
    }
}

// Draws all clusters which draws all circles in them
function drawClusters() {
    for (const cluster of clusterArray) {
        if (cluster.cluster.length === 0) {
            clusterArray.splice(clusterArray.indexOf(cluster), 1)
        } else {
            cluster.draw()
        }
    }
}

function drawMoving() {
    if (grabbedCircle) {
        for (const cluster of clusterArray) {
            // circle is moving and goes into another cluster
            if (grabbedCircle && cluster.circleWithinLarge(grabbedCircle) && !focused.state) {
                cluster.add(grabbedCircle)
                utils.applyFriction(grabbedCircle, 2)
                // grabbedCircle.fixed = true
                grabbedCircle = null
                return
            }
        }
        // create new cluster
        if (grabbedCircle && !isMouseDown) {
            // cases to create a new cluster
            if ( (grabbedCircle.vel.x === 0 && grabbedCircle.vel.y === 0) ||
                 mouseBuffer.isZero() || 
                 mouseBuffer.sharpTurn()) {
                var newCluster = new Cluster(grabbedCircle.pos.x, grabbedCircle.pos.y)
                newCluster.add(grabbedCircle)
                addCluster(newCluster)
                grabbedCircle.fixed = true
                grabbedCircle = null
                return
            }
        }
        
        
        // didn't collide with anything, didn't create a new cluster
        targetCluster ? utils.applyGravity(grabbedCircle, targetCluster) : null
        grabbedCircle.update()
    }
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


function setup() {
    //make some circles
    var c1 = new Circle(50, 50, 50, transRed, "red")
    var c2 = new Circle(200, 50, 50, transRed, "black")
    var c3 = new Circle(350, 50, 50, transRed, "black")
    var c4 = new Circle(350, 50, 50, transRed, "black")
    var c5 = new Circle(350, 50, 50, transRed, "black")

    var c6 = new Circle(50, 50, 50, transRed, "black")
    var c7 = new Circle(200, 50, 50, transRed, "black")
    var c8 = new Circle(350, 50, 50, transRed, "black")
    var c9 = new Circle(350, 50, 50, transRed, "black")
    var c10 = new Circle(350, 50, 50, transRed, "black")

    var cluster1 = new Cluster(innerWidth/4, innerHeight/2)
    cluster1.add(c1)
    cluster1.add(c2)
    cluster1.add(c3)
    cluster1.add(c4)
    cluster1.add(c5)

    var cluster2 = new Cluster(3*innerWidth/4, innerHeight/2)
    cluster2.add(c6)
    cluster2.add(c7)
    cluster2.add(c8)
    cluster2.add(c9)
    cluster2.add(c10)


    addCluster(cluster1)
    addCluster(cluster2)
}

function animate(e) {
    requestAnimationFrame(animate)
    ctx.clearRect(0, 0, innerWidth, innerHeight)

    // holding STILL
    if (isMouseDown && !isMouseMoving) {
        mouseBuffer.addValue(zero)
    }
    drawClusters()
    drawMoving()
    isMouseMoving = false
}

setup()
animate()