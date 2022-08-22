const unitLength  = 20;
let boxColors    = [100, 150];
const strokeColor = 200;
let columns; /* To be determined by window width */
let rows;    /* To be determined by window height */
let currentBoard;
let nextBoard;
let fr;
let slider;
let colorSlider;
let inputForSur;
let DieForOver = 3;
let DieForLonely = 2;
let numForRepro = 3;

let colorSelector = 0;
let x = 90;
let y = 90;
let noPause = true;

function setup(){
    background (0);
    button = createButton('colorSelect');
    button.position(windowWidth - windowWidth*0.25 , windowHeight - 40);
    button.mousePressed(changeColor);
    frameRate(30);
	/* Set the canvas to be under the element #canvas*/
	const canvas = createCanvas(windowWidth, windowHeight - 100);
	canvas.parent(document.querySelector('#canvas'));
    slider = createSlider(1, 60, 100);
    slider.position(0, windowHeight-25);
    slider.style('width', '80px');
    colorSlider = createSlider(50, 200, 100);
    colorSlider.position(0, windowHeight - 50);
    colorSlider.style('width', '160px');

    inputForSur= createInput('Die of Overpopulation');
    inputForSur.position(windowWidth * 0.45, windowHeight - 90);
    inputForSur.size(200);
    inputForSur.input(inputTheString);

    inputForLone= createInput('Die of Lonely');
    inputForLone.position(windowWidth *0.45, windowHeight - 60);
    inputForLone.size(200);
    inputForLone.input(inputTheLonely);

    inputForRepro= createInput('Number of Reproduction');
    inputForRepro.position(windowWidth *0.45, windowHeight - 30);
    inputForRepro.size(200);
    inputForRepro.input(inputTheRepro);



	/*Calculate the number of columns and rows */
	columns = floor(width  / unitLength);
	rows    = floor(height / unitLength);
	
	/*Making both currentBoard and nextBoard 2-dimensional matrix that has (columns * rows) boxes. */
	currentBoard = [];
	nextBoard = [];
	for (let i = 0; i < columns; i++) {
		currentBoard[i] = [];
		nextBoard[i] = []
    }
	// Now both currentBoard and nextBoard are array of array of undefined values.
	init();  // Set the initial values of the currentBoard and nextBoard
}

function changeColor(){
    if (colorSelector == 0){
        boxColors[0] = colorSlider.value();
        colorSelector = 1;
        console.log("colorSelector: "+ colorSelector);
        colorSlider.value(boxColors[1]) ;
    }else {
        boxColors[1] = colorSlider.value();
        colorSelector = 0;
        console.log("colorSelector: "+ colorSelector);
        colorSlider.value(boxColors[0]) ;
    }
}

function  init() {
	for (let i = 0; i < columns; i++) {
		for (let j = 0; j < rows; j++) {
			currentBoard[i][j] = 0;
			nextBoard[i][j] = 0;
		}
	}
}

function draw() {
    frame = slider.value();
    frameRate(frame);
     boxColors[colorSelector] = colorSlider.value();
     
    background(255);
    if (noPause){
    generate();
    }
    for (let i = 0; i < columns; i++) {
        for (let j = 0; j < rows; j++) {
            if (currentBoard[i][j] > 490){
                fill((boxColors[currentBoard[i][j]%10]) - 49, 100, 100);  
            } else if (currentBoard[i][j] > 0){
                fill((boxColors[currentBoard[i][j]%10]) - currentBoard[i][j]/10, 100, 100);
            } else {
                fill(255);
            }
            stroke(strokeColor);
            rect(i * unitLength, j * unitLength, unitLength, unitLength);
        }
    }

    fill('rgba(0,255,0, 0.25)');
    stroke(255, 204, 0);
    ellipse(x, y, 20, 20);
    line(x + 25, y, x - 25, y); // at the mouse position
    line(x, y + 25, x, y -25);

    if (mouseX > unitLength * columns || mouseY > unitLength * rows) {
    if (keyIsDown(32)){
            x = 90;
            y = 90;
        }
    if (keyIsDown(65)){
        if (x < unitLength * columns && y < unitLength * rows) {
            notPause = false ;
            draggedWithoutMouse(x,y);
        }
    }
    if (keyIsDown(LEFT_ARROW)) {
        x -= 20;
       
      }
    
      if (keyIsDown(RIGHT_ARROW)) {
        x += 20;
       
      }
    
      if (keyIsDown(UP_ARROW)) {
        y -= 20;
       
      }
    
      if (keyIsDown(DOWN_ARROW)) {
        y += 20;
        
      }    
    }else{
    
        x = unitLength * columns +5;
        y = unitLength * columns +5;
    }
    
  
}

