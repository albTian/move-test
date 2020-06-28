export default class Buffer {
    constructor(size, layers) {
        this.size = size
        this.buffer = []

        this.vbuffer = []
    }

    addValue(value) {
        if (this.buffer.length < this.size) {
            this.buffer.push(value)
            this.vbuffer.push((this.buffer[this.buffer.length - 1] - value) / 2)
        } else {
            const lastValue = this.buffer[this.buffer.length - 1]
            this.buffer.shift()
            this.buffer.push(value)

            this.vbuffer.push((value - lastValue) / 2)
        }
    }

    isZero() {
        // checks if this buffer contains zero
        for (const value of this.buffer) {
            if (value.x === 0 || value.y === 0) {
                return true
            }
        }
        return false
    }

    sharpTurn() {
        return false
    }

    dummyVelocity() {
        const firstPos = this.buffer[0]
        const lastPos = this.buffer[this.buffer.length - 1]

        var velocity = {
            x: (lastPos.x - firstPos.x) / 2,
            y: (lastPos.y - firstPos.y) / 2
        }
        return velocity
    }

    instantVelocity() {
        const firstPos = this.buffer[this.buffer.length - 2]
        const lastPos = this.buffer[this.buffer.length - 1]

        var velocity = {
            x: (lastPos.x - firstPos.x) / 2,
            y: (lastPos.y - firstPos.y) / 2
        }
        return velocity
    }

    avgVelocity() {
        var sum = 0
        this.vbuffer.map(velocity => sum += velocity)
        return sum / this.vbuffer.length
    }
}