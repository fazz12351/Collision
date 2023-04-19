// i have made an attempt to add robot which will eat and cells in its wat. when a cell is withing distance, the robot will eat(splice the cell) and increase its mass and create a flash affect when any robot has eaten. Furthermore, the more it eats, the more full(mass) it gets causing it to get more red.

//Global variables for the constructor functions aswell as sliders.
var cells = [];
let slider;
let slider1;
let slider2;
var mouseP = false;
var robots = [];

function setup() {

    //we create a canvas which is 800 px in width and 600px in height
    createCanvas(1001, 700);

    //create a slider with minimum is 0, max is 300, starts with 0 ;
    slider = createSlider(0, 300, 0);
    slider.style('width', '80px');
    slider.position(15, 190);

    //create another slider with minimum of6, max is 255 starts with 0 ;
    slider1 = createSlider(6, 255, 0);
    slider1.style('width', '80px');
    slider1.position(15, 235);



    //this forloop will add new Cell into the cell array 15 times creating 10 new cells with random mass between 1-3, if we want to have a static mass,we van leave the argument of the function empty.  
    for (var i = 0; i < 20; i++) {
        cells.push(new Cell(random(1, 3)))
    }


    //this for loop will create 4 new robots and add them into the robots Array using the push method.
    for (var j = 0; j < 4; j++) {
        robots.push(new Robot())

    }

}

function draw() {
    //this slider will adjust background colour for affect
    let val = slider1.value();
    background(val);

    //text for the sliders on top left
    stroke(255)
    text("Move slider to increment its its size", 10, 10);
    text("Move slider to adjust background colour", 10, 50);
    noStroke();






    //for loop which acess the cells in the array;
    for (var i = 0; i < cells.length; i++) {

        //if the mouse is pressed, it created a new local vairable called wind and we give it a vector of vector.x=0 and vector.y=0.01;the wind variable is the used to calculate the difference between its mousX and y location. 
        if (mouseIsPressed) {

            var wind = createVector(0, 0.1);
            wind.x * wind.x + wind.y * wind.y <= 0.1
            wind.sub(mouseX, mouseY)
            wind.setMag(0.1)
            cells[i].applyForce(wind);

        }


        //cerate friction for our cells. this is not part of the conditional statement as this will be a continous stage of our maze.
        //we created a local variable called friction and we copy the speed so it doesnt affect all the other cells[i].speed.
        var friction = cells[i].speed.copy();
        friction.mult(-1);
        friction.normalize();
        friction.mult(0.03);

        //this will run the cell functions as it calls the run functions containing the sub elements.
        cells[i].applyForce(friction);
        cells[i].run();


    }
    //created a new for loop so we can run the constructor function for robots.
    for (j = 0; j < robots.length; j++) {
        robots[j].run()

    }
}

