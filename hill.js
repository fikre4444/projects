function hillCipher(plain, keyMatrix){
    plain = plain.toLowerCase();
    var groupedPhrases = getGroupedPhrases(plain, keyMatrix.length);
    var cipher = "";
    for(var i = 0; i < groupedPhrases.length; i++){
        var tempPlainRow = getAscii(groupedPhrases[i]);
        var multipliedMatrix = multiply(keyMatrix, tempPlainRow);
        var multipliedMod = getModedVersion(multipliedMatrix, 26);
        var resultingGroup = getAlphabets(multipliedMod);
        cipher += resultingGroup;
    } 
    return cipher;
}

function getGroupedPhrases(plain, length){
    var groupedPhrases = [];

    while(plain.length%length != 0){
        plain += "z";
    }

    var groupAmount = plain.length/length;
    for(var i = 0; i < groupAmount; i++){
        var start = length * i;
        var end = length * (i+1);
        var grouped = plain.substring(start, end);
        //the above code adds 3 grouped letters at each iteration
        groupedPhrases.push(grouped);
    }

    return groupedPhrases;
}

function getAscii(groupedPhrase){
    var tempRow = new Array(groupedPhrase.length);
    for(var i = 0; i < tempRow.length; i++){
        tempRow[i] = new Array(1);
    }
    for(var i = 0; i < groupedPhrase.length; i++){
        var characterNumber = groupedPhrase.charCodeAt(i) - 97;
        tempRow[i][0] = characterNumber;
    }
    return tempRow;
}

function getAlphabets(multipliedMatrix){
    var result = "";
    for(var i = 0; i < multipliedMatrix.length; i++){
        for(var j = 0; j < multipliedMatrix[i].length; j++){
            var character = String.fromCharCode(multipliedMatrix[i][j] + 97);
            result += character;
        }
    }

    return result;
}

function multiply(matrixA, matrixB){
    var matrixRow = matrixA.length; //the resulting array's number of rows
    var matrixCol = matrixB[0].length; //the resulting array's number of cols
    var commonDimension = matrixA[0].length;
    var result = new Array(matrixRow);
    for(let i = 0; i < result.length; i++){
        result[i] = new Array(matrixCol);
    }

    for(let i = 0; i < matrixRow; i++){
        for(let j = 0; j < matrixCol; j++){
            result[i][j] = 0;
            for(let k = 0; k < commonDimension; k++){
                result[i][j] += matrixA[i][k] * matrixB[k][j];
            }
        }
    }
    return result;
}

function getModedVersion(aMatrix, amount){
    var rows = aMatrix.length;
    var cols = aMatrix[0].length;
    var moded = new Array(rows);
    for(var i = 0; i < rows; i++){
        moded[i] = new Array(cols);
    }

    for(var i = 0; i < rows; i++){
        for(var j = 0; j < cols; j++){
            moded[i][j] = ((aMatrix[i][j]%amount)+amount)%amount;
        }
    }
    return moded;
}

function checkValidity(cipher, length){
    return cipher.length%length == 0;
}

function getDeterminant(keyMatrix){
    if(keyMatrix.length == 2){
        var deter = keyMatrix[0][0]*keyMatrix[1][1] - keyMatrix[0][1]*keyMatrix[1][0];
        return deter;
    }
    if(keyMatrix.length == 3){
        var deter = keyMatrix[0][0]*(keyMatrix[1][1]*keyMatrix[2][2] - keyMatrix[2][1]*keyMatrix[1][2]);
        deter = deter - keyMatrix[0][1]*(keyMatrix[1][0]*keyMatrix[2][2] - keyMatrix[2][0]*keyMatrix[1][2]);
        deter = deter + keyMatrix[0][2]*(keyMatrix[1][0]*keyMatrix[2][1] - keyMatrix[2][0]*keyMatrix[1][1]);
        return deter;
    }
}

function checkInvertability(keyMatrix){
    if(getDeterminant(keyMatrix) == 0){
        return false;
    }
    return true;
}

function checkCoPrimality(num1, num2){
	var smaller = num1 > num2 ? num1 : num2;
	for(var i = 2; i < smaller; i++){
		var condition1 = num1%i === 0;
		var condition2 = num2%i === 0;
		if(condition1 && condition2){
			return false;
		};
	};
	return true;
}

