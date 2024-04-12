export default class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    add(vector) {
        return new Vector(this.x + vector.x, this.y + vector.y);
    }
    distance(vector) {
        return Math.sqrt(((this.x - vector.x) * (this.x - vector.x)) + ((this.y - vector.y) * (this.y - vector.y)));
    }
    toString() {
        return `(${this.x}, ${this.y})`;
    }   
}

