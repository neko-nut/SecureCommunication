/**
 * after pre-process the data and key, execute the DES
 * the algorithm
 * @param {String} data the 64 bits binary data
 * @param {String} key the 64 bits binary key
 * @param {String} method 'encrypt' or 'decrypt'
 */
function DES(data, key, method){

	// use ip substitution table to switch the data
	// initial permutation
	let init = ''
	let ip = [58, 50, 42, 34, 26, 18, 10, 2,
		60, 52, 44, 36, 28, 20, 12, 4,
		62, 54, 46, 38, 30, 22, 14, 6,
		64, 56, 48, 40, 32, 24, 16, 8,
		57, 49, 41, 33, 25, 17, 9, 1,
		59, 51, 43, 35, 27, 19, 11, 3,
		61, 53, 45, 37, 29, 21, 13, 5,
		63, 55, 47, 39, 31, 23, 15, 7]
	for(let i = 0; i < 64; i++){
		init = init + (data[ip[i] - 1])
	}

	// split data into left part and right part
	let left = init.slice(0, 32)
	let right = init.slice(32, 64)

	// get 16 subkeys
	let keys = getKeys(key)

	// if decrypt, reverse the subkeys
	if(method == 'decrypt'){
		keys = keys.reverse()
	}

	// encode the data in 16 rouhds
	for(let i = 0; i < 16; i++){
		let l = right
		let r = bitxor(left, feistel(right, keys[i]))
		left = l
		right = r
	}
	let fina = right.concat(left)

	// use fp substitution table to switch the data
	// final permutation
    let fp = [40, 8, 48, 16, 56, 24, 64, 32,
            39, 7, 47, 15, 55, 23, 63, 31,
            38, 6, 46, 14, 54, 22, 62, 30,
            37, 5, 45, 13, 53, 21, 61, 29,
            36, 4, 44, 12, 52, 20, 60, 28,
            35, 3, 43, 11, 51, 19, 59, 27,
            34, 2, 42, 10, 50, 18, 58, 26,
			33, 1, 41, 9, 49, 17, 57, 25]	
	let result = ''	
	for(let i = 0; i < 64; i++){
		result = result.concat(fina[fp[i] - 1])
	}

	return result
}



/**
 * use the initial 64 bits key to calculate 16 48 bits subkeys, which will been used to encrypt the data
 * @param {String} key 
 */
function getKeys(key){

	// split the key into left parts and right parts
	let left = PC1_left(key)
	let right = PC1_right(key)
	let keys = []

	// for each round, move special bits
	let move = [1, 1, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 1]

	// get 16 subkeys
    for(let i = 0; i < 16; i++){
		left = rotate(left, move[i])
		right = rotate(right, move[i])
		let newkey = left.concat(right)


		// use the table to switch the data
		let pc2 = [14, 17, 11, 24, 1, 5, 
            3, 28, 15, 6, 21, 10,
            23, 19, 12, 4, 26, 8,
            16, 7, 27, 20, 13, 2,
            41, 52, 31, 37, 47, 55,
            30, 40, 51, 45, 33, 48,
            44, 49, 39, 56, 34, 53,
			46, 42, 50, 36, 29, 32]
		
		let subkey = ''
		for(let k = 0; k < 48; k++){
			subkey = subkey.concat(newkey[pc2[k] - 1])
		}
		keys.push(subkey)
	}
	return keys
}




/**
 * split the key into left part and right part.
 * manage the keys
 * @param {String} key 
 */
function PC1_left(key){
    let pc1_l = [57, 49, 41, 33, 25, 17, 9, 
            1, 58, 50, 42, 34, 26, 18, 
            10, 2, 59, 51, 43, 35, 27, 
            19, 11, 3, 60, 52, 44, 36]
    	
	let left = ''
	for(let i = 0; i < 28; i++){
		left = left.concat(key[pc1_l[i] - 1])
	}
	return left
}

function PC1_right(key){
	let pc1_r = [63, 55, 47, 39, 31, 23, 15, 
		7, 62, 54, 46, 38, 30, 22, 
		14, 6, 61, 53, 45, 37, 29, 
		21, 13, 5, 28, 20, 12, 4]
	let right = ''
	for(let i = 0; i < 28; i++){
		right = right.concat(key[pc1_r[i] - 1])
	}
	return right
}



