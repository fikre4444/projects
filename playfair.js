//Related to the playFair cipher - Encryption and decryption
function playfairCipher(plain, keyword){
    plain = plain.toLowerCase();
    keyword = keyword.toLowerCase();

    var keyMatrix = getKeyMatrix(keyword);
    var pairs = getPairs(plain);
    var cipher = "";
    for(var i = 0; i < pairs.length; i++){
        var letter1 = pairs[i].charAt(0);
        var letter2 = pairs[i].charAt(1);
        var letter1Loc = getLocation(keyMatrix, letter1);
        var letter2Loc = getLocation(keyMatrix, letter2);
        var resultingPair = getResultingPair(keyMatrix, letter1Loc, letter2Loc);
        cipher += resultingPair;
    }
    
    return cipher;
}

function decryptPlayfair(cipher, keyword){
    cipher = cipher.toLowerCase();
    keyword = keyword.toLowerCase();

    var keyMatrix = getKeyMatrix(keyword);
    var pairs = getPairs(cipher);
    var plain = "";
    for(var i = 0; i < pairs.length; i++){
        var letter1 = pairs[i].charAt(0);
        var letter2 = pairs[i].charAt(1);
        var letter1Loc = getLocation(keyMatrix, letter1);
        var letter2Loc = getLocation(keyMatrix, letter2);
        var resultingPair = getResultingPairDecrypt(keyMatrix, letter1Loc, letter2Loc);
        plain += resultingPair;
    }

    return plain;
}

function getKeyMatrix(keyword){
    var alphabets = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
    
    //to create the empty square
    var keyMatrix = new Array(5);
    for(var i = 0; i < keyMatrix.length; i++){
        keyMatrix[i] = new Array(5);
    }

    //to add the keyword into the square
    var position = 0;
    for(var i = 0; i < keyword.length; i++){
        var currentChar = keyword.charAt(i);
        if(currentChar == "j"){
            currentChar = "i";
        }

        var index = alphabets.indexOf(currentChar);

        //console.log("Index is "+index);
        if(index >= 0){
            var row = Math.floor(position/5);
            var col = position%5;
            keyMatrix[row][col] = currentChar;
            position++;
            //remove the character from the alphabets
            alphabets.splice(index, 1);
            //console.log(alphabets);
        }

    }

    //to add the rest of the alphabets
    var alphabetsLength = alphabets.length;
    for(var i = 0; i < alphabetsLength; i++){
        // console.log(alphabets);
        //check this error if you have time (it prints nothing but when you refresh it works maybe?)
        var row = Math.floor(position/5);
        var col = position%5;
        keyMatrix[row][col] = alphabets[0]; //add the first char
        position++;
        alphabets.splice(0, 1); //remove the first char
    }
    return keyMatrix;
}

function insertAfter(word, position, thing){
    //used for inserting some character or word after some position
    result = word.slice(0, position+1) +thing+word.slice(position+1);
    return result;
}

function getPairs(keyword){
    var result = [];
    keyword = keyword.replaceAll("j", "i");
    var pointer = 0;
    while(pointer < keyword.length){
        if(pointer + 1 == keyword.length){
            //if we are at the last position of the array that means we are odd and we need to add an element x to pair with the last element
            keyword = insertAfter(keyword, pointer, "x");
        }
        else if(keyword.charAt(pointer) == keyword.charAt(pointer+1)){
            //if the consecutive two are equal
            keyword = insertAfter(keyword, pointer, "x");
        }
        result.push(keyword.substring(pointer, pointer+2));
        pointer = pointer + 2;
    }

    return result;
}

function getLocation(matrix, letter){
    var row, col;
    var result = new Array(2);
    for(var i = 0; i < matrix.length; i++){
        var location = matrix[i].indexOf(letter);
        if(location >= 0){
            row = i;
            col = location;
            result[0] = row;
            result[1] = col;
            break;
        }
    }
    return result;
}

function getResultingPair(keyMatrix, letter1Loc, letter2Loc){
    var row1 = letter1Loc[0];
    var col1 = letter1Loc[1];
    var row2 = letter2Loc[0];
    var col2 = letter2Loc[1];
    var rowDifference = Math.abs(row1 - row2);
    var colDifference = Math.abs(col1 - col2);
    if(rowDifference == 0){ 
        //if we are within the same column shift to the right
        col1 = (col1 + 1)%5;
        col2 = (col2 + 1)%5;
    }else if(colDifference == 0){
        //if we are within the same column shift to bottom
        row1 = (row1 + 1)%5;
        row2 = (row2 + 1)%5;
    }else { //if they are diagonal
        var tempCol = col1;
        col1 = col2;
        col2 = tempCol;
    }
    var result = keyMatrix[row1][col1] + keyMatrix[row2][col2];
    return result;
}

function getResultingPairDecrypt(keyMatrix, letter1Loc, letter2Loc){
    var row1 = letter1Loc[0];
    var col1 = letter1Loc[1];
    var row2 = letter2Loc[0];
    var col2 = letter2Loc[1];
    var rowDifference = Math.abs(row1 - row2);
    var colDifference = Math.abs(col1 - col2);
    if(rowDifference == 0){
        col1 = ((col1 - 1)%5 + 5)%5;
        col2 = ((col2 - 1)%5 + 5)%5;
    }else if(colDifference == 0){
        row1 = ((row1 - 1)%5 + 5)%5;
        row2 = ((row2 - 1)%5 + 5)%5;
    }else {
        var tempCol = col1;
        col1 = col2;
        col2 = tempCol;
    }
    var result = keyMatrix[row1][col1] + keyMatrix[row2][col2];
    return result;
}

function viewInstructions(){
    alert("Please make sure the input follows the rules.\n1. The input and keyword must only be alphabets and lowercase. \n2. The input and keyword must not contain spaces.");
}

function handleInput(input){
    return /^[a-z]+$/.test(input);
}

function setTable(keyword){
    var keyMatrix = getKeyMatrix(keyword);
    var table = document.getElementById("keyMatrix");
    var rows = table.rows;
    for(var i = 0; i < rows.length; i++){
        cells = rows[i].cells;
        for(var j = 0; j < cells.length; j++){
            cell = cells[j];
            cell.innerHTML = keyMatrix[i][j];
        }
    }
}

function handleEncrypt(){
    var input = String(document.getElementById("input").value);
    var keyword = String(document.getElementById("keyword").value);
    if(handleInput(input) && handleInput(keyword)){
        var result = document.getElementById("resultEnc");
        var encrypted = playfairCipher(input, keyword);
        result.innerHTML = "The Encrypted version of "+input+" using the keyword "+keyword+" is "+encrypted;
        setTable(keyword);
    }else{
        alert("Please make sure to read the instructions carefully and input accordingly!");
    }
}

function handleDecrypt(){
    var inputDec = String(document.getElementById("inputDec").value);
    var keywordDec = String(document.getElementById("keywordDec").value);
    if(handleInput(inputDec) && handleInput(keywordDec)){
        var result = document.getElementById("resultDec");
        var decrypted = decryptPlayfair(inputDec, keywordDec); 
        result.innerHTML = "The decrypted version of "+inputDec+" using the keyword "+keywordDec+" is "+decrypted; 
        setTable(keywordDec);
    }else{
        alert("Please make sure to read the instructions carefully and input accordingly!");
    }
}

