jQuery(document).ready(function($) {

	var counts = [];
	for(var i=0;i<10;i++){ counts[i] = 0 };

	var weights = [0,2,3,7,9,12,1,0,3,7];
	for(i=0;i<10000;i++){ counts[pickOneToDie(weights)]++; }

	for(i=0;i<counts.length;i++){
		//out = floatsToString(population[i]);
		$('#pop').append('<p>' + weights[i] + ' ' + counts[i] + '</p>');
	}


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
			tSquares += Math.pow(theList[i]+1,2);
		}
		if(tSquares != lSize){
			var pDist = Array();
			var i,sum = 0;
			for(i=0;i<lSize-1;i++){
				sum += (Math.pow(theList[i]+1,2) / tSquares);
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
		var tSquares = 0;
		for(var i=0;i<lSize;i++){
			tSquares += Math.pow(theList[i]+1,2);
		}
		if(tSquares != lSize){
			var pDist = Array();
			var i,sum = 0;
			for(i=0;i<lSize-1;i++){
				sum += Math.pow((theList[i]+1,2) / tSquares);
				pDist[i] = sum;
			}
			var r = Math.random();
			for(var i=0; i<lSize && r < pDist[i]; i++) ;
			rValue = i;	
		} else {
			//return random element if everyone scored 0
			rValue = Math.floor(Math.random() * lSize);
		}
		return rValue;
	}

	/**
	 * Take 2 arrays and combine them, adding a chance of a mutation
	 **/
	function combineParents(parent1, parent2, mutRate)
	{
		var offspring = Array();
		for(var i=0;i<parent1.length;i++){
			if(Math.floor(Math.random() * 2) == 0){
				offspring[i] = parent1[i];
			} else offspring[i] = parent2[i];
		}
		//random mutation
		if(Math.random() > mutRate){
			var x = Math.floor(Math.random() * parent1.length);
			offspring[x] = Math.random();
		}
		return offspring;
	}
