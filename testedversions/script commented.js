
//Related to caesar cipher - Encryption and Decryption
//accepts the string to be encrypted and the shift number
function caesarCipher(plain, shift){
    plain = plain.toLowerCase(); //convert into lowercase 
    var cipher = ""; //the variable that will hold the resulting cipher
    for(var i = 0; i < plain.length; i++){ //for every character
        var charAscii = plain.charCodeAt(i); //get the ascii code of the character at the specified index
        charAscii = charAscii - 97; //this subtracts 97 to make 'a' = 0, 'b' = 1, 'c' = 2 etc.
        var shifted = (charAscii + shift)%26 + 97; //this adds the shifting number and adds modulo 26(to wrap around if overflow) and adds 97 to get back to the original ascii representation
        cipher += String.fromCharCode(shifted); //adds the shifted character
    }

    return cipher;
}

//the following function works the same way as the above one with only one difference instead of adding the shift number we subtract it to get back to the original version.
function decryptCaesar(cipher, shift){
    cipher = cipher.toLowerCase(); 
    var decrypted = "";
    for(var i = 0; i < cipher.length; i++){
        var charAscii = cipher.charCodeAt(i);
        charAscii = charAscii - 97;
        /*below is where we subract the shift number and then we modulo 26 to wrap around but we have to add 26 because the result might be negative we then also have to modulo 26.*/
        var shifted = ((charAscii - shift)%26 + 26)%26 + 97;
        decrypted += String.fromCharCode(shifted);
    }

    return decrypted;
}


//Related to the playFair cipher - Encryption and decryption
function playfairCipher(plain, keyword){
    plain = plain.toLowerCase();
    keyword = keyword.toLowerCase();

    var keyMatrix = getKeyMatrix(keyword); //gets the keymatrix based on the keyword
    var pairs = getPairs(plain); //gets the paired letters in the plain text
    var cipher = "";
    for(var i = 0; i < pairs.length; i++){ //for every pair
        var letter1 = pairs[i].charAt(0); //get the first letter of the pair
        var letter2 = pairs[i].charAt(1); //get the second letter of the pair
        var letter1Loc = getLocation(keyMatrix, letter1); //get locattion of the first letter
        var letter2Loc = getLocation(keyMatrix, letter2); //get location of the second letter
        var resultingPair = getResultingPair(keyMatrix, letter1Loc, letter2Loc); //based on the two letter's locations determine the resulting pair
        cipher += resultingPair; //add the pair
    }
    
    return cipher;
}

function decryptPlayfair(cipher, keyword){
    //this is the same as above with only one difference when determining the resulting pair.
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
    //creates and returns the key matrix based on the keyword
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
        if(currentChar == "j"){ //we need to convert all j's into i's because we don't have j in the square
            currentChar = "i";
        }

        var index = alphabets.indexOf(currentChar); //gets the index of a letter in the keyword

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


