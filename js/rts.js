var elementSize = 51;

//Class RTSUnit - main class for units
function RTSUnit ( id, pozX, pozY ) {

    //Properties
    this.id = id;
    this.htmlElement = $('#'+id);
    this.speed = 800;
    this.setSpeed = function(speed) {
        this.speed = speed;
    }
    this.health = 100;
    this.setHealth = function(health) {
        this.health = health;
    }
    this.pushDamage = function(damage) {
        this.setHealth(this.health - damage);
    }
    this.damage = 10;
    this.position = {
        x: pozX,
        y: pozY
    }

    this.isAnimated = false;

    this.toogleAnimated = function() {
        if (this.isAnimated) { this.isAnimated = false;}
        else this.isAnimated = true;
    }

    //Order
    this.order = {
        active: false,
        x: 0,
        y: 0
    };
    
    this.movementParity = false;
    this.nextMovement = function () {
        //Type one: no coordinate is okay
        if ((this.position.x != this.order.x) && (this.position.y != this.order.y)) {
            if (this.movementParity) {
                if (this.position.x > this.order.x) {
                    this.moveLeft();
                }
                else {
                    this.moveRight();
                }
                this.movementParity = false;
            }
            else {
                if (this.position.y > this.order.y) {
                    this.moveUp();
                }
                else {
                    this.moveDown();
                }
                this.movementParity = true;
            }
        }
        //Type two: y is okay
        else if (this.position.x != this.order.x) {
            if (this.position.x > this.order.x) {
                this.moveLeft();
            }
            else {
                this.moveRight();
            }
        }
        //Type three: x is okay
        else if (this.position.y != this.order.y) {
            if (this.position.y > this.order.y) {
                this.moveUp();
            }
            else {
                this.moveDown();
            }
        }
        else {
            this.order.active = false;
        }
    }

    //Movement functions
    this.moveUnit = function( params ) {
        if (!this.isAnimated) {
            this.isAnimated = true;
		var unit = this;
            this.htmlElement.animate(params, this.speed, function(){
		  game.releaseAnimated(unit.id)
		});
        }
    }
    this.moveDown = function() {
        var top = this.htmlElement.position().top + elementSize;
        this.moveUnit({top: top+"px"});
        this.position.y++;
    }
    this.moveUp = function() {
        var top = this.htmlElement.position().top - elementSize;
        this.moveUnit({top: top+"px"});
        this.position.y--;
    }
    this.moveLeft = function() {
        var left = this.htmlElement.position().left - elementSize;
        this.moveUnit({left: left+"px"});
        this.position.x--;
    }
    this.moveRight = function() {
        var left = this.htmlElement.position().left + elementSize;
        this.moveUnit({left: left+"px"});
        this.position.x++;
    }
}

//Class RTSGame - game handling class
function RTSGame() {

    this.selectedUnit = null;
    this.selectedOrder = null;

    this.unitArray = new Array();
    this.pushUnit = function ( unit ) {
        this.unitArray.push(unit);
    }

    this.giveOrder = function ( x, y) {
        this.selectedUnit.order = {
            active:true,
            x:x,
            y:y
        }
    }

    this.run = function() {
        for (var i = 0; i < this.unitArray.length; i++ ) {
            if ((this.unitArray[i].order.active) && (!this.unitArray[i].isAnimated)) {
                this.unitArray[i].nextMovement();
            }
        }
        setTimeout("game.run()",50);
    }

    this.releaseAnimated = function(id) {
        for (var i = 0; i < this.unitArray.length; i++ ) {
            if (this.unitArray[i].id.toString() == id.toString()) {
                this.unitArray[i].isAnimated = false;
            }
        }
    }

    this.showDetails = function( unit ) {
        $('#unit-details-id').text(unit.id);
        $('#unit-details-health').text(unit.health);
        $('#unit-details-speed').text(unit.speed);
        $('#unit-details-animated').text(unit.isAnimated);
    }

    this.setSelected = function( unit ) {
        if (this.selectedUnit != null) this.selectedUnit.htmlElement.removeClass("selected");
        this.selectedUnit = unit;
        unit.htmlElement.addClass("selected");
    }
}