/**
 * rotate the list
 * @param {String} list 
 * @param {int} move 
 */
function rotate(list, move){
	for(let i = 0; i < move; i++){
		list  = list.concat(list[0])
		list = list.slice(1)
	}
	return list
}




/**
 * calculate the XOR
 * @param {String} data1 the binary data which has same length with data2
 * @param {String} data2 the binary data which has same length with data1
 */
function bitxor(data1, data2){
	let result = ''
	for(let i = 0; i < data1.length; i++){
		if(data1[i] == data2[i]){
			result = result.concat('0')
		}else{
			result = result.concat('1')
		}
	}
	return result
}

/**
 * the Feistel function
 * @param {String} data the right part of the data
 * @param {String} key the subkey
 */
function feistel(data, key){

	// expend the data
	let e = [32, 1, 2, 3, 4, 5,
        4, 5, 6, 7, 8, 9,
        8, 9, 10, 11, 12, 13,
        12, 13, 14, 15, 16, 17,
        16, 17, 18, 19, 20, 21,
        20, 21, 22, 23, 24, 25,
        24, 25, 26, 27, 28, 29,
		28, 29, 30, 31, 32, 1]
	let expend = ''
	for(let i = 0; i < 48; i++){
		expend = expend.concat(data[e[i] - 1])
	}

	// the S box
    S_box = [[14,4,13,1,2,15,11,8,3,10,6,12,5,9,0,7,
		0,15,7,4,14,2,13,1,10,6,12,11,9,5,3,8,
		4,1,14,8,13,6,2,11,15,12,9,7,3,10,5,0,
		15,12,8,2,4,9,1,7,5,11,3,14,10,0,6,13], 
		[15,1,8,14,6,11,3,4,9,7,2,13,12,0,5,10,
		3,13,4,7,15,2,8,14,12,0,1,10,6,9,11,5,
		0,14,7,11,10,4,13,1,5,8,12,6,9,3,2,15,
		13,8,10,1,3,15,4,2,11,6,7,12,0,5,14,9], 
		[10,0,9,14,6,3,15,5,1,13,12,7,11,4,2,8,
		13,7,0,9,3,4,6,10,2,8,5,14,12,11,15,1,
		13,6,4,9,8,15,3,0,11,1,2,12,5,10,14,7,
		1,10,13,0,6,9,8,7,4,15,14,3,11,5,2,12],
		[7,13,14,3,0,6,9,10,1,2,8,5,11,12,4,15,
		13,8,11,5,6,15,0,3,4,7,2,12,1,10,14,9,
		10,6,9,0,12,11,7,13,15,1,3,14,5,2,8,4,
		3,15,0,6,10,1,13,8,9,4,5,11,12,7,2,14],
		[2,12,4,1,7,10,11,6,8,5,3,15,13,0,14,9,
		14,11,2,12,4,7,13,1,5,0,15,10,3,9,8,6,
		4,2,1,11,10,13,7,8,15,9,12,5,6,3,0,14,
		11,8,12,7,1,14,2,13,6,15,0,9,10,4,5,3],
		[12,1,10,15,9,2,6,8,0,13,3,4,14,7,5,11,
		10,15,4,2,7,12,9,5,6,1,13,14,0,11,3,8,
		9,14,15,5,2,8,12,3,7,0,4,10,1,13,11,6,
		4,3,2,12,9,5,15,10,11,14,1,7,6,0,8,13],
		[4,11,2,14,15,0,8,13,3,12,9,7,5,10,6,1,
		13,0,11,7,4,9,1,10,14,3,5,12,2,15,8,6,
		1,4,11,13,12,3,7,14,10,15,6,8,0,5,9,2,
		6,11,13,8,1,4,10,7,9,5,0,15,14,2,3,12],
		[13,2,8,4,6,15,11,1,10,9,3,14,5,0,12,7,
		1,15,13,8,10,3,7,4,12,5,6,11,0,14,9,2,
		7,11,4,1,9,12,14,2,0,6,10,13,15,3,5,8,
		2,1,14,7,4,10,8,13,15,12,9,0,3,5,6,11]]

	// execute the XOR between the expended data and the key
	let t = bitxor(expend, key)

	// spilt the data into 6 bits, switch by the S box
	let c = 0
	let r = []
	for(let i = 0; i < 48; i = i + 6){
		let s = t.slice(i, i + 6)
		// the corresponding location in the S box is s[0] * 16 + s[5] * 8 + int(s[1] + s[2] + s[3] + s[4])
		// which is equal to int(s[0] + s[5] + s[1] + s[2] + s[3] + s[4])
		s = s[0] + s[5] + s[1] + s[2] + s[3] + s[4]
		r.push(S_box[c][parseInt(s, 2)])
		c++
	}

	// transform the switch result it into binary data
	// if the data is less then 4 bits, add '0' to fill it
	let s_result = ''
	for(let i = 0; i < 8; i++){
		let v = r[i].toString(2)
		while(v.length < 4){
			v = '0' + v
		}
		s_result = s_result + v
	}
	
	// use p table to switch the data
	let result = ''
    p = [16, 7, 20, 21,
        29, 12, 28, 17,
        1, 15, 23, 26,
        5, 18, 31, 10,
        2, 8, 24, 14,
        32, 27, 3, 9,
        19, 13, 30, 6,
		22, 11, 4, 25]
	for(let i = 0; i < p.length; i++){
		result = result.concat(s_result[p[i] - 1])
	}
	return result
}



