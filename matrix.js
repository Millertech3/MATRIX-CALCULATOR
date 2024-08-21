// const numeric = require("numeric");
function generateMatrices() {
	const size = parseInt(document.getElementById("matrixSize").value);
	const matrixA = Array(size)
		.fill()
		.map(() => Array(size).fill(0));
	const matrixB = Array(size)
		.fill()
		.map(() => Array(size).fill(0));
	displayMatrix(matrixA, "matrixA");
	displayMatrix(matrixB, "matrixB");
	handleOperation();
	compute()
}
generateMatrices();

function displayMatrix(matrix, elementId) {
	const container = document.getElementById(elementId);
	container.innerHTML = "";
	matrix.forEach((row, i) => {
		const rowDiv = document.createElement("div");
		rowDiv.classList.add("matrix-row");
		row.forEach((cell, j) => {
			const input = document.createElement("input");
			input.value = cell;
			input.id = `${elementId}-${i}-${j}`;
			rowDiv.appendChild(input);
		});
		container.appendChild(rowDiv);
	});

}

function getMatrixFromDOM(elementId) {
	const container = document.getElementById(elementId);
	const rows = container.getElementsByClassName("matrix-row");
	const matrix = [];
	for (let row of rows) {
		const cells = row.getElementsByTagName("input");
		const matrixRow = [];
		for (let cell of cells) {
			matrixRow.push(parseFloat(cell.value));
		}
		matrix.push(matrixRow);
	}
	return matrix;
}

function handleOperation() {
	const operation = document.getElementById("operation").value;
	const matrixB = document.getElementById("matrixB");
	const h2MatB = document.querySelector(".h2matB");
	if (
		operation === "addition" ||
		operation === "subtraction" ||
		operation === "multiplication" ||
		operation === "division"
	) {
		matrixB.style.display = "block";
		h2MatB.style.display = "block";
	} else {
		matrixB.style.display = "none";
		h2MatB.style.display = "none";
	}

}
function compute() {
	const operation = document.getElementById("operation").value;

	const A = getMatrixFromDOM("matrixA");
	let result;
	if (operation === "addition") {
		const B = getMatrixFromDOM("matrixB");
		result = A.map((row, i) => row.map((cell, j) => cell + B[i][j]));
	} else if (operation === "subtraction") {
		const B = getMatrixFromDOM("matrixB");
		result = A.map((row, i) => row.map((cell, j) => cell - B[i][j]));
	} else if (operation === "multiplication") {
		const B = getMatrixFromDOM("matrixB");
		result = A.map((row, i) =>
			row.map((_, j) => row.reduce((sum, _, k) => sum + A[i][k] * B[k][j], 0))
		);
	} else if (operation === "division") {
		const B = getMatrixFromDOM("matrixB");
		const B_inv = inverseMatrix(B);
		if (!B_inv) {
			alert(
				"Matrix B is not invertible, PLEASE ENTER VALUE GREATER THAN 0 IN ALL."
			);
			return;
		}
		result = A.map((row, i) =>
			row.map((_, j) =>
				row.reduce((sum, _, k) => sum + A[i][k] * B_inv[k][j], 0)
			)
		);
	} else if (operation === "transpose") {
		result = A[0].map((_, colIndex) => A.map((row) => row[colIndex]));
	} else if (operation === "determinant") {
		const det = calculateDeterminant(A);
		result = [[det]];
	} else if (operation === "inverse") {
		result = inverseMatrix(A);
		if (!result) {
			alert(
				"Matrix A is not invertible, PLEASE ENTER VALUE GREATER THAN 0 IN ALL!!!!"
			);
			return;
		}
	} else if (operation === "eigen") {
		const eigen = numeric.eig(A);

		displayResult([["Eigenvalues: ", ...eigen.lambda.x]]);
		displayResult([["Eigenvectors: "], ...eigen.E]);
		return;
	}
	displayResult(result);
}
function calculateDeterminant(matrix) {
	const size = matrix.length;
	if (size === 2) {
		return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
	} else if (size === 3) {
		return (
			matrix[0][0] *
				(matrix[1][1] * matrix[2][2] - matrix[1][2] * matrix[2][1]) -
			matrix[0][1] *
				(matrix[1][0] * matrix[2][2] - matrix[1][2] * matrix[2][0]) +
			matrix[0][2] * (matrix[1][0] * matrix[2][1] - matrix[1][1] * matrix[2][0])
		);
	}
	return 0;
	// Not handling larger matrices for simplicity
}
function inverseMatrix(matrix) {
	const size = matrix.length;
	if (size === 2) {
		const det = calculateDeterminant(matrix);
		if (det === 0) return null;
		return [
			[matrix[1][1] / det, -matrix[0][1] / det],
			[-matrix[1][0] / det, matrix[0][0] / det],
		];
	} else if (size === 3) {
		const det = calculateDeterminant(matrix);
		if (det === 0) return null;
		const adj = [
			[
				matrix[1][1] * matrix[2][2] - matrix[1][2] * matrix[2][1],
				-(matrix[0][1] * matrix[2][2] - matrix[0][2] * matrix[2][1]),
				matrix[0][1] * matrix[1][2] - matrix[0][2] * matrix[1][1],
			],
			[
				-(matrix[1][0] * matrix[2][2] - matrix[1][2] * matrix[2][0]),
				matrix[0][0] * matrix[2][2] - matrix[0][2] * matrix[2][0],
				-(matrix[0][0] * matrix[1][2] - matrix[0][2] * matrix[1][0]),
			],
			[
				matrix[1][0] * matrix[2][1] - matrix[1][1] * matrix[2][0],
				-(matrix[0][0] * matrix[2][1] - matrix[0][1] * matrix[2][0]),
				matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0],
			],
		];
		return adj.map((row) => row.map((cell) => cell / det));
	
	}
	return null;
	// Not handling larger matrices for simplicity i.e. 4X4
}
function displayResult(result) {
	const resultDiv = document.getElementById("result");
	
	resultDiv.innerHTML = "<h2>Result:</h2>";
	result.forEach((row) => {
		const rowDiv = document.createElement("div");
		rowDiv.classList.add("matrix-row");

		row.forEach((cell) => {
			const input = document.createElement("input");
			input.value = cell;
			rowDiv.appendChild(input);
		});
		resultDiv.appendChild(rowDiv);
	});

}
