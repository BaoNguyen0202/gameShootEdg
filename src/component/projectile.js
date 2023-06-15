import { PIXI, Application, Sprite, Graphics } from 'pixi.js';
import { Player } from './player';
const player = new Player();
export class Bullet {
    constructor({ position, velocity }) {
        this.position = position;
        this.velocity = velocity;
        let bullet = Sprite.from('/assets/images/bullet.png');
        bullet.x = player.position.x + player.width / 2;
        bullet.y = player.position.y + player.height / 2 - 35;
        bullet.rotation = -Math.PI / 2;
        bg.addChild(bullet);
    }
}
