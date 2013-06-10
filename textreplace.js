jQuery(document).ready(function($) {

	var target = 'To be or not to be.';
	var output = 'Our output';

	$('#output').text(output);
	var x = 0;
	var z = 0;
	var error = '';
	var counts = new Array();
	for(i = 0; i < 150; i++) counts[i] = 0; 
	for(i = 0; i <= 1000000; i++){
		x = Math.floor((Math.random() * 95) + 32);
		if(x > 126 || x < 32 ){
			error += 'X = ' + x + '<br>';
		}
		counts[x]++;
		z += x;
	}
	y = z/1000000;
	$('#output').text(y);
	if(error != ''){
		$('#error').text(error);
	} else $('#error').text('no error');

	var count_text = '';
	for(i=32;i<127;i++){
		count_text += '<p>' + String.fromCharCode(i) + ' = ' + counts[i] + '</p>';
	}
	$('#counts').append(count_text);
	$('#bit').text(characterToFloat('~'));
	$('#bit').append(floatToCharacter(0.99));
});

/**
 * Converts a float between 0 and 1 to a valid ASCII character
 * I.e. a character represented by a CharCode between 32 and 126
 **/
function floatToCharacter(number)
{
	return String.fromCharCode(Math.floor((number * 95) + 32)); 
}

/**
 * Converts a float between 0 and 1 to a valid ASCII character
 * I.e. a character represented by a CharCode between 32 and 126
 **/
function characterToFloat(character)
{
	return (character.charCodeAt(0) - 32) / 95;
}