function findInverse(matrix){
    var adjointed = getAdjoint(matrix);
    var modedAdjointed = getModedVersion(adjointed, 26);
    var determinant = getDeterminant(matrix);
    var modInverseDeter = modInverse(determinant, 26);
    var scalarMultiply = scale(modedAdjointed, modInverseDeter);
    var finalVersionModed = getModedVersion(scalarMultiply, 26);
    return finalVersionModed;
}

function getAdjoint(matrix) {
    // Check if the input is a valid 2x2 or a 3x3 matrix
    if (!Array.isArray(matrix) || (matrix.length !== 2 && matrix.length !== 3) || !matrix.every(row => Array.isArray(row) && row.length === matrix.length)) {
        throw new Error("Invalid input: matrix must be a 2x2 or a 3x3 array");
    }
  
    // If the matrix is 2x2, use the simpler formula
    if (matrix.length === 2) {
        // The adjoint of a 2x2 matrix is obtained by swapping the diagonal elements and changing the signs of the off-diagonal elements
        let adjoint = [];
        adjoint[0] = [];
        adjoint[1] = [];
        adjoint[0][0] = matrix[1][1];
        adjoint[0][1] = -matrix[0][1];
        adjoint[1][0] = -matrix[1][0];
        adjoint[1][1] = matrix[0][0];

        // Return the adjoint matrix
        return adjoint;
    }
    else{
        // Calculate the cofactors of each element
        let cofactors = [];
        for (let i = 0; i < 3; i++) {
        cofactors[i] = [];
        for (let j = 0; j < 3; j++) {
            // The cofactor is the determinant of the minor matrix multiplied by (-1)^(i+j)
            let minor = matrix.filter((row, r) => r !== i).map(row => row.filter((col, c) => c !== j));
            let det = minor[0][0] * minor[1][1] - minor[0][1] * minor[1][0];
            let sign = (i + j) % 2 === 0 ? 1 : -1;
            cofactors[i][j] = sign * det;
        }
        }
    
        // Transpose the cofactors matrix to get the adjoint matrix
        let adjoint = [];
        for (let i = 0; i < 3; i++) {
        adjoint[i] = [];
        for (let j = 0; j < 3; j++) {
            adjoint[i][j] = cofactors[j][i];
        }
        }
    
        // Return the adjoint matrix
        return adjoint;
    }
}
  
function scale(matrix, scaler){
    var result = new Array(matrix.length);
    for(var i = 0; i < result.length; i++){
        result[i] = new Array(matrix[i].length);
    }

    for(var i = 0; i < result.length; i++){
        for(var j = 0; j < result[i].length; j++){
            result[i][j] = scaler * matrix[i][j];
        }
    }
    return result;
}

function modInverse(a, m) {
    // validate inputs
    [a, m] = [Number(a), Number(m)]
    if (Number.isNaN(a) || Number.isNaN(m)) {
      return NaN // invalid input
    }
    a = (a % m + m) % m
    if (!a || m < 2) {
      return NaN // invalid input
    }
    // find the gcd
    const s = []
    let b = m
    while(b) {
      [a, b] = [b, a % b]
      s.push({a, b})
    }
    if (a !== 1) {
      return NaN // inverse does not exists
    }
    // find the inverse
    let x = 1
    let y = 0
    for(let i = s.length - 2; i >= 0; --i) {
      [x, y] = [y,  x - y * Math.floor(s[i].a / s[i].b)]
    }
    return (y % m + m) % m
}

function hillDecrypt(cipher, keyMatrix){
    if(!checkValidity(cipher, keyMatrix.length)){
        alert("The ciphertext wasn't decrypted by the matrix given because of length mismatch");
        return;
    }
    if(!checkInvertability(keyMatrix)){
        alert("The given matrix isn't invertible, hence the cipher text can not be decrypted!");
        return;
    }
    var determinant = getDeterminant(keyMatrix);
    if(!checkCoPrimality(determinant, 26)){
        alert("The given matrix isn't co-prime with 26, hence isn't a valid matrix for decryption.\nTo find a valid matrix, go to the link https://www.cryptool.org/en/cto/hill and generate a matrix key and input it into this.");
        return;
    }
    console.log("Cipher is "+cipher);
    cipher = cipher.toLowerCase();
    var keyMatrixInverse = findInverse(keyMatrix);
    var plain = hillCipher(cipher, keyMatrixInverse);
    return plain;    
}

