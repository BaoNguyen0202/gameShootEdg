import { Application, Sprite } from 'pixi.js';

export class Player {
    constructor() {
        var player = Sprite.from('/assets/images/pic.png');
        player.width = 50;
        player.height = 50;
        player.x = 100;
        player.y = 200;
        // player.anchor.set(0, 0);
    }
}
