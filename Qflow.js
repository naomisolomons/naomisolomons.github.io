////////////////////////////////////////////////////////////////////////////////
//Document Setup
var canvas = document.querySelector('canvas'); 																	//selects the canvas tag from the HTML file
var inter = false 																															// this variable toggles the user interaction loop.
var included = [] 																															// All these empty data structures are used in the user input process
var counter_included = []
var cycle_edges = {}
var counter_cycle_edges = {}
var selectedarr = [];
var current_x = 0
var current_y = 0

var advActive = false
var advcyc = {}
var counter_advcyc = {}
var advinter = false

//Loading of the background image
var img = new Image();
img.src = "Background_v3.jpg";


var c = canvas.getContext('2d');
canvas.width = window.innerWidth; //sets the height and width of the canvas
canvas.height = window.innerHeight;


var Graph_STR = document.getElementsByClassName("div1")[0].getAttribute("data-graph"); // extract and process the graph data which is stored in a div by the initial python script.
var fixed = Graph_STR.replace(/[']/g,"\"");
var JSON_OBj = JSON.parse(fixed);
////////////////////////////////////////////////////////////////////////////////
function toggle(item){																														//Toggles the truth value of a variable
	item === true ? item = false : item = true
	return item
}

window.addEventListener('keydown',function(event){															//If the advanced options keys are pressed activate the advanced button
	var key = event.keyCode || e.which;
	if(key == "65" && event.shiftKey == true){
		advActive = toggle(advActive)
		}
	}
)
////////////////////////////////////////////////////////////////////////////////
//Click Events
var mouse = { 																																	//dictionary style variable called mouse that has an x and y component
		x: 0,
		y: 0,
		shift: false
	}

window.addEventListener('click', 																								//event listener waits for clicks and then stores the
		function(event){																														//x,y position of the cursor in the variable mouse.

		mouse.x = event.x
		mouse.y = event.y
		mouse.shift = event.shiftKey
		}
)

function clearm (){ 																														//when called this function clears the variable mouse.
	mouse.x = 0
	mouse.y = 0
	mouse.shift = false
}
////////////////////////////////////////////////////////////////////////////////
//Drag interaction
var x_new = 0; 																																	// control variables for dragging
var y_new = 0;
var isDragging = false;
var isDraggedId = null;

window.addEventListener('mousedown', 																						//listens for a mouse down event. when detected activated the handeling of dragging events.
		function(event){
			x_new = event.x;
		  y_new = event.y;
			isDragging = true;
		}
);

window.addEventListener('mousemove',
		function(event){
			if(isDragging === true && isDraggedId !== null){ 													// the code is exicuted the the mouse is held down on a node
				x_new = event.x;
				y_new = event.y;
				nodeArray[isDraggedId].updatePos(x_new, y_new) 													//this updates the position of the node to the current cursor position
				for (var i = 0; i < edgeArray.length; i++){															// sums over all the edges and decides weather to update them or not.
					if (edgeArray[i].from === isDraggedId){ 															// if the edge begins at the dragged node update its stating position
						edgeArray[i].updateEdgeStart(x_new,y_new)
					}if (edgeArray[i].to === isDraggedId){ 																// if the edge ends and the dragged node update the end position.
						edgeArray[i].updateEdgeEnd(x_new,y_new) 														// double if statement is used as this catchs the case of self loops
					}
				}
			}else{
				current_x = event.x
				current_y = event.y
			}
		}
);

window.addEventListener('mouseup',																							//When a mouse up event occurs the relevant variables are reset.
		function(event){
			x_new = 0;
			y_new = 0;
			isDragging = false;
			isDraggedId = null;
		}
);


////////////////////////////////////////////////////////////////////////////////
function getRndInteger(min, max) {																							//Random integer generator used in the scramble function
  return Math.floor(Math.random() * (max - min + 1) ) + min;
}

function Scramble(){																														// This function performs random mixing operations on the graph.
for (var i =0; i<500; i++){																											//This function could be with some reworking as I feel like it in inefficent and buggy
	var scram_arr = []																														// It is not currently being implimented as we are manually scrambling the levels
	var k = getRndInteger(2,JSON_OBj["nodes"].length)
	for (var j = 0; j < (k); j++){
		var m = getRndInteger(0,(JSON_OBj["nodes"].length)-1)
		if (scram_arr.includes(m) == false){
			scram_arr.push(JSON_OBj["nodes"][m]["id"])
		}
  }
	check = Cyclecheck(scram_arr)
	if (check == true){
		var n = (Math.random()).toFixed(2)
		console.log(cycle_edges);
		console.log(n);
		for (var key in cycle_edges){
			id = cycle_edges[key];
			edgeArray[id].changeweight(n)
		}
		for (var key in counter_cycle_edges){
			id = counter_cycle_edges[key];
		  edgeArray[id].changeweight(-n)
			}
		}
	}
		included = []
		counter_included = []
		cycle_edges = {}
		counter_cycle_edges = {}
		scram_arr = []
	}

//////////////////////////////////////////////////////////////////////////////// This function checks that a selected cycle is valid.
function Cyclecheck(arr) {																											// This means that it checks that every node in the proposed cycle has an edge between them.
	for (var i = 0; i < arr.length; i++){																					// It also checks that the reverse cycle exists in the graph
		included.push(false)
		counter_included.push(false)
	}
	for (var i =0; i< arr.length; i++){
		if (i == (arr.length-1)){
			var edgecan = [arr[i],arr[0]];
			if (arr.length == 2){																											//special case for 2 node cycyles
				var counter_edgecan = [arr[i],arr[i]];
			}else {
				var counter_edgecan = [arr[0],arr[i]];
			}
		}else {
			var edgecan = [arr[i],arr[i+1]];
			if (arr.length == 2){
				var counter_edgecan = [arr[i],arr[i]];
			}else {
				var counter_edgecan = [arr[i+1],arr[i]];
			}
		}
		for (var j = 0; j < JSON_OBj["edges"].length; j++){													// sum over the edges and checks that the proposed edges are in the edge set
			var edge = [JSON_OBj["edges"][j]["from"], JSON_OBj["edges"][j]["to"]]
			if (edge[0] == edgecan[0] && edge[1] == edgecan[1]){
				included[i] = true;
				cycle_edges[edgecan] = j
			}
		}
		for (var j = 0; j < JSON_OBj["edges"].length; j++){
			var edge = [JSON_OBj["edges"][j]["from"], JSON_OBj["edges"][j]["to"]]
			if (edge[0] == counter_edgecan[0] && edge[1] == counter_edgecan[1]){
				counter_included[i] = true;
				counter_cycle_edges[counter_edgecan] = j
			}
		}
	}
	let checker = arr => arr.every(Boolean); 																			//returns true if every element in an array is true.

	if (checker(included) == true && checker(counter_included) == true){					// if cycle and counter cycle are in the graph then return true.
		return true
	}else {
		return false
		}
	}
///////////////////////////////////////////////////////////////////////////////
function advchecher(){																													//this function handles the advanced probability shifts
	if (selectedarr.length !== 2){
		alert("Advanced Check only Accepts 2-Cycles")																// Only works for two cycles
	}else{
		n = parseInt(prompt("Please enter first index:"));													//parse user input for first integer
  if (n == null || n == "") {
    reset();
  } else {
    m =  parseInt(prompt("Please enter second index:"));												//parse user input for second integer
  if (m == null || m == "") {
    reset();
  } else {
		edge_ij = [selectedarr[0],selectedarr[1]]																		//define the edges in the two cycle
		edge_ipnjpm = [(selectedarr[0]+n)%(JSON_OBj["nodes"].length),(selectedarr[1]+m)%(JSON_OBj["nodes"].length)]

		edge_ipnj = [(selectedarr[0]+n)%(JSON_OBj["nodes"].length),selectedarr[1]]
		edge_ijpm = [selectedarr[0], (selectedarr[1]+m)%(JSON_OBj["nodes"].length)]

		truth = [false,false,false,false]
		truth = [edge_checker(edge_ij),edge_checker(edge_ipnjpm),edge_checker(edge_ipnj),edge_checker(edge_ijpm)] //check that the edges exist

		advcyc[edge_ij] = edge_index(edge_ij)																				//determine edge index
		advcyc[edge_ipnjpm] = edge_index(edge_ipnjpm)
		counter_advcyc[edge_ipnj] = edge_index(edge_ipnj)
		counter_advcyc[edge_ijpm] = edge_index(edge_ijpm)

		let checker = arr => arr.every(Boolean);																		//if all the edges are in the graph continue
		if (checker(truth) === true){
			for (var i = 0; i < selectedarr.length; i++){
				nodeArray[selectedarr[i]].changecol("green");														//turn active nodes and edges green
			}
			for (var key in advcyc){
				id = advcyc[key];
				edgeArray[id].changecol("green")
			}
			for (var key in counter_advcyc){
				id = counter_advcyc[key];
				edgeArray[id].changecol("green")
			}
			advinter = true																														//activate interactivity
		}else if (checker(truth) == false){
			alert("Invalid Cycle")
			for (var i = 0; i < selectedarr.length; i++){
				nodeArray[selectedarr[i]].changecol("black");
					}
					advcyc = {}
					counter_advcyc = {}
					advinter = false
					selectedarr = [];
				}
			}
  	}
	}
}
window.addEventListener('wheel', function(event) {															//deals with mouse wheel events
		if (advinter === true){																											//if interactivity is enabled change the weights of the edges dependent on the direction of the scroll
			for (var key in advcyc){
				id = advcyc[key];
				if (event.deltaY < 0){
					edgeArray[id].changeweight(0.01)
				}else if (event.deltaY > 0){
					edgeArray[id].changeweight(-0.01)
				}
			}
			for (var key in counter_advcyc){
				id = counter_advcyc[key];
				if (event.deltaY < 0){
					edgeArray[id].changeweight(-0.01)
				}else if (event.deltaY > 0){
					edgeArray[id].changeweight(0.01)
				}
			}
		}
	}
)


function edge_checker(edgecan){																									// checks if an edge is in the graph
	for (var j = 0; j < JSON_OBj["edges"].length; j++){
		var edge = [JSON_OBj["edges"][j]["from"], JSON_OBj["edges"][j]["to"]]
		if (edge[0] == edgecan[0] && edge[1] == edgecan[1]){
			return true
			}
		}
	}
	function edge_index(edgecan){																									//determines an edge index
		for (var j = 0; j < JSON_OBj["edges"].length; j++){
			var edge = [JSON_OBj["edges"][j]["from"], JSON_OBj["edges"][j]["to"]]
			if (edge[0] == edgecan[0] && edge[1] == edgecan[1]){
				return j
			}
		}
	}

///////////////////////////////////////////////////////////////////////////////
																																								//If the selected cycle is valid turn then this function
function interaction (){																												//turns the nodes green and activate interactive mode.
	check = Cyclecheck(selectedarr)
	if (check == true){
		for (var i = 0; i < selectedarr.length; i++){
			nodeArray[selectedarr[i]].changecol("green");
			inter = true}
		for (var key in cycle_edges){
			id = cycle_edges[key];
			edgeArray[id].changecol("green")
		}
		for (var key in counter_cycle_edges){
			id = counter_cycle_edges[key];
			edgeArray[id].changecol("green")
		}
	}else if (check == false){
		alert("Invalid Cycle")
		endinteraction()
	}
}
///////////////////////////////////////////////////////////////////////////////
window.addEventListener('wheel', function(event) {															//deals with mouse wheel events

	if (inter == true){																														//if interactivity is enabled change the weights of the edges dependent on the direction of the scroll
		for (var key in cycle_edges){
			id = cycle_edges[key];
			if (event.deltaY < 0){
				edgeArray[id].changeweight(0.01)
			}else if (event.deltaY > 0){
				edgeArray[id].changeweight(-0.01)
			}

		}
		for (var key in counter_cycle_edges){
			id = counter_cycle_edges[key];
			if (event.deltaY < 0){
				edgeArray[id].changeweight(-0.01)
			}else if (event.deltaY > 0){
				edgeArray[id].changeweight(0.01)
			}
		}
	}
	}
)
///////////////////////////////////////////////////////////////////////////////
function endinteraction() {																											//when called this function checks the win condition and ends the interactivity.

	for (var i = 0; i < selectedarr.length; i++){
		nodeArray[selectedarr[i]].changecol("black");
	}
	for (var key in cycle_edges){
		id = cycle_edges[key];
		edgeArray[id].changecol("black")
	}
	for (var key in counter_cycle_edges){
		id = counter_cycle_edges[key];
		edgeArray[id].changecol("black")
	}

	for (var key in advcyc){
		id = advcyc[key];
		edgeArray[id].changecol("black")
	}
	for (var key in counter_advcyc){
		id = counter_advcyc[key];
		edgeArray[id].changecol("black")
	}
	var winarry = [];
	for (var i = 0; i < edgeArray.length; i++){																		//check that all weights are positive.
		w = edgeArray[i].weight
		if (w >= 0){
			winarry.push(true);
		}else if (w < 0){
			winarry.push(false)
		}
	}
		let checker = arr => arr.every(Boolean);
		if (checker(winarry) == true){
			BackgroundMusic.stop()
			MusicPlaying = false
			VictoryMusic.play()
			setTimeout(function(){
				alert("Congrats on Completing the Level. Refresh the page to play again or return to the home page for another Level.")
			}, 200);


		}
	inter = false;																																//reset all appropriate variables
	selectedarr = [];
	included = []
	counter_included = []
	cycle_edges = {}
	counter_cycle_edges = {}
	advcyc = {}
	counter_advcyc = {}
	advinter = false
}
///////////////////////////////////////////////////////////////////////////////
function reset(){																																//This function resents everything is you want to start from scratch.
	for (var i = 0; i < edgeArray.length; i++){
		edgeArray[i].resetweight()
	}
	for (var i = 0; i < selectedarr.length; i++){
		nodeArray[selectedarr[i]].changecol("black");
	}
	for (var key in cycle_edges){
		id = cycle_edges[key];
		edgeArray[id].changecol("black")
	}
	for (var key in counter_cycle_edges){
		id = counter_cycle_edges[key];
		edgeArray[id].changecol("black")
	}

	for (var key in advcyc){
		id = advcyc[key];
		edgeArray[id].changecol("black")
	}
	for (var key in counter_advcyc){
		id = counter_advcyc[key];
		edgeArray[id].changecol("black")
	}
	inter = false;
	selectedarr = [];
	included = []
	counter_included = []
	cycle_edges = {}
	counter_cycle_edges = {}
	advcyc = {}
	counter_advcyc = {}
	advinter = false
}
///////////////////////////////////////////////////////////////////////////////
function sound(src, loopValue,volume) {
  this.sound = document.createElement("audio");
  this.sound.src = src;
	this.sound.volume = volume
  this.sound.setAttribute("preload", "auto");
  this.sound.setAttribute("controls", "none");
	if(loopValue === true){
		this.sound.setAttribute("loop","true")
	}
  this.sound.style.display = "none";
  document.body.appendChild(this.sound);
  this.play = function(){
    this.sound.play();
  }
  this.stop = function(){
    this.sound.pause();
  }
}
///////////////////////////////////////////////////////////////////////////////
function button(x,y,w,h,buttontext,func) {																			//Generic object that can be used as a button
	this.x = x;
	this.y = y;
	this.width = w;
	this.height = h;
  this.text = buttontext;
	this.fillcolour = "white"

	this.draw = function(){																												//This function determines how the button is drawn.
		c.beginPath();
		c.strokeStyle = "black";
		c.lineWidth = 2;
		c.fillStyle = this.fillcolour;
		c.fillRect(this.x,this.y,this.width,this.height);
		c.rect(this.x,this.y,this.width,this.height);
		c.fillStyle = "black";
		c.textAlign = "start";
		c.textBaseline = "alphabetic";
		c.fillText(this.text, 1.01*this.x, (this.y+ 0.75*(this.height)));
		c.stroke();
	}
	this.update = function(){																											//If the mouse clicks within the boundarys of the button its associatied function is called
		if (mouse.x < (this.x + this.width) && mouse.x > this.x && mouse.y < (this.y + this.height) && mouse.y > this.y){
			func();
			clearm();
		}
		if (current_x < (this.x + this.width) && current_x > this.x && current_y < (this.y + this.height) && current_y > this.y){
			this.fillcolour = "grey"
		}else{
			this.fillcolour = "white"
		}
		this.draw();
	}
}
///////////////////////////////////////////////////////////////////////////////
function arrayRemove(arr, value) {																							//useful function that removes a given element from a given array
	return arr.filter(function(ele){ return ele != value; });
}

function Node(x,y,id) {																													//Node object class.
	this.id = id;																																	//Node has a bunch of defining parameters
	this.x = x;
	this.y = y;
	this.radius = 20; //radius of the nodes
	this.colour = 'black'
	var bin = this.id

	this.draw = function() {																											//This function determines how the nodes are drawn
		c.beginPath();
	  c.arc(this.x,this.y,this.radius,0,Math.PI * 2, false);
	  c.strokeStyle = this.colour;
		c.lineWidth = 10;
	  c.stroke();
	  c.fillStyle = "white";
	  c.fill();
		c.font = "30px Arial";
		c.fillStyle = "black";
		c.textAlign = "center";
		c.textBaseline = "middle";
		c.fillText(bin,this.x,this.y);
	}

	this.update = function(){																											//This function handels the updating of the nodes.
	var dist = Math.sqrt((this.x - mouse.x)**2+(this.y - mouse.y)**2)

	if (dist < this.radius && this.colour == 'black' && mouse.shift === true){ 		//If the mouse clicks on a node while the shift key is held the node is selected.
		this.colour = 'red'																													//Change the colour to red
		SelectMusic.play()
		clearm()
		selectedarr.push(this.id)																										//add the node the the selected array
	} else if (dist < this.radius && this.colour == 'red' && mouse.shift === true){ // If the mouse clicks on the node + shift key then deselect the node
		this.colour = 'black'
		DeselectMusic.play()
		clearm()
		selectedarr = arrayRemove(selectedarr,this.id)															//Remove the id from the selected array
	}

	var dist2 = Math.sqrt((this.x - x_new)**2+(this.y - y_new)**2)

	if (dist2 < this.radius){																											//If the mouse is being held done on the node set the isDraggedId to the node ID
		isDraggedId = this.id
	}
		this.draw()
	}
	this.changecol = function(colour){																						// method that updates node colour
		this.colour = colour
	}
	this.updatePos = function(new_x,new_y){ 																			// method that updates node position
		this.x = new_x;
		this.y = new_y;
	}
}
///////////////////////////////////////////////////////////////////////////////
function _getQBezierValue(t, p1, p2, p3) {
    var iT = 1 - t;
    return iT * iT * p1 + 2 * iT * t * p2 + t * t * p3;
}

function getQuadraticCurvePoint(startX, startY, cpX, cpY, endX, endY, position) {
    return {
        x:  _getQBezierValue(position, startX, cpX, endX),
        y:  _getQBezierValue(position, startY, cpY, endY)
    };
}
function getQuadraticAngle(t, sx, sy, cp1x, cp1y, ex, ey) {
  var dx = 2*(1-t)*(cp1x-sx) + 2*t*(ex-cp1x);
  var dy = 2*(1-t)*(cp1y-sy) + 2*t*(ey-cp1y);
  return -Math.atan2(dx, dy) + 0.5*Math.PI;
}
///////////////////////////////////////////////////////////////////////////////
function Edge(x_1, y_1, x_2, y_2,weight,from,to){																// Edge object Class
	this.from = from;																															//Defines a bunch of edge properties
	this.to= to;

	this.x_1 = x_1;
	this.y_1 = y_1;
	this.x_2 = x_2;
	this.y_2 = y_2;

	this.weight = weight
	this.init_weigth = weight

	this.edge_colour = 'black'

	this.draw = function(){																												//This Function Determines how to draw the edges
		this.x_m = (this.x_1 + this.x_2) /2																					//Thes scaled coordinates and control points are used to draw the quadratic curves
		this.y_m = (this.y_1 + this.y_2) /2
		this.scl = 0.1 																															//controls the curviness of the edges
		this.c_x = this.x_m + this.scl*(this.y_2-this.y_1)
		this.c_y = this.y_m - this.scl*(this.x_2-this.x_1)

		this.half = getQuadraticCurvePoint(this.x_1,this.y_1,this.c_x,this.c_y,this.x_2,this.y_2,0.5)
		this.arrowpos = getQuadraticCurvePoint(this.x_1,this.y_1,this.c_x,this.c_y,this.x_2,this.y_2,0.5)
		this.angle = getQuadraticAngle(0.5,this.x_1,this.y_1,this.c_x,this.c_y,this.x_2,this.y_2)


		this.k = 80 																																//controls the positioning of the self loops text
		this.r = 35 																																//radius of the self loops
		c.font = "25px Arial";
		c.fillStyle = "black";
		c.textAlign = "center";
		c.textBaseline = "middle";

		if (this.x_1 == this.x_2 && this.y_1 == this.y_2){													//Handels the self loops
			this.m = (this.y_1 - (canvas.height/2))/(this.x_1 - (canvas.width/2))
			this.d = 30

			c.beginPath();
			if ((this.x_1 - (canvas.width/2)) > 0 ){																	//This section makes sure the self loops are always aligned correctly

				this.x_s = this.x_1 + (this.d)/(Math.sqrt(1+(this.m)**2))
				this.y_s = this.y_1 + (this.d*this.m)/(Math.sqrt(1+(this.m)**2))
				c.arc(this.x_s,this.y_s,this.r,0,Math.PI * 2, false);
		   	c.strokeStyle = this.edge_colour;
				c.lineWidth = 2;
		   	c.stroke();

				this.x_text = this.x_1 + (this.k)/(Math.sqrt(1+(this.m)**2))
				this.y_text = this.y_1 + (this.k*this.m)/(Math.sqrt(1+(this.m)**2))
				if (this.weight != 0){
					if (this.weight < 0){
						c.fillStyle = "red";
					}else{
						c.fillStyle = "black";
					}
					c.textAlign = "left";
					c.fillText(this.weight,this.x_text,this.y_text);
					c.moveTo(this.x_text,this.y_text)
					c.lineTo(this.x_1 + (65)/(Math.sqrt(1+(this.m)**2)), this.y_1 + (65*this.m)/(Math.sqrt(1+(this.m)**2)))
					c.stroke();
				}

			}else if ((this.x_1 - (canvas.width/2)) < 0 ){

				this.x_s = this.x_1 - (this.d)/(Math.sqrt(1+(this.m)**2))
				this.y_s = this.y_1 - (this.d*this.m)/(Math.sqrt(1+(this.m)**2))
				c.strokeStyle = this.edge_colour;
				c.arc(this.x_s,this.y_s,this.r,0,Math.PI * 2, false);
				c.lineWidth = 2;
		   	c.stroke();
				this.x_text = this.x_1 - (this.k)/(Math.sqrt(1+(this.m)**2))
				this.y_text = this.y_1 - (this.k*this.m)/(Math.sqrt(1+(this.m)**2))
				if (this.weight != 0){
					if (this.weight < 0){
						c.fillStyle = "red";
					}else{
						c.fillStyle = "black";
					}
					c.textAlign = "right";
					c.fillText(this.weight,this.x_text,this.y_text);
					c.moveTo(this.x_text,this.y_text)
					c.lineTo(this.x_1 - (65)/(Math.sqrt(1+(this.m)**2)), this.y_1 - (65*this.m)/(Math.sqrt(1+(this.m)**2)))
					c.stroke();
				}
			}
		}else{																																			//If not a self loop do this
			c.beginPath();
	   	c.moveTo(this.x_1,this.y_1);
	   	c.quadraticCurveTo(this.c_x,this.c_y,this.x_2,this.y_2)
	   	c.strokeStyle = this.edge_colour;
			c.lineWidth = 2;
	   	c.stroke();

	   	c.beginPath();
	   	c.strokeStyle = this.edge_colour;
	   	c.stroke();
	   	c.font = "25px Arial";
			if (this.weight < 0){
				c.fillStyle = "red";
			}else{
				c.fillStyle = "black";
			}

			c.textBaseline = "middle";
																											//Changes how the text is aligned depending on its position on the page
			if (this.weight != 0){
				if (this.c_x > this.x_2 && this.c_y < this.y_2 || this.c_x < this.x_2 && this.c_y < this.y_2){
					c.textAlign = "left";
				} else if (this.c_x < this.x_2 && this.c_y > this.y_2 || this.c_x > this.x_2 && this.c_y > this.y_2){
					c.textAlign = "right";
				}

		   	c.fillText(this.weight, this.c_x,this.c_y);
				c.strokeStyle = "black"
				c.moveTo(this.c_x,this.c_y)
				c.lineTo(this.half.x, this.half.y)
				c.stroke();
			}
			c.save();
			c.beginPath();
			c.translate(this.arrowpos.x, this.arrowpos.y);
			c.rotate(this.angle);
			c.moveTo(-10, -10);
			c.lineTo(10, 0);
			c.lineTo(-10, 10);
			c.lineTo(-10, -10);
			c.fillStyle = "black";
			c.fill();
			c.restore();

		}
	}

	this.update = function(){
		this.draw()
	}
	this.changeweight = function(we){																							//This method changes the value of the weight
		this.weight = (parseFloat(this.weight) + parseFloat(we)).toFixed(2)
	}
	this.resetweight = function(){																								//Returns the weight to the initial state
		this.weight = this.init_weigth
	}

	this.updateEdgeStart = function(new_x_1,new_y_1){															//This method updates the start point of the edge
		this.x_1 = new_x_1;
		this.y_1 = new_y_1;
	}
	this.updateEdgeEnd = function(new_x_2,new_y_2){																//This method updates the end point of the edge
		this.x_2 = new_x_2;
		this.y_2 = new_y_2;
	}
	this.changecol = function(colour){																						// method that updates edge colour
		this.edge_colour = colour
	}
}
///////////////////////////////////////////////////////////////////////////////
function MessageBox (){
	this.messages = LevelMessages()
	this.MessageIndex = 0

	this.draw = function(){
		c.font = "25px Arial";
		c.fillStyle = "black";
		c.textBaseline = "middle";
		c.fillText(this.messages[this.MessageIndex], 100,100);
	}
	this.update = function(){
		this.draw()
	}
  this.Next = function(){
		if (this.MessageIndex === this.messages.length-1){
			this.MessageIndex = this.messages.length-1
		}else {
			this.MessageIndex = this.MessageIndex + 1
		}
	}

	this.Back = function(){
		if (this.MessageIndex === 0){
			this.MessageIndex === 0
		}else {
			this.MessageIndex = this.MessageIndex - 1
		}
	}
}


var tutorial = istutorial()
if (tutorial === true){
	messgbox = new MessageBox()
	function next(){
		messgbox.Next()
	}
	function back(){
		messgbox.Back()
	}
	var NextButton = new button(7*(canvas.width)/8,150,90, 40,"NEXT",next)
	var BackButton = new button((canvas.width)/8,150,80, 40,"BACK",back)
}
///////////////////////////////////////////////////////////////////////////////
var nodeArray = [];																															//Initiallised an array of node objects
for (var i = 0; i < JSON_OBj["nodes"].length; i++){
	var id = JSON_OBj["nodes"][i]["id"]
	var x = (JSON_OBj["nodes"][i]["x_pos"] + (canvas.width)/2)
	var y = (JSON_OBj["nodes"][i]["y_pos"] + (canvas.height)/2)
	nodeArray.push(new Node(x,y,id))
}
///////////////////////////////////////////////////////////////////////////////
var edgeArray = [];																															//Initiallised an array of edge objects
for (var i = 0; i <JSON_OBj["edges"].length; i++){
	var index_1 = JSON_OBj["edges"][i]["from"]
	var index_2 = JSON_OBj["edges"][i]["to"]
	var weight  = (JSON_OBj["edges"][i]["weight"]).toFixed(2)
	var x_1 = ((JSON_OBj["nodes"][index_1]["x_pos"]) + (canvas.width)/2)
	var y_1 = ((JSON_OBj["nodes"][index_1]["y_pos"]) +  (canvas.height)/2)
	var x_2 = ((JSON_OBj["nodes"][index_2]["x_pos"]) +  (canvas.width)/2)
	var y_2 = ((JSON_OBj["nodes"][index_2]["y_pos"]) +  (canvas.height)/2)


	edgeArray.push(new Edge(x_1,y_1,x_2,y_2,weight,index_1,index_2))
}
///////////////////////////////////////////////////////////////////////////////
BackgroundMusic = new sound("Background_Music_V2.wav",true,0.2)
																																				///Initialises game sounds
var MusicPlaying = false
function PlayMusic(){
	if(MusicPlaying === false){
		BackgroundMusic.play()
		MusicPlaying = true
	} else if(MusicPlaying === true){
		BackgroundMusic.stop()
		MusicPlaying = false
	}
}
SelectMusic = new sound("Select.wav",false,1)
DeselectMusic = new sound("Deselect.wav",false,1)
VictoryMusic = new sound("Win_v1.wav",false,1)
/////////////////////////////////////////////////////////////////////////////// Initialises instances of buttons
var selectbutton = new button((canvas.width)/8, 0.75*(canvas.height), 125, 40, "CHECK", interaction)
var endbutton = new button((canvas.width)/8, (0.75*(canvas.height)+45), 125, 40, "SUBMIT", endinteraction)
var resetbutton = new button((canvas.width)/8, (0.75*(canvas.height)+90), 125, 40, "RESET", reset)
var scramblebutton = new button(6*(canvas.width)/8, (0.75*(canvas.height)+45), 180, 40, "SQUAMBLE", mix)
var musicbutton = new button(6*(canvas.width)/8, (0.75*(canvas.height)), 125, 40, "MUSIC", PlayMusic)
var advbutton = new button (6*(canvas.width)/8, (0.75*(canvas.height)+90), 150, 40, "Advanced", advchecher)
///////////////////////////////////////////////////////////////////////////////
function refresh() {																														//This refresh function controls the animation loop.
	requestAnimationFrame(refresh);
	c.clearRect(0,0,innerWidth, innerHeight);																			//Clear the page each frame
	c.drawImage(img, 0, 0,canvas.width,canvas.height);
	for (var i = 0; i < edgeArray.length; i++){
		edgeArray[i].update()																												//redraw the edges each frame
	}

	for (var i = 0; i < nodeArray.length; i++){
		nodeArray[i].update()																												//redraw the nodes each frame
	}
	selectbutton.update()																													//redraw the buttons each frame
	endbutton.update()
	resetbutton.update()
	scramblebutton.update()
	musicbutton.update()
	if (advActive === true){
		advbutton.update()
	}
	if (tutorial === true){
		messgbox.update()
		NextButton.update()
		BackButton.update()
	}

}

refresh();
