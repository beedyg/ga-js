jQuery(document).ready(function($) {

	var target = 'To be or not to be.';
	var genSize = 100;
	var genLimit = 10000;
	var mutRate = 0.05;

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

	//Create our holding bits
	for(var i=0;i<genSize;i++){
		$('#pop').append('<p id="pop' + i + '">&nbsp;</p>');
	}

	var output = '';
	var c = 0;
	var best_score = 0;

	//Score each of population
	var popScore = Array();
	for(var i=0;i<genSize;i++){
		popScore[i] = calculateFitness(target_arr,population[i]);
	}

	while(c++ < genLimit && output != target ){

		//Choose 2 parents
		var p1 = population[pickAGoodParent(popScore)];
		var p2 = population[pickAGoodParent(popScore)];

		//Create offspring and replace a member of the population
		var new1 = combineParents(p1,p2,mutRate);
		var d1 = pickOneToDie(popScore);
		var nFit = calculateFitness(target_arr,new1);

		if(nFit >= popScore[d1]){
			population[d1] = new1;
			popScore[d1] = nFit;
		}

		//population[pickOneToDie(popScore)] = combineParents(p1,p2,mutRate);

		//should replace with a pick best here
		var y = pickAGoodParent(popScore);
		output = floatsToString(population[y]);
		best_score = calculateFitness(target_arr,population[y]);
		//document.writeln(output + " " + best_score + '\r\n');
		//document.getElementById("output").innerHTML = output + ' ' + best_score;
		/*
		$('#output').text(output);

		//Output this genetation and it's scores
		for(var i=0;i<genSize;i++){
			//out = floatsToString(population[i]);
			$('#pop' + i).text(floatsToString(population[i]) + ' - ' + popScore[i]);
		}
		*/
		//$('#output').text(output + ' ' + best_score);

	}
	$('#output').text(output + ' ' + best_score);
	
	/*
	//Score each of population
	var popScore = Array();
	for(var i=0;i<genSize;i++){
		popScore[i] = calculateFitness(target_arr,population[i]);
	}



	//Output this genetation and it's scores

	for(var i=0;i<genSize;i++){
		//out = floatsToString(population[i]);
		$('#pop').append('<p id="pop' + i + '">&nbsp;</p>');
	}

	for(var i=0;i<genSize;i++){
		//out = floatsToString(population[i]);
		$('#score').append('<p>' + popScore[i] + '</p>');
	}

	//var p_id = pickAGoodParent(popScore);
	window.alert('Chosen = ' + floatsToString(population[pickAGoodParent(popScore)]) +
							'\r\nDie = ' + floatsToString(population[pickOneToDie(popScore)]));

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
		/*
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
				sum += (1 - (Math.pow(theList[i]+1,2) / tSquares));
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
		return  Math.floor(Math.random() * theList.length);
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
	/*
	{
		var rValue = 0;
		var lSize = theList.length;
		//Find the lowest score
		var vLow = Math.min.apply(null, theList);
		//Find the highest score
		var vHigh = Math.max.apply(null, theList);
		
		if(vLow != vHigh){
			var tSquares = 0;
			for(var i=0;i<lSize;i++){
				tSquares += Math.pow(theList[i]+1,2);
			}
			var pDist = Array();
			for(i=0;i<lSize-1;i++){
				if(theList[i] > 0){
					sum += 1 - (Math.pow(theList[i]+1,2) / tSquares);
				}
				pDist[i] = sum;
			}
			var r = Math.random();
			for(var i=0; i<lSize && r >= pDist[i]; i++) ;
			rValue = i;	
		} else {
			//return random element if everyone scored the same
			rValue = Math.floor(Math.random() * lSize);
		}
		return rValue;
	}


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
		*/
