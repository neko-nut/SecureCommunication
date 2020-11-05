// 0 is encrypt while 1 is decrypt
let method = 0
// 0 is text while 1 is file
let data_type = 0

// get the elements
let text_button = document.getElementById("text_button")
let file_button = document.getElementById("file_button")
let file = document.getElementById("file")
let text = document.getElementById("text")
let text_result = document.getElementById("text_result")
let file_result = document.getElementById("file_result")
// initially the data type is text, and the elements for the file should not be shown
file.hidden = true
file_result.hidden = true
text_button.style =  "color: red"

/**
 * if the user choose to input the text
 * show the elements that used to input text
 * hidden the elemets that used to habdle file
 */
text_button.onclick = function(){
    text.hidden = false
    text_result.hidden = false
    file.hidden = true
    file_result.hidden = true
    text_button.style =  "color: red"
    file_button.style = "color: black"
    data_type = 0
}

/**
 * if the user choose to input the file
 * show the elements that used to input file
 * hidden the elemets that used to habdle text
 */
file_button.onclick = function(){
    text.hidden = true
    text_result.hidden = true
    file.hidden = false
    file_result.hidden = false
    text_button.style =  "color: black"
    file_button.style = "color: red"
    data_type = 1
}


// get the elements
let encrypt_button = document.getElementById("encrypt_button")
let decrypt_button = document.getElementById("decrypt_button")
// initilally the method is encrypt
encrypt_button.style =  "color: red"

/**
 * if change to encrypt
 * clean the file and switch the result and the data
 */
encrypt_button.onclick = function(){
    encrypt_button.style =  "color: red"
    decrypt_button.style =  "color: black"
    file.value = ''
    if(data_type == 0 && method == 1){
        let a = text_result.value
        text_result.value = text.value
        text.value = a
    }
    method = 0
}

/**
 * if change to decrypt
 * clean the file and switch the result and the data
 */
decrypt_button.onclick = function(){
    encrypt_button.style =  "color: black"
    decrypt_button.style =  "color: red"
    file.value = ''
    if(data_type == 0 && method == 0){
        let a = text_result.value
        text_result.value = text.value
        text.value = a
    }
    method = 1
}

// get the element
key = document.getElementById('key')

/**
 * if data type is text
 * chane the result with the change of data or key
 */
text.oninput = function(){
    if(method == 0){
        text_result.value = encrypt(text.value, key.value);
    }else{
        text_result.value = decrypt(text.value, key.value);
    }
}
key.oninput = function(){
    if(data_type == 0){
        if(method == 0){
            text_result.value = encrypt(text.value, key.value);
        }else{
            text_result.value = decrypt(text.value, key.value);
        }
    }
}


// the name and the content of the file
let name = ''
let content = ''

// new filereader
let reader = new FileReader();

/**
 * load the file
 * if encrypt, read the file as data URI, which will be used to encrypt
 * if decrypt, read the text in the file, which is the incrypted data 
 * @param {Object} event the event when load the file
 */
file.onchange = function(event){
    let file = event.target.files[0];
    name = file.name
    if(method == 0){
        reader.readAsDataURL(file);
    }else{
        reader.readAsText(file);
    }
}

/**
 * get the data and store it in the content
 * @param {Object} event 
 */
reader.onload = function(event) {
    content = event.target.result;
};


/**
 * execute the data and download the file
 */
file_result.onclick = function() {
    let aTag = document.createElement('a');
    if(method == 0){
        // if encrypt, encrypt the data, store the result in the txt file which name is the original name add 'encrypt.txt'
        let blob = new Blob([encrypt(content, key.value)]);
        // set a link to the file and click it to download
        aTag.download = name.concat('encrypt.txt');
        aTag.href = URL.createObjectURL(blob);
        aTag.click();
        URL.revokeObjectURL(blob);
    }else{
        // if decrypt, decrypt the data and remove the 0 which we add before
        let dataURL = decrypt(content, key.value)
        dataURL = dataURL.split('\0')[0];
        let blob = dataURItoBlob(dataURL);
        // set a link to the file and click it to download
        aTag.download = name.split('encrypt')[0];
        aTag.href = URL.createObjectURL(blob);
        aTag.click();
        URL.revokeObjectURL(blob);
    }

}

/**
 * reference:  https://stackoverflow.com/questions/6850276/how-to-convert-dataurl-to-file-object-in-javascript
 * change the data URI into the file
 * @param {String} dataURI the dayaURI which is 
 */
function dataURItoBlob(dataURI) {
    // convert base64 to raw binary data held in a string
    // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
    var byteString = atob(dataURI.split(',')[1]);
  
    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
  
    // write the bytes of the string to an ArrayBuffer
    var ab = new ArrayBuffer(byteString.length);
  
    // create a view into the buffer
    var ia = new Uint8Array(ab);
  
    // set the bytes of the buffer to the correct values
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
  
    // write the ArrayBuffer to a blob, and you're done
    var blob = new Blob([ab], {type: mimeString});
    return blob;
  
  }