//-----------------------NEW CELLS---------------------//
function Cell(_m) {

    //created a variable which takes a boolean parameter as we would use this when a cell[]interacts with current Cell(this),
    var intersect = false;
    var initialLocation = undefined;


    //below are the main properties for the cells including its speed,mass exc......//
    this.speed = createVector(random(-1, 1), random(-1, 1));
    this.loc = initialLocation || createVector(random(width), height / 2);
    this.acceleration = createVector(0, 0);
    this.mass = _m || 3;
    this.diam = this.mass * 10;
    this.r = this.diam / 2;
    this.maxMass = 15
    this.agingRate = random(0.003, 0.015);
    this.lifespan = 350;
    this.intersect = false;



    //this.run function will be used in the draw loop to call the other sub functions instead of calling them out one by one. Its simply a container for all the other functions.

    //--!!!!!!!!!----To run other functions, simply uncomment them and it should run smoothly------!!!!!//

    this.run = function () {
        this.draw();
        this.move();
        this.checkBorders();
        this.checkCollisions();
        this.aging();
        this.boardersHit();
        this.fineTuning();
        //        this.mitosis();


    }


    //this.draw function will be used to contain all the physical drawing elemnts.
    this.draw = function () {
        
        //this conditional statement checks if this.intersect is true. if so it will turn red
        if (this.intersect == true) {

            fill(255, 0, 0)

        }
        //if this.intersect==false, then it will remain grey
        else {
            if (this.intersect == false) {
                fill(150)
            }
        }



        //the diam will slowly increase by this.mass
        this.diam = this.mass * 10;
        ellipse(this.loc.x, this.loc.y, this.diam + slider.value(), this.diam + slider.value());

    }

    //this function cerats all the movement of the cells.

    this.move = function () {
        this.speed.add(this.acceleration);
        this.loc.add(this.speed);
        this.acceleration.mult(0);
    }

    //this function creates boundaries for the cells so they rebound and change speed based on where they interact(x or y axis); i have also added an outcome which will reduce the Maxmass by -1 if this cell hits the boarders. if so, the maxMass will decrase by 1 reducing the time period on the canvas.

    this.checkBorders = function () {

        //this.boarders hit is an object which will turn true if the conditional statements are met. if the conditions are not met, it will remain false.
        this.boarderHit = false;
        if (this.loc.x > width - this.diam / 2) {
            this.loc.x = width - this.diam / 2;
            this.speed.x *= -1;
            this.maxMass -= 1;
            //            this.lifespan -= 200
            //conditions are met so this.boarderhit becomes true
            this.boarderHit = true;
        } else if (this.loc.x < this.diam / 2) {
            this.speed.x *= -1;
            this.loc.x = this.diam / 2;
            this.maxMass -= 1;
            //            this.lifespan -= 200;
            //conditions are met so this.boarderhit becomes true
            this.boarderHit = true;
        }
        if (this.loc.y > height - this.diam / 2) {
            this.speed.y *= -1;
            this.loc.y = height - this.diam / 2
            this.maxMass -= 1;
            //            this.lifespan -= 200;
            //conditions are met so this.boarderhit becomes true
            this.boarderHit = true;
        } else if (this.loc.y < this.diam / 2) {
            this.speed.y *= -1;
            this.loc.y = this.diam / 2
            this.maxMass -= 1;
            //            this.lifespan -= 200;
            //conditions are met so this.boarderhit becomes true
            this.boarderHit = true;

        }

    }

    //created this new updated function part of additional work as i wanted the draw function to be updated based on its lifespan
    this.boardersHit = function () {

        //this funciton will add new cells whenver a cell hits the boarder. this is done by the checkboarder function where we made a boolean to check if this.boarderHit==true. if so it will add new Cell into the cells array.
        if (this.boarderHit == true) {
            cells.push(new Cell())






        }
    }

    //function for applying force for this.cell

    this.applyForce = function (f) {
        var adjustedForce = f.copy();
        adjustedForce.div(this.mass);
        this.acceleration.add(adjustedForce);
    }

    //this function will check if the current cells in intersecting with other cells in the cells[] array.
    this.checkCollisions = function () {

        //we initialise the intersect variable to false which will then be true if the conditional statement is met below:



        //we create a for loop which will run through all the cell object including there location.
        for (var i = 0; i < cells.length; i++) {

            this.intersect = false
            //we create a local variable which will work out the distance between the current cells location and the other cells[i].loc(location);
            var d = dist(this.loc.x, this.loc.y, cells[i].loc.x, cells[i].loc.y);

            //this conditional statemetn is to check if the distance between 2 cells is less than the current cell radius(this.diam/2);.if so, we create a variavle called v and we use the p5.Vector.sub vector function to work out the distance.
            if (d < this.diam / 2 + 20) {
                v = p5.Vector.sub(cells[i].loc, this.loc);
                //we need to normalise it to 1 so its look smooth
                v.normalize();
                //we apply force (v) and set the magnitude to 0.8 and we change this.intersect
                cells[i].applyForce(v);
                v.setMag(0.8);
                cells[i].intersect = true;

                this.lifespan -= 0.01



            }



        }


    }

    //this functions checks the age of the cells. if it goes greater of equal to 6, then we will remove the cell from the array by using .splice which is an array function. this is so we dont slow our system as large sum of data stored in an array can cause the system to run slow.

    this.aging = function () {
        //we increment the mass by this.aging rate
        this.mass += this.agingRate;


        //we acess the cells array and we check if each cells.mass is greater than this.maxMass object. if so,we remove the cells from the array using the splice function specificlly used for arrays.
        for (var i = 0; i < cells.length; i++) {
            if (cells[i].mass >= this.maxMass) {

                //we use i as this checks if the mass is in boundaries in the cells. if so, we remove it.
                cells.splice(i, 4);


                //                cells.push(this.mitosis());
                //                cells.push(this.mitosis());

            }
        }
    }


    this.mitosis = function () {

        var cell = new Cell();
        return cell;


    }

    this.fineTuning = function () {

        //this is the fine tuning stage
        if (initialLocation !== undefined) {
            this.loc.x = initialLocation.x;
            this.loc.y = initialLocation.y;
        }

    }

}

//<<<<<<<<<<<<<<<<<<<<ADDITIONAL CREATIVE WORK BELOW >>>>>>>>>>>>>>>>>>>>>>>>>//////////



