//added som ecommoent for dsjflsdjfk

function viewInstructions(){
    alert("Please make sure the input follows the rules.\n1. The input must only be alphabets. \n2. The input must not contain spaces. \n3. The shift number must be between 0 and 26.\n4. The alphabets must me in lowercase");
}

function handleInput(input){
    return /^[a-zA-Z]+$/.test(input);
}

function handleEncrypt(){
    var input = String(document.getElementById("input").value);
    input = input.replace(/\s/g, "") //removes white space
    var shift = Number(document.getElementById("shift").value);
    if(handleInput(input)){
        var cipher = caesarCipher(input, shift);
        var result = document.getElementById("result");
        result.innerHTML = "The Caesar Encryption of "+input+", using the shift number "+shift+" is "+cipher;
    }else{
        alert("Please read the instruction carefully and follow the input rules.");
    }
}

function handleDecrypt(){
    var input = String(document.getElementById("inputDec").value);
    input = input.replace(/\s/g, "") //removes white space
    var shift = Number(document.getElementById("shiftDec").value);
    if(handleInput(input)){
        var decrypted = caesarDecrypt(input, shift);
        var result = document.getElementById("resultDec");
        result.innerHTML = "The Caesar Encryption of "+input+", using the shift number "+shift+" is "+decrypted;
    }else{
        alert("Please read the instructions carefully and follow the input rules.");
    }
}

//Related to caesar cipher - Encryption and Decryption
function caesarCipher(plain, shift){
    plain = plain.toLowerCase();
    var cipher = "";
    for(var i = 0; i < plain.length; i++){
        var charAscii = plain.charCodeAt(i);
        charAscii = charAscii - 97;
        var shifted = (charAscii + shift)%26 + 97;
        cipher += String.fromCharCode(shifted);
    }
    return cipher;
}

function caesarDecrypt(cipher, shift){
    cipher = cipher.toLowerCase();
    var decrypted = "";
    for(var i = 0; i < cipher.length; i++){
        var charAscii = cipher.charCodeAt(i);
        charAscii = charAscii - 97;
        var shifted = ((charAscii - shift)%26 + 26)%26 + 97;
        decrypted += String.fromCharCode(shifted);
    }

    return decrypted;
}
