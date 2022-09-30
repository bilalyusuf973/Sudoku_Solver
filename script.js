// Styling Part

let gridWidth = document.getElementById("grid_sudoku").clientWidth;
let x = document.querySelectorAll("input");

for(let i=0; i<x.length; i++) {    
	x[i].style.width = (gridWidth < 549 ) ? `${gridWidth/10 + 2 }px` : '60px';
	x[i].style.height = (gridWidth < 549 ) ? `${gridWidth/10 + 2 }px` : '60px';
	x[i].style.textIndent = (gridWidth < 549 ) ? `5px` : '15px';
	x[i].setAttribute("oninput", "this.value=this.value.replace(/[^1-9]/g,'')");
	x[i].setAttribute("maxlength", "1");
}


// Logical Part

let arr = [[], [], [], [], [], [], [], [], []]
let schema = [[0,0,0,0,0,0,0,0,0],
    		 [0,0,0,0,0,0,0,0,0],
  			 [0,0,0,0,0,0,0,0,0],
   			 [0,0,0,0,0,0,0,0,0],
    		 [0,0,0,0,0,0,0,0,0],
	 		 [0,0,0,0,0,0,0,0,0],
	  		 [0,0,0,0,0,0,0,0,0],
	  		 [0,0,0,0,0,0,0,0,0],
	   		 [0,0,0,0,0,0,0,0,0]];
	
let board = schema;

	

function handleChange(id, val){
	let col = id % 9;
	let row = (id - col) / 9 ;
	arr[row][col].value = val;
	board[row][col] = val;
}

for (let i = 0; i < 9; i++) {
	for (let j = 0; j < 9; j++) {
		arr[i][j] = document.getElementById(i * 9 + j);
	}
}

function FillArr(board) {
	for (let i = 0; i < 9; i++) {
		for (let j = 0; j < 9; j++) {

			if (board[i][j] != 0) arr[i][j].value = board[i][j];
			else arr[i][j].value = ''
		}
	}
}

let GetPuzzle = document.getElementById('GetPuzzle')
let GetResult = document.getElementById('SolvePuzzle')
let ClearPuzzle = document.getElementById('ClearPuzzle')

GetPuzzle.onclick = async () => {
	const response = await fetch('https://sugoku.herokuapp.com/board?' + new URLSearchParams({difficulty:'hard'}));

	const data = await response.json();
	board = data.board;
	FillArr(board);
}

ClearPuzzle.onclick = () => {
	for (let i = 0; i < 9; i++) {
		for (let j = 0; j < 9; j++) {
			arr[i][j].value = '';
		}
	}
	board = schema;
}


function isSafe(row, col, board, val){ 
	for(let i=0; i<9; i++){

		if( board[row][i] == val || board[i][col] == val ) return false;
		
		if(board[(3*Math.floor(row/3)) + Math.floor(i/3)][(3*Math.floor(col/3) + (i%3))] == val){
			return false;
		}
	}
	return true;	
}




function solve(board, row, col, n){
	if(row == n) return true;

	if(col == n) return solve(board, row+1, 0, n);

	if(board[row][col] != 0) return solve(board, row, col+1, n);
	
	for(let val=1; val<=9; val++){

		if(isSafe(row, col, board, val)){
			
			board[row][col] = val;
			let nextSolution = solve(board, row, col+1, n);

			if(nextSolution) return true;
			else board[row][col] = 0;
		}
	}
	return false;
}

GetResult.onclick = () => {

	let flag = true;

	for(let i=0; i<9; i++){
		let j = 0;
		while(j < 9){
			if(board[i][j] == 0){
				flag = false;
				break;
		    }
			j++;
		}
		if(j < 9) break;
	}

	if(flag){
		let i = 0;
		while(i < 9){
			let j = 0;
			while(j < 9){
				let val = board[i][j];
				board[i][j] = 0;

				if(isSafe(i, j, board, val)) board[i][j] = val;
				else break;
		
				j++;
			}
			if(j < 9) break;
			i++;
		}

		if(i < 9) alert("Wrong Solution");
		else alert("Hurrah: Correct Solution");
	}
	else{
		let solution = solve(board, 0, 0, 9);
		if(!solution) alert('Sorry, Solution for this puzzle does not exist');
		else FillArr(board);
	}
};


