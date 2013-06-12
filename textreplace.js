jQuery(document).ready(function($) {

	//Initial parameters (which could be based on input)
	var target = 'To be or not to be.';
	var genSize = 100;
	var genLimit = 10000;
	var mutRate = 0.05;

	//Set the target text so we know what we're looking for
	$('#target').text(target);

	//Create a target arrary of floats to represent our target
	var target_arr = target.split('');
	var target_size = target_arr.length;
	for(var i=0;i<target_size;i++) target_arr[i] = characterToFloat(target_arr[i]);

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

	//Score each of population
	var popScore = Array();
	for(var i=0;i<genSize;i++){
		popScore[i] = calculateFitness(target_arr,population[i]);
	}

	//Initial parameters for the loop
	var output = population[0];
	var c = 0;
	var best_score = 0;

	//set the loop running
	var intervalId = setInterval(myLoop, 50);

	/**
	 * Replaces a normal looop which took the form:
	 * while(c++ < genLimit && output != target ){}
	 * beacuse this can update the screen for each generation 
	 * and stops the browser getting worried the script is taking too long
	 **/
	function myLoop()
	{
		
		//Choose 2 parents
		var p1 = population[pickAGoodParent(popScore)];
		var p2 = population[pickAGoodParent(popScore)];

		//Create offspring and replace a member of the population
		var new1 = combineParents(p1,p2,mutRate);
		var d1 = pickOneToDie(popScore);
		var nFit = calculateFitness(target_arr,new1);
		//See if we should replace the current member
		if(nFit >= popScore[d1]){
			//If so just update the population and score (no need to recalculate for entire population)
			population[d1] = new1;
			popScore[d1] = nFit;
		}

		//Could replace with a pick best here
		var y = pickAGoodParent(popScore);

		//Ouput values and to see if we've arrived at target
		output = floatsToString(population[y]);
		best_score = calculateFitness(target_arr,population[y]);
		$('#output').text(output);
		$('#score').text(best_score);

		//Stopping condition
		if(c++ > genLimit || output == target){
			clearInterval(intervalId);
			window.alert("Finished! at count " + c);
		}

	}

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
  */
 function calculateFitness(target, attempt)
 {
 	var score = 0;
 	for(var i=0;i<target.length;i++){
 		if( floatToCharacter(target[i]) == floatToCharacter(attempt[i]) ) score++;
 	}
 	return score;
 }

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
	 * From an array of scores return the index of one, using the sqaure of their scores +1  as
	 * realitve probability weights
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
		//Could do a negative probabity here, but with the check against the new member this works OK
		return  Math.floor(Math.random() * theList.length);
	}

	/**
	 * Take 2 arrays and combine them, adding a chance of a mutation
	 */
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

}); //end document.ready()