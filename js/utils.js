const friction = .01
const bigG = 900
const springConstant = .005

const zero = {
    x: 0, 
    y: 0
}

function dist(posA, posB) {
    return Math.hypot(posA.x - posB.x, posA.y - posB.y)
}

function nextSquareRoot(num) {
    if (Math.floor(Math.sqrt()) === Math.sqrt()) {
        return Math.floor(Math.sqrt(num))
    } else {
        return Math.floor(Math.sqrt(num)) + 1
    }
}

function applyFriction(circle, friction) {
    var friction = {
        x: -Math.sign(circle.vel.x) * Math.abs(circle.vel.x) * friction,
        y: -Math.sign(circle.vel.y) * Math.abs(circle.vel.y) * friction
    }
    circle.addForce(friction)
}

// only works for circle and cluster planets, both must have a pos
function applyGravity(circle, planet) {
    var distx = circle.pos.x - planet.pos.x
    var disty = circle.pos.y - planet.pos.y
    var distTotal = Math.hypot(distx, disty)

    var gravity = {
        x: -(distx / Math.pow(distTotal, 2)) * bigG,
        y: -(disty / Math.pow(distTotal, 2)) * bigG
    }
    circle.addForce(gravity)
}


function applyPull(circle, point) {
    var distx = circle.pos.x - point.x
    var disty = circle.pos.y - point.y

    var pull = {
        x: - distx * springConstant,
        y: - disty * springConstant
    }
    circle.addForce(pull)
}

export {friction, bigG, zero, dist, nextSquareRoot, applyFriction, applyGravity, applyPull}