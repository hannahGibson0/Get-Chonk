var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var player;
var fishes;
var hams;
var cursors;
var gameOver = false;
var currentScale= 1;
var playerHeight = 48;
var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('sky', 'assets/sky.png');
    this.load.image('ground', 'assets/floor.png');
    this.load.image('fish', 'assets/fish.png');
    this.load.image('ham', 'assets/ham.png');
    this.load.spritesheet('player', 'assets/ghost.png', { frameWidth: 32, frameHeight: 48 });
}

function create ()
{
    this.add.image(400, 300, 'sky');

    platforms = this.physics.add.staticGroup();
    platforms.create(400, 570, 'ground').setScale(2).refreshBody();

    // The player and its settings
    player = this.physics.add.sprite(100, 450, 'player');
    player.setBounce(0.5);
    player.setCollideWorldBounds(true);

    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'turn',
        frames: [ { key: 'player', frame: 4 } ],
        frameRate: 20
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('player', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });



    //  Input Events
    cursors = this.input.keyboard.createCursorKeys();

    var random = Math.floor(Math.random() * 11) + 1;
    

    var fishCount = random;
    var hamCount = 11 - random;


    var fishStep = 770/fishCount;
    var hamStep = 760/hamCount;
    

    fishes = this.physics.add.group({key: 'fish', repeat: fishCount, setXY: { x: random + 12, y: 0, stepX: fishStep }});
    hams = this.physics.add.group({key: 'ham', repeat: hamCount, setXY: { x: random + 22, y: 0, stepX: hamStep} });

    fishes.children.iterate(function (child) {
        child.setBounceY(Phaser.Math.FloatBetween(0.5, 0.6));
    });
        
    hams.children.iterate(function (child) {
        child.setBounceY(Phaser.Math.FloatBetween(0.5, 0.6));
    });

    //Don't fall through the floor
    this.physics.add.collider(player, platforms);
    this.physics.add.collider(fishes, platforms);
    this.physics.add.collider(hams, platforms);

    //Eat the foods
    this.physics.add.overlap(player, fishes, pickupFood, null, this);
    this.physics.add.overlap(player, hams, pickupFood, null, this);

}

function update ()
{
    if (gameOver)
    {
        return;
    }

    if (cursors.left.isDown)
    {
        player.setVelocityX(-120);

        player.anims.play('left', true);
    }
    else if (cursors.right.isDown)
    {
        player.setVelocityX(120);

        player.anims.play('right', true);
    }
    else
    {
        player.setVelocityX(0);

        player.anims.play('turn');
    }

    if (cursors.up.isDown && player.body.touching.down)
    {
        player.setVelocityY(-330);
    }
}


function pickupFood (player, food)
{
    food.disableBody(true, true);

    currentScale += 0.25;
   
    player.setScale(currentScale);
    moveUp = (playerHeight + (0.25 * playerHeight)) - playerHeight;
    player.setY(player.y - moveUp);

    var fishCount = fishes.countActive(true);
    var hamCount = hams.countActive(true);


    if ((fishes.countActive(true) === 0) && (hams.countActive(true) === 0)) {

        fishes.children.iterate(function (child) {
          child.enableBody(true, child.x, 0, true, true);
        });

        hams.children.iterate(function (child) {
            child.enableBody(true, child.x, 0, true, true);
        });

        var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
    }
}