//for Creative work, i decided to a robot which will eat cells around its location

//this is the robot constructor function. similar layout for cinsistency and ease of use.
function Robot() {

    //these are the robots main objects.
    this.loc = createVector(random(0, width), random(0, height))
    this.diam = 30;
    this.mass = 10;
    this.acceleration = createVector(0, 0);
    this.speed = createVector(random(-1, 1), random(-1, 1));
    this.lifespan = 400;


    //similarly to cells.this will run all the other sub functions.
    this.run = function () {
        this.draw();
        this.move();
        this.checkBorders();
        this.interact();
        this.eating();

    }

    //this fuction will draw the robots.
    this.draw = function () {
        fill(100, 255 - this.lifespan, 100)
        stroke(0)
        ellipse(this.loc.x, this.loc.y - 10, this.diam)
        ellipse(this.loc.x - 5, this.loc.y - 12, this.diam / 4);
        ellipse(this.loc.x + 5, this.loc.y - 12, this.diam / 4)
        ellipse(this.loc.x + 10 / 2, this.loc.y - 12, this.diam / 4 / 2)
        ellipse(this.loc.x - 10 / 2, this.loc.y - 12, this.diam / 4 / 2)

    }
    //this function will be used to move the robots 

    this.move = function () {
        this.speed.add(this.acceleration);
        this.loc.add(this.speed);
        this.acceleration.mult(0);
    }

    this.applyForce = function (f) {
        var adjustedForce = f.copy();
        adjustedForce.div(this.mass);
        this.acceleration.add(adjustedForce);
    }


    //this will check if the robots are in the boarder similarly to cells
    this.checkBorders = function () {

        if (this.loc.x > width - this.diam / 2) {
            this.loc.x = width - this.diam / 2;
            this.speed.x *= -1;

        } else if (this.loc.x < this.diam / 2) {
            this.speed.x *= -1;
            this.loc.x = this.diam / 2;
            this.maxMass -= 1;


        }
        if (this.loc.y > height - this.diam / 2) {
            this.speed.y *= -1;
            this.loc.y = height - this.diam / 2
            this.maxMass -= 1;

            this.boardersHit_y = true;
        } else if (this.loc.y < this.diam / 2) {
            this.speed.y *= -1;
            this.loc.y = this.diam / 2
            this.maxMass -= 1;

            this.boardersHit_y = true;

        }

    }


    this.interact = function () {
        this.robotHit = false;

        //this function will remove any enemies which is inbound of the robots .
        //for loop will run through the cells array
        for (var i = 0; i < cells.length; i++) {
            //local vatiable which will contain the distance
            d = dist(cells[i].loc.x, cells[i].loc.y, this.loc.x, this.loc.y)
            //conditional statement which will remove cells from the array if they are close. Also robotHit becomes true;
            if (d < cells[i].diam / 2 + this.diam / 2) {
                cells.splice(i, 5);
                this.robotHit = true;
            }
        }
        // this conditional statement checks if th ecells is hit by a robot. if so, we create a flash affect quickly to represent a death of a cell
        if (this.robotHit == true) {
            background(255, 100, 20)
        }
    }
    //this function is used to creaet an belly fattining affect. the more cells the robot eats, the bigger it becomes.
    this.eating = function () {
        if (this.robotHit == true) {
            this.diam += 5
        }
    }
    //this function will check if the current cells in intersecting with other cells in the cells[] array.





}





//----------------P5 Functions-------------------//////////////

function keyPressed() {

    //when the up arrow is pressed, we will add 1 cell to the array
    for (var j = 0; j < 1; j++) {
        if (keyCode == UP_ARROW) {
            cells.push(new Cell())
            //            console.log("adding")
        }
    }

    //when we press the down arrow, a single cell would be renoved

    for (var i = 0; i < cells.length; i++) {
        if (keyCode == DOWN_ARROW) {

            //we use i as this checks if the mass is in boundaries in the cells. if so, we remove it.
            cells.splice(i, 1);
            //            console.log("splicing")


        }
    }
    //when space bar is pressed, the class object .massMax will increment by 10 allowing longer life on the screen
    for (var a = 0; a < cells.length; a++) {
        if (keyCode == 65) {
            cells[a].maxMass += 10;
            stroke(255)
            fill(255)
            //            console.log(cells[a].maxMass)
        }
    }

    //this will reduce max mass value
    for (var d = 0; d < cells.length; d++) {
        if (keyCode == 68) {
            cells[d].maxMass -= 10;
            stroke(255)
            fill(255)
            //            console.log("going down")
        }
    }
}