import { Application, Color, Container, Sprite, Graphics } from 'pixi.js';
import { Sound } from '@pixi/sound';
import { GameConstant } from './GameConstant';
// import { Bullet } from './projectile';
// import Projectile from './projectile';
// import Background from './backgroud';
// import Player from './player';

let WIDTH = window.innerWidth;
let HEITH = window.innerHeight;
const keys = {
    a: {
        pressed: false,
    },
    d: {
        pressed: false,
    },
    w: {
        pressed: false,
    },
    s: {
        pressed: false,
    },
    space: {
        pressed: false,
    },
};
let bullets = [];
let bulletSpeed = 2;
class Invader {
    constructor({ position }) {
        this.velocity = {
            x: 0,
            y: 0,
        };

        const image = new Image();
        image.src = '/assets/images/edg.png';
        image.onload = () => {
            const scale = 1.2;
            this.image = image;
            this.width = image.width * scale;
            this.height = image.height * scale;
            this.position = {
                x: position.x,
                y: position.y,
            };
        };
    }
    draw() {
        c.drawImage(
            this.image,
            this.position.x,
            this.position.y,
            this.width,
            this.height,
        );
    }
    update({ velocity }) {
        if (this.image) {
            this.draw();
            this.position.x += velocity.x;
            this.position.y += velocity.y;
        }
    }
}
class Grid {
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
        const rows = Math.floor(Math.random() * 5 + 5);
        const colums = Math.floor(Math.random() * 10 + 10);
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
            this.position.x + this.width >= GameConstant.GAME_WIDTH ||
            this.position.x <= 0
        ) {
            this.velocity.x = -this.velocity.x;
        }
    }
}
const grids = [];
let frames = 0;
export class Game {
    static init() {
        this.app = new Application({
            width: GameConstant.GAME_WIDTH,
            height: GameConstant.GAME_HEIGHT,
            backgroundColor: 'blue',
        });
        document.body.appendChild(this.app.view);
        const viewStyle = this.app.view.style;
        viewStyle.position = 'absolute';
        viewStyle.display = 'block';
        viewStyle.padding = '0px 0px 0px 0px';
        this.resize(window.innerWidth, window.innerHeight);

        const bg = Sprite.from('/assets/images/bgs.png');
        bg.width = window.innerWidth;
        bg.height = window.innerHeight;
        console.log(bg.width, 'bg');
        // bg.anchor.set(0.5);
        this.app.stage.addChild(bg);
        var player = Sprite.from('/assets/images/pic.png');
        player.width = 50;
        player.height = 50;
        player.x = 200;
        player.y = 200;
        // player.anchor.set(0, 0);

        bg.addChild(player);

        // let bullet = Sprite.from('/assets/images/bullet.png');
        // bullet.x = player.position.x + player.width / 2;
        // bullet.y = player.position.y + player.height / 2 - 35;
        // bullet.rotation = -Math.PI / 2;
        // bg.addChild(bullet);

        class Bullet {
            constructor() {
                let bullet = Sprite.from('/assets/images/bullet.png');
                bullet.x = player.x;
                bullet.y = player.y;
                bullet.anchor.set(0.5);
                bullet.rotation = -Math.PI / 2;
                bg.addChild(bullet);
            }
        }
        grids.forEach((grid, index) => {
            if (grid.position.y + grid.radius >= GameConstant.GAME_HEIGHT) {
                grids.splice(index, 1);
                console.log('GAME OVER');
            } else {
                grid.update();
                grid.invaders.forEach((invader) => {
                    invader.update({
                        velocity: grid.velocity,
                        position: grid.position,
                    });
                });
            }
            grids.push(new Grid());
            // if (frames % 500 === 0) {
            //     grids.push(new Grid());
            // }
            // frames++;
        });
        const soundoff = Sound.from('/assets/sound/shoot02wav-14562.mp3');
        const soungruning = Sound.from(
            '/assets/sound/running-in-grass-6237.mp3',
        );
        this.app.ticker.add(animate);
        function animate(delta) {
            updateBullet(delta);
            if (keys.a.pressed && player.position.x >= 0) {
                soungruning.play();
                player.x += -8;
            } else if (keys.d.pressed && player.position.x <= 725) {
                soungruning.play();
                player.x += 8;
            } else if (keys.w.pressed && player.position.y >= 0) {
                soungruning.play();
                player.y += -8;
            } else if (
                keys.s.pressed &&
                player.position.y + player.width - 20 <= 250
            ) {
                soungruning.play();

                player.y += 8;
            } else if (keys.space.pressed) {
                fireBullet();
                // let bullet = createBullet();
                // bullets.push(bullet);
                soundoff.play();
                console.log('fire');
                // bullet.y += -40;
            } else {
                soungruning.stop();
            }
        }
        function fireBullet(e) {
            console.log('fire');
            let bullet = createBullet();
            bullets.push(bullet);
        }
        console.log(bullets);
        function updateBullet(delta) {
            for (let i = 0; i < bullets.length; i++) {
                bullets[i].position.y -= bullets[i].speed;
            }
        }
        function createBullet() {
            let bullet = Sprite.from('/assets/images/bullet.png');
            bullet.x = player.x;
            bullet.y = player.y;
            bullet.speed = bulletSpeed;
            bullet.anchor.set(0.5);
            bullet.rotation = -Math.PI / 2;
            bg.addChild(bullet);
            return bullet;
        }
    }