/**
 * encrypt the data
 * @param {String} data 
 * @param {String} key 
 */
encrypt = function(data, key){
	// consolezz.log(data)

	// handle the key and data
    key = encode_key(encode_data(encode_binary(key)))
    data = encode_data(encode_binary(data))
    
    // execute the DES
    let result = ''
    for(let i = 0; i < data.length; i++){
        result = result.concat(DES(data[i], key, 'encrypt'))
    }
    // console.log(window.btoa(result))
    return window.btoa(result)
}


/**
 * decrypt the data
 * @param {String} data 
 * @param {String} key 
 */
function decrypt(data, key){
    console.log(data)
    key = encode_key(encode_data(encode_binary(key)))
	data = encode_data(window.atob(data))
	// console.log(data)
    
    // execute the DES
    let result = ''
    for(let i = 0; i < data.length; i++){
        result = result.concat(DES(data[i], key, 'decrypt'))
    }
    // console.log(decode_binary(result))
    return decode_binary(result)
}


/**
 * change the real data to the binary data
 * the result should be a list of data, each item is 64 bits
 * @param {String} data the data that need to change to the binary data
 */
function encode_binary(data){

    //translate the data into binary system
    data = data.split('')
    let bin_data = ''
    for(let i = 0; i < data.length; i++){
        data[i] = data[i].charCodeAt(0).toString(2)
        //complicated it into 8 bits
        while(data[i].length < 8){
            data[i] = '0'.concat(data[i])
        }
        bin_data = bin_data.concat(data[i])
	}
	return bin_data
}

/**
 * split the binary data into 64 bits Strings
 * @param {String} bin_data the binary data
 */
function encode_data(bin_data){

    // split it 
    let split_data = []
    while(bin_data.length > 64){
        split_data.push(bin_data.slice(0, 64))
        bin_data = bin_data.slice(64)
    }

    // if the left is less the 64 bits, add '0' behind it to aill it
    if(bin_data.length > 0){
        while(bin_data.length < 64){
            bin_data = bin_data.concat('0')
        }
        split_data.push(bin_data)
    }

    return split_data

}


/**
 * for linger key, execute the xor to combine it into a 64 bits key
 * @param {List} keys 
 */
function encode_key(keys){
    let key = keys[0]
    for(let i = 1; i < keys.length; i++){
        key = bitxor(keys[i], key)
    }
    return key
}

/**
 * change the binary data into real character through the ascii
 * @param {String} data binary data
 */
function decode_binary(data){
    let result = ''
    while(data.length >= 8){
        let assic = data.slice(0,8)
        data = data.slice(8)
        result = result.concat( String.fromCharCode(parseInt(assic, 2)))
    }

    // console.log(result)
    return result

}
