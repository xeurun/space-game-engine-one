var PlayerShip = function(game, id) {
    Phaser.Sprite.call(this, game, game.world.width / 2, game.world.height / 2, 'people');

    var self = this;

    this.scale.setTo(0.2, 0.2);
    this.anchor.setTo(0.5, 0.5);

    this.id = id;
    this.SPEED = 200;
    this.follow = false;
    this.followId = 0;
    this.attack = false;
    this.attackId = 0;
    this.TURN_RATE = 5;
    this.nextPosition = {
        'x': null,
        'y': null
    };
    this.health = 10000;

    this.line = new Phaser.Line(0, 0, 0, 0);

    this.animations.add('run');
    this.animations.play('run', 49, true);
    this.animations.currentAnim.speed = 15;
    this.z = 10;

    this.inputEnabled = true;
    this.input.priorityID = 2;
    this.input.useHandCursor = true;
    this.events.onInputOver.add(function(sprite, pointer) {
        var element = document.getElementById('shipInfo');
        element.textContent = sprite.health;
        element.style.top = sprite.worldPosition.y + (sprite.height / 2) + 'px';
        element.style.left = sprite.worldPosition.x + (sprite.width / 2) + 'px';
        element.style.display = 'block';
    }, this);
    this.events.onInputOut.add(function(sprite, pointer) {
        var element = document.getElementById('shipInfo');
        element.style.display = 'none';
    }, this);

    game.input.mouse.capture = true;
    game.input.onUp.add(function (pointer, event) {
        if (game.input.activePointer.leftButton.isDown && pointer.currentTarget == null)
        {
            if (self.follow) {
                if(self.attack) {
                    self.attack = false;

                    if (self.attackId > 0) {
                        clearInterval(self.attackId);
                    }
                }
                
                self.follow = false;

                if (self.followId > 0) {
                    clearInterval(self.followId);
                }
            }

            self.nextPosition = {
                x: game.input.activePointer.worldX,
                y: game.input.activePointer.worldY
            };

            game.trigger('sendPack', {
                'event': 'nextPosition',
                'id': self.id,
                'currentPosition': {
                    'x': self.x,
                    'y': self.y
                },
                'nextPosition': {
                    'x': self.nextPosition.x,
                    'y': self.nextPosition.y
                }
            });
        }
        
        pointer.currentTarget = null;
    }, this);
};

PlayerShip.prototype = Object.create(Phaser.Sprite.prototype);
PlayerShip.prototype.constructor = PlayerShip;

PlayerShip.prototype.update = function() {
    if (this.nextPosition.x != null && this.nextPosition.y != null) {
        var targetAngle = game.math.angleBetween(
            this.x, this.y,
            this.nextPosition.x, this.nextPosition.y
        );

        if (this.rotation !== targetAngle) {
            var delta = targetAngle - this.rotation;

            if (delta > Math.PI) delta -= Math.PI * 2;
            if (delta < -Math.PI) delta += Math.PI * 2;

            if (delta > 0) {
                this.angle += this.TURN_RATE;
            } else {
                this.angle -= this.TURN_RATE;
            }

            if (Math.abs(delta) < this.game.math.degToRad(this.TURN_RATE)) {
                this.rotation = targetAngle;
            }
        }

        this.body.velocity.x = Math.cos(this.rotation) * this.SPEED;
        this.body.velocity.y = Math.sin(this.rotation) * this.SPEED;

        if (Phaser.Rectangle.contains(this.body, this.nextPosition.x, this.nextPosition.y) && !this.follow) {
            game.gui.pathEnd.visible = false;
            this.body.velocity.setTo(0, 0);
            this.nextPosition = {
                x: null,
                y: null
            };
        }
    }
};