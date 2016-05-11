var System = function (game) {
    this.planets    = {};
    this.ships      = {};
    this.playerShip = null;
    this.star       = null;

    this.canvas = null;

    this.xx = [];
    this.yy = [];
    this.zz = [];
};

System.prototype.update = function()
{
    if(this.canvas) {
        this.canvas.clear();

        for (var i = 0; i < 50; i++)
        {
            var perspective = 300 / (300 - this.zz[i]);
            var x = this.xx[i] * perspective + game.camera.view.width / 2;
            var y = this.yy[i] * perspective + game.camera.view.height / 2;

            this.zz[i] += 1;

            if (this.zz[i] > 300)
            {
                this.zz[i] -= 600;
            }

            this.canvas.beginFill(0xFFFFFF);
            this.canvas.drawEllipse(x, y, 1, 1);
        }
    }
};

System.prototype.render = function()
{
    if(this.playerShip && this.playerShip.line) {
        game.debug.geom(this.playerShip.line);
        game.debug.lineInfo(this.playerShip.line, 32, 32);
    }
};

System.prototype.action = function(message)
{
    var self = this;

    switch(message.event) {
        case 'auth':
            
            game.world.setBounds(0, 0, 6000, 6000);
            game.stage.disableVisibilityChange = true;
            game.add.sprite(game.world.width / 2 - 1000, game.world.height / 2 - 1000, 'background');

            this.canvas = game.add.graphics(game.camera.view.x, game.camera.view.y);
            this.canvas.fixedToCamera = true;

            for (var i = 0; i < 50; i++)
            {
                this.xx[i] = Math.floor(Math.random() * 800) - 400;
                this.yy[i] = Math.floor(Math.random() * 600) - 300;
                this.zz[i] = Math.floor(Math.random() * 1700) - 100;
            }

            self.addPlanets();

            self.addPlayer(message.id);
            
            game.trigger('sendPack', {
                'event': 'getShips',
                'id': this.playerShip.id,
                'currentPosition': {
                    'x': this.playerShip.x,
                    'y': this.playerShip.y
                },
                'nextPosition': this.playerShip.nextPosition
            });
            
            break;
        case 'getShips':

            if(message.ships) {
                message.ships.forEach(function(ship) {
                    self.addShip(ship);
                });

                game.trigger('systemLoaded');
            } else {
                self.addShip(message.ship);
            }
            
            break;
        case 'nextPosition':
            
            self.ships[message.id].nextPosition = message.nextPosition;
            
            break;
        case 'attack':
            // Атака игрока, target - цель, damage - урон, взять в таргет атакующего
            
            var target = null;
            if(self.playerShip.id === message.target) {
                target = self.playerShip;

                if(self.playerShip.attack === false) {
                    self.playerShip.attack = message.id;
                    self.playerShip.attackId = setInterval(function() {
                        self.playerShip.line.fromSprite(self.playerShip, self.ships[self.playerShip.attack], false);
                        game.trigger('sendPack', {
                            'event': 'attack',
                            'id': self.playerShip.id,
                            'target': self.playerShip.attack,
                            'currentPosition': {
                                'x': self.playerShip.x,
                                'y': self.playerShip.y
                            }
                        });
                    }, 1000);
                }

                if(self.playerShip.nextPosition.x === null && self.playerShip.nextPosition.y === null ) {
                    self.playerShip.follow = message.id;
                    self.playerShip.followId = setInterval(function() {
                        game.trigger('sendPack', {
                            'event': 'nextPosition',
                            'id': self.playerShip.id,
                            'target': self.playerShip.follow,
                            'nextPosition': {
                                'x': self.playerShip.nextPosition.x,
                                'y': self.playerShip.nextPosition.y
                            },
                            'currentPosition': {
                                'x': self.playerShip.x,
                                'y': self.playerShip.y
                            }
                        });
                    }, 250);
                    self.playerShip.nextPosition = self.ships[message.id].position;
                }
            } else {
                target = self.ships[message.target];
            }

            if(target !== null) {
                target.health -= message.damage;

                if(target.health < 0) {

                    self.playerShip.follow = false;
                    self.playerShip.attack = false;
                    clearInterval(self.playerShip.attackId);
                    clearInterval(self.playerShip.followId);

                    target.pendingDestroy = true;

                    if(self.playerShip.id === message.target) {
                        self.playerShip = null;
                    } else {
                        delete self.ships[message.target];
                    }
                }
            }
            
            break;
        case 'exit':
            
            var ship = self.ships[message.id];
            ship.pendingDestroy = true;
            delete self.ships[message.id];
            
            break;
    }
};

System.prototype.addPlanets = function()
{
    var self = this,
        speed = 0.0004,
        distance = 0,
        size = 0.7;

    this.star = new Star(game, 'solar');
    game.add.existing(this.star);
    game.gui.minimap.gameObjects.push(this.star);

    [1,2,3,4,5].forEach(function(id) {
        speed += 0.0001;
        distance += 500;

        var planet = new Planet(game, 'solar', size, distance, speed);
        self.planets[planet] = game.add.existing(planet);
        game.gui.minimap.gameObjects.push(planet);
    });
};

System.prototype.addPlayer = function(id)
{
    this.playerShip = new PlayerShip(game, id);
    game.add.existing(this.playerShip);

    game.physics.enable(this.playerShip, Phaser.Physics.ARCADE);
    this.playerShip.body.collideWorldBounds = true;

    game.camera.follow(this.playerShip);
    game.gui.minimap.gameObjects.push(this.playerShip);
};

System.prototype.addShip = function(ship)
{
    var newShip = new Ship(game, 'people', ship.id, ship.currentPosition, ship.nextPosition);

    game.physics.enable(newShip, Phaser.Physics.ARCADE);
    newShip.body.collideWorldBounds = true;
    this.ships[ship.id] = game.add.existing(newShip);
    game.gui.minimap.gameObjects.push(newShip);

    this.playerShip.bringToTop();
};