function viewInstructions(){
    var toDisplay = "To encrypt using the hill cipher, first choose the matrix size (2 or 3) input the plaintext into the input dialog both and numbers into the matrix cells. click encrypt.\n";
    toDisplay += "1. input only lowercase letters with no spaces in the input.\n";
    toDisplay += "2. input only numbers in the matrix cells and don't leave any of the cells empty.\n";
    toDisplay += "3. If you leave any of the cells empty, that cell will be considered as having the value 0.";
    console.log(toDisplay);
    alert(toDisplay);
}

function handleInput(input){
    return /^[a-zA-Z]+$/.test(input);
}

function generateMatrixInput(matrixSizeId, matrixId, matrixTableId){
    
    var matrixSize = Number(document.getElementById(matrixSizeId).value);
    var matrix = document.getElementById(matrixId);
    console.log(matrix);
    var matrixTable = document.getElementById(matrixTableId);
    matrix.removeChild(matrixTable);
    
    matrixTable = document.createElement("table");
    matrixTable.setAttribute("id", matrixTableId);
    for(var i = 0; i < matrixSize; i++){
        var row = document.createElement("tr");
        for(var j = 0; j < matrixSize; j++){
            var cell = document.createElement("td");
            var inp = document.createElement("input");
            inp.setAttribute("type", "number");
            inp.setAttribute("placeholder", "0");
            cell.appendChild(inp);
            row.appendChild(cell);
        }
        matrixTable.appendChild(row);        
    }
    matrix.appendChild(matrixTable);
}

function getMatrixInput(matrixTable, matrixSize){
    var keyMatrix = new Array(matrixSize);
    var rows = matrixTable.rows;
    for(var i = 0; i < matrixSize; i++){
        keyMatrix[i] = new Array(matrixSize);
        var cells = rows[i].cells;
        for(var j = 0; j < matrixSize; j++){
            var cell = cells[j];
            inp = cell.querySelector("input");
            keyMatrix[i][j] = Math.floor(Number(inp.value));
        }
    }
    return keyMatrix;
}

function isMatrixValid(keyMatrix){
    for(var i = 0; i < keyMatrix.length; i++){
        for(var j = 0; j < keyMatrix.length; j++){
            if(isNaN(keyMatrix[i][j]) || (keyMatrix == undefined) || (keyMatrix == null)){
                return false;
            }
        }
    }
    return true;
}

function handleEncrypt(){
    var input = String((document.getElementById("input")).value);
	input = input.replace(/\s/g, "") //removes white space
    var matrixSize = Number((document.getElementById("matrixSize")).value);
    var validInput = handleInput(input);
    var matrixTable = document.getElementById("matrixTable");
    var keyMatrix = getMatrixInput(matrixTable, matrixSize);
    if(validInput){
        var cipher = hillCipher(input, keyMatrix);
        console.log("the ciperh is "+cipher);
        var resultHolder = document.getElementById("resultHolder");
        resultHolder.innerHTML = "The cipher of "+input+" using the key matrix above is "+cipher;
    }
    else{
        alert("Please read the instruction carefully and satisfy every condition specified!");
    }
}

function handleDecrypt(){
    var input = String((document.getElementById("cipherInput")).value);
	input = input.replace(/\s/g, ""); //removes white space
    var matrixSize = Number((document.getElementById("matrixSizeDec")).value);
    var validInput = handleInput(input);
    var matrixTable = document.getElementById("matrixTableDec");
    var keyMatrix = getMatrixInput(matrixTable, matrixSize);
    if(validInput){
        var plain = hillDecrypt(input, keyMatrix);
        if(plain != null){
            var resultHolder = document.getElementById("resultHolderDec");
            resultHolder.innerHTML = "The decrypted version of "+input+" using the key above after it is inverted is "+plain;
        }
    }
    else{
        alert("Please read the instruction carefully and satisfy every condition specified!");
    }
}

function toggleInstructions(){
    var ins = document.getElementById("decInstructions");
    var toggler = 0;
    var toggleStyle = ["display: none", "display: block"];
    console.log("the inside outside is running");
    var togglerFunction = function(){
        ins.setAttribute("style", toggleStyle[toggler]);
        toggler = (toggler + 1)%2;
        console.log("the assignmeing is running");
    }
    togglerFunction();
    return togglerFunction;
}
var togglerFunction;
window.onload = function(){
    console.log("running");
    togglerFunction = toggleInstructions();
}













