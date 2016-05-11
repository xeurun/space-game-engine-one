var Minimap = function (game) {
    var self = this;
    
    this.gameObjects = [];
    this.resolution = 0.05;
    this.viewResolution = {
        'width': game.camera.view.width * this.resolution,
        'height': game.camera.view.height * this.resolution
    };
    
    this.draw = function(playerShip) {
        var miniMapContainer = game.add.group(),
            bg = game.add.graphics(0, 0);

        this.viewRect = game.add.graphics(300, 300);
        this.viewRect.fixedToCamera = true;

        this.unitDots = game.add.graphics(300, 300);
        this.unitDots.fixedToCamera = true;
        
        bg.beginFill(0xffffff, 0.5);
        bg.drawRect(game.camera.view.width - 300, 0, 300, 300);
        bg.fixedToCamera = true;
        bg.inputEnabled = true;
        bg.events.onInputDown.add(function (sprite, pointer) {
            pointer.currentTarget = sprite;

            game.camera.follow(null);

            var x = 300 - (game.width - pointer.positionDown.x),
                y = pointer.positionDown.y;

            game.camera.view.x = x * 6000 / 300 - game.camera.view.width / 2;
            game.camera.view.y = y * 6000/300 - game.camera.view.height / 2;
        }, this);

        var button = game.make.sprite(game.camera.view.width - 300, 268, 'focusPlayer');
        button.fixedToCamera = true;
        button.inputEnabled = true;
        button.input.priorityID = 2;
        button.input.useHandCursor = true;
        button.events.onInputDown.add(function(sprite, pointer) {
            pointer.currentTarget = sprite;
            game.trigger('focusPlayer');
        }, this);

        miniMapContainer.addMultiple([bg, this.viewRect, this.unitDots, button]);

        setInterval(function() {
            self.unitDots.clear();
            self.viewRect.clear();
            self.gameObjects.forEach(function (object) {
                var unitMiniX = null,
                    unitMiniY = null;

                if(object instanceof Planet) {
                    unitMiniX = game.camera.view.width + (object.previousPosition.x / 6000 * 300) - 600;
                    unitMiniY = object.previousPosition.y / 6000 * 300 - 300;
                } else {
                    unitMiniX = game.camera.view.width + (object.x / 6000 * 300) - 600;
                    unitMiniY = object.y / 6000 * 300 - 300;
                }

                self.unitDots.beginFill(0x2A4B17);
                self.unitDots.drawEllipse(unitMiniX, unitMiniY, 2, 2);
           });

            var unitMiniX = game.camera.view.width + (game.camera.view.x / 6000 * 300) - 600;
            var unitMiniY = game.camera.view.y / 6000 * 300 - 300;
            self.viewRect.lineStyle(1, 0xFFFFFF);
            self.viewRect.drawRect(unitMiniX, unitMiniY, self.viewResolution.width, self.viewResolution.height);
        }, 1000);
    }
};