// //from example code in class
$(document).ready(function(){
	// add all event handlers here
	// $("#register input[id=submit]").on("click", test);
	$("#submit_register").on("click", encrypt_password);
	$("#submit_login").on("click", encrypt_login);
});
//
function encrypt_password(){
    let password = $("#register input[id=password]")
    let data = password.val();
    let key = $("#register input[id=username]").val() + "DES";
    key = $.md5(key)
    password.val(encrypt(data, key))
    let repeat_pwd = $("#register input[id=repeat_pwd]")
    data = repeat_pwd.val()
    repeat_pwd.val(encrypt(data, key))
    $("#register input[id=submit]").click()
}

function encrypt_login(){
    let password = $("#login input[id=password]")
    let data = password.val();
    let key = $("#login input[id=username]").val() + "DES";
    key = $.md5(key)
    password.val(encrypt(data, key))
    $("#login input[id=submit]").click()
}


function encrypt_sentence(){


}





/*
// the name and the content of the file
let name = ''
let content = ''

// new filereader
let reader = new FileReader();
*/
/**
 * load the file
 * if encrypt, read the file as data URI, which will be used to encrypt
 * if decrypt, read the text in the file, which is the incrypted data 
 * @param {Object} event the event when load the file
 */
/*
file.onchange = function(event){
    let file = event.target.files[0];
    name = file.name
    if(method == 0){
        reader.readAsDataURL(file);
    }else{
        reader.readAsText(file);
    }
}
 */

/**
 * get the data and store it in the content
 * @param {Object} event 
 */
/*
reader.onload = function(event) {
    content = event.target.result;
};

 */


/**
 * execute the data and download the file
 */
/*
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
 */

/**
 * reference:  https://stackoverflow.com/questions/6850276/how-to-convert-dataurl-to-file-object-in-javascript
 * change the data URI into the file
 * @param {String} dataURI the dayaURI which is 
 */
/*
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

 */
