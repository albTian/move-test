const friction = .005
const bigG = 499

function applyFriction(circle) {
    var friction = {}
    friction.x = -Math.sign(circle.vel.x) * Math.abs(circle.vel.x) * this.friction
    friction.y = -Math.sign(circle.vel.y) * Math.abs(circle.vel.y) * this.friction
    circle.addForce(friction)
}

export {friction, bigG, applyFriction}