    static resize(width, height) {
        let style = this.app.view.style;
        this.windowWidth = width;
        this.windowHeight = height;
        let ratio = Math.max(
            GameConstant.GAME_WIDTH / this.windowWidth,
            GameConstant.GAME_HEIGHT / this.windowHeight,
        );
        this.width = this.windowWidth * ratio;
        this.height = this.windowHeight * ratio;
        this.app.view.width = this.width;
        this.app.view.height = this.height;
        let scale = this.windowWidth / this.width;
        style.transformOrigin = '0px 0px';
        style.transform = `scale(${scale})`;
        let vMargin = Math.floor((this.windowWidth - this.width * scale) / 2);
        let hMargin = Math.floor((this.windowHeight - this.height * scale) / 2);

        style.margin = `${hMargin}px ${vMargin}px ${hMargin}px ${vMargin}px`;
        this.app.resizeTo = this.app.view;
        this.app.resize();
    }
}

window.onload = function () {
    Game.init();
    addEventListener('keydown', ({ key }) => {
        switch (key) {
            case 'a':
                keys.a.pressed = true;
                break;
            case 'd':
                keys.d.pressed = true;
                break;
            case 'w':
                keys.w.pressed = true;
                break;
            case 's':
                keys.s.pressed = true;
                break;
            case ' ':
                keys.space.pressed = true;
                break;
        }
    });
    addEventListener('keyup', ({ key }) => {
        console.log(key);
        switch (key) {
            case 'a':
                keys.a.pressed = false;
                break;
            case 'd':
                keys.d.pressed = false;
                break;
            case 'w':
                keys.w.pressed = false;
                break;
            case 's':
                keys.s.pressed = false;
                break;
            case ' ':
                keys.space.pressed = false;
                break;
        }
    });
    // window.addEventListener('keydown', keysDown);
    // window.addEventListener('keyup', keysUp);
};
// function keysDown(e) {
//     switch (e) {
//         case '65':
//             keys[65].pressed = true;
//             break;
//         case '68':
//             keys[68].pressed = true;
//             break;
//         case '87':
//             keys[87].pressed = true;
//             break;
//         case '73':
//             keys[73].pressed = true;
//             break;
//     }
//     // keys[e.keyCode] = true;
// }
// function keysUp(e) {
//     switch (e) {
//         case '65':
//             keys[65].pressed = false;
//             break;
//         case '68':
//             keys[68].pressed = false;
//             break;
//         case '87':
//             keys[87].pressed = false;
//             break;
//         case '73':
//             keys[73].pressed = false;
//             break;
//     }
// }
