var Space = function(game)
{
    this.ws         = null;
    this.system     = null;
    this.triggers   = new Phaser.Signal();
};

Space.prototype.preload = function()
{
    game.time.advancedTiming = true;
    game.stage.backgroundColor = 0x000000;
    game.load.image('background', 'assets/bg/bg11.jpg');
    game.load.image('solar', 'assets/planet/solar.png');
    game.load.image('pathEnd', 'assets/gui/PathEndMove_000.png');
    game.load.atlasJSONHash('people', 'assets/ship/people.png', 'assets/ship/people.json');
};

Space.prototype.create = function()
{
    var self = this;

    game.gui = new GUI(game);

    game.trigger = function (name, data, subject) {
        self.triggers.dispatch(name, data, subject);
    };

    self.triggers.add(function(name, message, subject) {
        switch(name) {
            case 'sendPack':
                self.ws.send(JSON.stringify(message));
                break;
            case 'getPack':
                self.system.action(message);
                break;
            case 'focusPlayer':
                game.camera.follow(self.system.playerShip);
                break;
            case 'systemLoaded':
                game.gui.draw();
                break;
            case 'follow':
                if (self.system.playerShip.follow !== false) {
                    self.system.playerShip.attack = subject.id;
                    self.system.playerShip.attackId = setInterval(function() {
                        self.system.playerShip.line.fromSprite(self.system.playerShip, self.system.ships[self.system.playerShip.attack], false);
                        game.trigger('sendPack', {
                            'event': 'attack',
                            'id': self.system.playerShip.id,
                            'target': self.system.playerShip.attack,
                            'currentPosition': {
                                'x': self.system.playerShip.x,
                                'y': self.system.playerShip.y
                            }
                        });
                    }, 1000);
                } else {
                    self.system.playerShip.follow = subject.id;
                    self.system.playerShip.followId = setInterval(function() {
                        game.trigger('sendPack', {
                            'event': 'nextPosition',
                            'id': self.system.playerShip.id,
                            'target': self.system.playerShip.follow,
                            'nextPosition': {
                                'x': self.system.playerShip.nextPosition.x,
                                'y': self.system.playerShip.nextPosition.y
                            },
                            'currentPosition': {
                                'x': self.system.playerShip.x,
                                'y': self.system.playerShip.y
                            }
                        });
                    }, 250);
                    self.system.playerShip.nextPosition = subject.position;
                }
                break;
        }
    }, this);
    
    this.connect('192.168.99.100', '8181');
    
    this.system = new System(game);
};

Space.prototype.update = function()
{
    game.gui.update();
    this.system.update();
};

Space.prototype.connect = function(ip, port)
{
    this.ws = new WebSocket('ws://' + ip + ':' + port);

    this.ws.onopen = function(e) {
        console.log('Open: ' + e);
    };
    this.ws.onclose = function(e) {
        console.log('Close: ' + e);
    };
    this.ws.onerror = function(e) {
        console.log('Error: ' + e);
    };
    this.ws.onmessage = function(e) {
        console.log('Get message: ' + e.data);
        var message = JSON.parse(e.data);
        game.trigger('getPack', message);
    };
};

Space.prototype.render = function()
{
    game.debug.text(game.time.fps, 2, 14, "#00ff00");
    this.system.render();
    /*
     game.debug.cameraInfo(game.camera, 500, 32);
     if(this.system !== null && this.system.playerShip !== null) {
     game.debug.spriteCoords(this.system.playerShip, 32, 32);
     game.debug.spriteInfo(this.system.playerShip, 20, 128);
     game.debug.spriteBounds(this.playerShip);
     game.debug.body(this.playerShip);
     }
     game.debug.inputInfo(32, 256);
     game.debug.pointer( game.input.activePointer );
     */
};