$(document).ready(function () {
    // add all event handlers here
    $("#submit_register").on("click", encrypt_password);
    $("#submit_login").on("click", encrypt_login);
    // $(".user").on("click", create_communication);
    $("#submit_sentences").on("click", encrypt_sentence);
});

/**
 *
 */
function encrypt_password() {
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

function encrypt_login() {
    let password = $("#login input[id=password]")
    let data = password.val();
    let name = $("#login input[id=username]").val()
    let key = name + "DES";
    key = $.md5(key)
    password.val(encrypt(data, key))
    $("#login input[id=submit]").click()
}

/**
 * after user input, we encrypt the inout by JavaScript
 * we create the key by using MD5 to encrypt the name form two speakers
 * This could insure that the original data will not be send to the back-end
 * This could insure the security of the information
 */
function encrypt_sentence() {
    $.get("/getspeakers").done(function (response) {
        let k = $.md5(response["user1"] + ',' + response["user2"])
        let sentence = $("#sentence")
        let data = encrypt(sentence.val(), k)
        $.post("/addsentence", {'sentence': data}).done(
            console.log(sentence.val(""))
        )
    })
}


