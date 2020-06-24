export default class Buffer {
    constructor(size, layers) {
        this.size = size
        this.buffer = []
        // if (layers) {
        //     this.vbuffer = new Buffer(size - 1, layers - 1)
        // } else {
        //     this.vbuffer = {addValue: () => null}
        // }
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

    dummyVelocity() {
        return (this.buffer[this.buffer.length - 1] - this.buffer[0]) / 2
    }

    avgVelocity() {
        var sum = 0
        this.vbuffer.map(velocity => sum += velocity)
        return sum / this.vbuffer.length
    }
}