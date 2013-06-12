jQuery(document).ready(function($) {

	var target = 'To be or not to be.';
	var genSize = 10;
	var genLimit = 1000;
	var mutRate = 0.0;

	//Set the target text so we know what we're looking for
	$('#target').text(target);

	//Create a target arrary of floats to represent our target
	var target_arr = target.split('');
	var target_size = target_arr.length;
	for(var i=0;i<target_arr.length;i++) target_arr[i] = characterToFloat(target_arr[i]);

	//create our initial population
	var population = Array();	
	for(var i=0;i<genSize;i++){
		population[i] = Array();
		for(var j=0;j<target_size;j++) population[i][j] = Math.random();
	}
	
	//Score each of population
	var popScore = Array();
	for(var i=0;i<genSize;i++){
		popScore[i] = calculateFitness(target_arr,population[i]);
	}

	//Output this genetation and it's scores

	for(var i=0;i<genSize;i++){
		//out = floatsToString(population[i]);
		$('#pop').append('<p id="pop' + i + '">&nbsp;</p>');
		$('#pop' + i).text(floatsToString(population[i]));
	}

	for(var i=0;i<genSize;i++){
		//out = floatsToString(population[i]);
		$('#score').append('<p>' + popScore[i] + '</p>');
	}

	//var p_id = pickAGoodParent(popScore);
	window.alert('Chosen = ' + floatsToString(population[pickAGoodParent(popScore)]));

/*
	var output_arr = Array();
	for(i=0;i<target_arr.length;i++) output_arr[i] = Math.random();
var codes = '';
	var output = '';
	for(i=0;i<output_arr.length;i++) output += floatToCharacter(output_arr[i]);	
			for(var j=0;j<population.length;j++){
			codes += '.' + Math.floor((population[i][j] * 95) + 32);
		}
		$('#pop').append('<p>' + codes + '</p>');

	*/
	
	//$('#output').text(output);

});

/**
 * Converts a float between 0 and 1 to a valid ASCII character
 * I.e. a character represented by a CharCode between 32 and 126
 */
function floatToCharacter(number)
{
	return String.fromCharCode(Math.floor((number * 95) + 32)); 
}

/**
 * Converts a float between 0 and 1 to a valid ASCII character
 * I.e. a character represented by a CharCode between 32 and 126
 */
function characterToFloat(character)
{
	return (character.charCodeAt(0) - 32) / 95;
}

/**
 * Fitness function which returns a score based on how close one array is to another
 **/
 function calculateFitness(target, attempt)
 {
 	var score = 0;
 	for(var i=0;i<target.length;i++){
 		if( floatToCharacter(target[i]) == floatToCharacter(attempt[i]) ) score++;
 	}
 	return score;
 }
 /*
 //Old version using average distance
 function calculateFitness(target, attempt)
 {
 	var distance = 0.0;
 	for(var i=0;i<target.length;i++){
 		distance += Math.pow((target[i] - attempt[i]), 2);
 	}
 	return distance;
 }
 */

 /**
  * Turn an array of floats into a lovely String
  */
	function floatsToString(float_arr)
	{
		var rString = '';
		for(var i=0;i<float_arr.length;i++){
			rString += floatToCharacter(float_arr[i]);
		}
		return rString;
	}

	/**
	 * From an array of scores return the index of one of them using the sqaure of their scores as
	 * a percentage of likelyhood
	 */
	function pickAGoodParent(theList)
	{
		var rValue = 0;
		var lSize = theList.length;
		var tSquares = 0;
		for(var i=0;i<lSize;i++){
			tSquares += Math.pow(theList[i],2);
		}
		if(tSquares > 0){
			var pDist = Array();
			var i,sum = 0;
			for(i=0;i<lSize-1;i++){
				if(theList[i] > 0){
					sum += (Math.pow(theList[i],2) / tSquares);
				}
				pDist[i] = sum;
			}
			var r = Math.random();
			for(var i=0; i<lSize && r >= pDist[i]; i++) ;
			rValue = i;	
		} else {
			//return random element if everyone scored 0
			rValue = Math.floor(Math.random() * lSize);
		}
		return rValue;
	}

	/**
	 * Pick a memember of the population to replace (returns index of the member)
	 */
	function pickOneToDie(theList)
	{
		var rValue = 0;
		var lSize = theList.length;
		//Find the lowest score
		var vLow = Math.min.apply(null, theList);
		//Find the highest score
		var vHigh = Math.max.apply(null, theList);



		/*
		for(var i=0;i<lSize;i++){
			tSquares += Math.pow(theList[i],2);
		}
		if(tSquares > 0){
			var pDist = Array();
			var i,sum = 0;
			for(i=0;i<lSize-1;i++){
				if(theList[i] > 0){
					sum += (Math.pow(theList[i],2) / tSquares);
				}
				pDist[i] = sum;
			}
			var r = Math.random();
			for(var i=0; i<lSize && r >= pDist[i]; i++) ;
			rValue = i;	
		} else {
			//return random element if everyone scored 0
			rValue = Math.floor(Math.random() * lSize);
		}
		return rValue;
		*/
	}