export default class Cluster {
    constructor(x, y) {
        this.x = x
        this.y = y
        this.cluster = []
    }

    nextSquareRoot(num) {
        if (Math.floor(Math.sqrt()) === Math.sqrt()) {
            return Math.floor(Math.sqrt(num)) - 1
        } else {
            return Math.floor(Math.sqrt(num))
        }
    }

    getArrangement() {
        var num = cluster.length
        var arrangement = []
        var nsr = this.nextSquareRoot(num)
        
        while (num !== 0) {
            var row = Math.min(nsr, num)
            num -= row
            arrangement.push(row)
        }

        return arrangement
    }
}