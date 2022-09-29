var arr = [[], [], [], [], [], [], [], [], []]

for (let i = 0; i < 9; i++) {
	for (let j = 0; j < 9; j++) {
		arr[i][j] = document.getElementById(i * 9 + j);
	}
}


var board = [[], [], [], [], [], [], [], [], []]

function FillBoard(board) {
	for (let i = 0; i < 9; i++) {
		for (let j = 0; j < 9; j++) {
			if (board[i][j] != 0) {
				arr[i][j].value = board[i][j];
			}

			else
				arr[i][j].value = ''
		}
	}
}

let GetPuzzle = document.getElementById('GetPuzzle')
let SolvePuzzle = document.getElementById('SolvePuzzle')

GetPuzzle.onclick = async () => {
	const response = await fetch('https://sugoku.herokuapp.com/board?' + new URLSearchParams({difficulty:'hard'}));

	const data = await response.json();
	board = data.board;
	FillBoard(board);
}


function isSafe(row, col, board, val){
        
	for(let i=0; i<9; i++){
		if(board[row][i] == val){
			return false;
		}
		
		if(board[i][col] == val){
			return false;
		}

		if(board[(3*Math.floor(row/3)) + Math.floor(i/3)][(3*Math.floor(col/3) + (i%3))] == val){
			return false;
		}
	}
	
	return true;
	
}


function solve(board, row, col, n){
	if(row == n){
		return true;
	}

	if(col == n){
		return solve(board, row+1, 0, n);
	}

	if(board[row][col] != 0){
		return solve(board, row, col+1, n);
	}

	for(let val=1; val<=9; val++){

		if(isSafe(row, col, board, val)){
			
			board[row][col] = val;

			FillBoard(board);

			let nextSolution = solve(board, row, col+1, n);

			if(nextSolution){
				return true;
			}
			else{
				board[row][col] = 0;
			}
		}
	}
	return false;
}

SolvePuzzle.onclick = () => {
	solve(board, 0, 0, 9);
};