function generate() {
    //Loop over every single box on the board
    
    for (let x = 0; x < columns; x++) {
        for (let y = 0; y < rows; y++) {
            // Count all living members in the Moore neighborhood(8 boxes surrounding)
            let neighborColorKey= colorSelector;
            let neighbors = 0;
            for (let i of [-1, 0, 1]) {
                for (let j of [-1, 0, 1]) {
                    if( i == 0 && j == 0 ){
	                    // the cell itself is not its own neighbor
	                    continue;
	                }
                    // The modulo operator is crucial for wrapping on the edge
                    if ((currentBoard[(x + i + columns) % columns][(y + j + rows) % rows]) > 0){
                        neighbors++;
                        neighborColorKey = (currentBoard[(x + i + columns) % columns][(y + j + rows) % rows])%10;
                    }
                }
            }
            
            // Rules of Life
            if (currentBoard[x][y] > 1 && neighbors < DieForLonely) {
                // Die of Loneliness
                nextBoard[x][y] = 0;
            } else if (currentBoard[x][y] > 1 && neighbors > DieForOver) {
                // Die of Overpopulation
                nextBoard[x][y] = 0;
            } else if (currentBoard[x][y] == 0 && neighbors == numForRepro) {
                // New life due to Reproduction
                nextBoard[x][y] = 10 + neighborColorKey;
                
            } else {
                // Stasis
                if (currentBoard[x][y] > 0){
                    nextBoard[x][y] = currentBoard[x][y] +10;
                }else {
                nextBoard[x][y] = currentBoard[x][y];
                }
            }
        }
    }

    // Swap the nextBoard to be the current Board
    [currentBoard, nextBoard] = [nextBoard, currentBoard];
    
}

function mouseDragged() {
    /**
     * If the mouse coordinate is outside the board
     */
    if (mouseX > unitLength * columns || mouseY > unitLength * rows) {
        return;
    }
    const x = Math.floor(mouseX / unitLength);
    const y = Math.floor(mouseY / unitLength);
    currentBoard[x][y] = 10 + colorSelector;
    fill(boxColors[colorSelector], 100, 100);
    stroke(strokeColor);
    rect(x * unitLength, y * unitLength, unitLength, unitLength);
}

function draggedWithoutMouse(x,y){
    noPause = false;
    
    if (x > unitLength * columns || y > unitLength * rows) {
        return;
    }
    x = Math.floor(x/ unitLength);
    y = Math.floor(y/ unitLength);
    currentBoard[x][y] = 10 + colorSelector;
    fill(boxColors[colorSelector], 100, 100);
    stroke(strokeColor);
    rect(x * unitLength, y * unitLength, unitLength, unitLength);
        
    }
    




/**
 * When mouse is pressed
 */
function mousePressed() {
    noLoop();
    mouseDragged();
}

/**
 * When mouse is released
 */
function mouseReleased() {
    loop();
}

document.querySelector('#reset-game')
	.addEventListener('click', function() {
        loop();
		init();
        resizeCanvas(windowWidth, windowHeight - 100);
        noPause = false;
});

document.querySelector('#Stop')
.addEventListener('click', function() {
    noPause = false;
});

document.querySelector('#Start')
.addEventListener('click', function() {
    noPause = true;
});

document.querySelector('#fpsone')
.addEventListener('click', function() {
    frameRate(1);
});


//document.querySelector('#framerate')
//.addEventListener('click', function() {
    //fr = document.getElementById("framerate").value;
    //console.log(fr);
    //frameRate(fr);
//});

function randomInitial(){
    for (let i = 0; i < columns; i++) {
		for (let j = 0; j < rows; j++) {
			currentBoard[i][j] = floor(random(2));
			nextBoard[i][j] = 0;
		}
	}
}

document.querySelector('#randomInitial')
.addEventListener('click', function() {
    loop();
	init();
    noPause = false;
    randomInitial();
});

//function windowResized() {
   // resizeCanvas(windowWidth, windowHeight - 100);
   // slider.position(0, windowHeight - 50);
   // colorSlider.position(0, windowHeight - 25);
//}



function inputTheString() {
    if (parseInt(inputForSur.value()) >= 0){
        DieForOver = parseInt(inputForSur.value());
        console.log("change the over to " + DieForOver);
    }else {
        DieForOver = 3;
    }
}

function inputTheLonely() {
    if (parseInt(inputForLone.value()) >= 0){
        DieForLonely = parseInt(inputForLone.value());
        console.log("Lonely the over to " + DieForLonely);
    }else {
        DieForLonely = 2;
    }
}

function inputTheRepro() {
    if (parseInt(inputForRepro.value()) >= 0){
        numForRepro = parseInt(inputForRepro.value());
        console.log("Repro the over to " + numForRepro);
    }else {
        numForRepro = 3;
    }
}

function keyTyped() {
    if (key === 'g') {
        noPause = false;
    } else if (key === 'h') {
        noPause = true;
    }
    // uncomment to prevent any default behavior
    // return false;
  }