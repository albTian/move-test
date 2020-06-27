const friction = .005
const bigG = 400

function applyFriction(circle) {
    var friction = {}
    friction.x = -Math.sign(circle.vel.x) * Math.abs(circle.vel.x) * this.friction
    friction.y = -Math.sign(circle.vel.y) * Math.abs(circle.vel.y) * this.friction
    circle.addForce(friction)
}

function applyGravity(circle, planet) {
    // hard coded planet
    var distx = circle.pos.x - planet.pos.x
    var disty = circle.pos.y - planet.pos.y
    var distTotal = Math.hypot(distx, disty)

    var gravity = {
        x: -(distx / Math.pow(distTotal, 2)) * bigG * planet.cluster.length,
        y: -(disty / Math.pow(distTotal, 2)) * bigG * planet.cluster.length
    }
    // gravity.x = -(distx / Math.pow(distTotal, 2)) * bigG
    // gravity.y = -(disty / Math.pow(distTotal, 2)) * bigG
    circle.addForce(gravity)
}

export {friction, bigG, applyFriction, applyGravity}