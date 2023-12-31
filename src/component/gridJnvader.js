import Invader from './invader';
export default class Grid {
    constructor() {
        this.position = {
            x: 0,
            y: 0,
        };
        this.velocity = {
            x: 10,
            y: 3,
        };
        this.radius = 1;

        this.invaders = [];
        const rows = Math.floor(Math.random() * 5 + 10);
        const colums = Math.floor(Math.random() * 10 + 30);
        this.width = colums * 30;
        for (let x = 0; x < colums; x++) {
            for (let y = 0; y < rows; y++) {
                this.invaders.push(
                    new Invader({
                        position: {
                            x: x * 50,
                            y: y * 20,
                        },
                    }),
                );
            }
        }
    }
    update() {
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        if (
            this.position.x + this.width >= canvas.width ||
            this.position.x <= 0
        ) {
            this.velocity.x = -this.velocity.x;
        }
    }
}
