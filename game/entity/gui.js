var GUI = function(game) {
    var self = this;

    this.minimap = new Minimap(game);
    
    this.cursors = game.input.keyboard.createCursorKeys();

    this.pathEnd = game.add.sprite(0, 0, 'pathEnd');
    this.pathEnd.anchor.setTo(0.5, 0.5);

    game.input.mouse.capture = true;
    game.input.onUp.add(function (pointer, event) {
        if (game.input.activePointer.leftButton.isDown && pointer.currentTarget == null)
        {
            self.pathEnd.x = game.input.activePointer.worldX;
            self.pathEnd.y = game.input.activePointer.worldY;
            self.pathEnd.visible = true;
        }
    }, this);
};

GUI.prototype.draw = function() {
    this.pathEnd.bringToTop();
    this.minimap.draw();
};

GUI.prototype.update = function() {
    if (this.cursors.up.isDown) {
        game.camera.follow(null);
        game.camera.view.y -= 10;
    } else if (this.cursors.down.isDown) {
        game.camera.follow(null);
        game.camera.view.y += 10;
    }

    if (this.cursors.left.isDown) {
        game.camera.follow(null);
        game.camera.view.x -= 10;
    } else if (this.cursors.right.isDown) {
        game.camera.follow(null);
        game.camera.view.x += 10;
    }
};