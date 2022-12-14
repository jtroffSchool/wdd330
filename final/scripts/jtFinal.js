//Declare initial global variables
let pokeData = [];
let randomNum = 0;

//Pokemon url limited to however many pokemon you want to get
const kantoUrl = 'https://pokeapi.co/api/v2/pokemon?limit=151';
const johtoUrl = 'https://pokeapi.co/api/v2/pokemon?offset=151&limit=100';
const hoennUrl = 'https://pokeapi.co/api/v2/pokemon?offset=251&limit=135';
const sinnohUrl = 'https://pokeapi.co/api/v2/pokemon?offset=386&limit=107';

//Set all elements to use throughout the program
//Split out question and result divs so that everything would be centered easier
const questionHintDiv = document.querySelector('#questionHint');
const questionImageDiv = document.querySelector('#questionImage');
const generationSelection = document.querySelector('#generations');
const modeSelection = document.querySelector('#mode');
const start = document.querySelector('#generate');
const userResponse = document.querySelector('#response');
const result = document.querySelector('#result');
const resultImage = document.querySelector('#resultImage');

//Function used to fetch the initial pokemon list
async function fetchPokemon(url)
{
    await fetch(url)
    .then(function(response) {
        if(!response.ok){
            throw Error(response.statusText);
        }
        else{
            return response.json();
        };
    })
    .then(function(allPokemon) {
        allPokemon.results.forEach(function(pokemon){
            fetchPokemonData(pokemon);
        });
    })
    .catch(function(error) {
        console.log(error);
    });
}

//Function used to fetch all data for pokemon from the initial list
async function fetchPokemonData(pokemon)
{
    await fetch(pokemon.url)
    .then(function(response) {
        if(!response.ok){
            throw Error(response.statusText);
        }
        else{
            return response.json();
        };
    })
    .then(function(results){
        //Add result to pokeData array
        pokeData.push(results);
    })
    .catch(function(error) {
        console.log(error);
    });
}

//Initial run for the fetch
fetchPokemon(kantoUrl);

//Function to reset everything
function resetForm()
{
    questionHintDiv.innerHTML = '';
    questionImageDiv.innerHTML = '';
    userResponse.answer.value = '';
    result.innerHTML = '';
    resultImage.innerHTML = '';
}

//function to switch between the generations available
function switchGeneration()
{
    //Reset the pokeData array
    pokeData = [];
    //Call new generations depending on the dropdown value selected
    if(generationSelection.value == 'gen_1'){
        fetchPokemon(kantoUrl);
    }
    else if(generationSelection.value == 'gen_2'){
        fetchPokemon(johtoUrl);
    }
    else if(generationSelection.value == 'gen_3'){
        fetchPokemon(hoennUrl);
    }
    else if(generationSelection.value == 'gen_4'){
        fetchPokemon(sinnohUrl);
    }
    //default to first generation as that is what people are most familiar with
    else {
        fetchPokemon(kantoUrl);
    }
}

//Function to generate a Who's that Pokemon question
function generateQuestion()
{
    //Reset the form
    resetForm();

    //Get the mode for the question
    let mode = modeSelection.value;

    //Declare a random number between 0 and the length of the pokemon array
    randomNum = Math.floor(Math.random() * pokeData.length);

    //Create p element
    let questionText = document.createElement('p');

    //Try so that if a pokemon doesn't have two types it won't fail
    let node = null
    try
    {
        //Set node with both pokemon types
        node = document.createTextNode(`${capitalizeFirstLetter(pokeData[randomNum].types[0].type.name)}
        and ${capitalizeFirstLetter(pokeData[randomNum].types[1].type.name)} type`);
    }
    catch 
    {
        //Set node with only one type if above fails
        node = document.createTextNode(`${capitalizeFirstLetter(pokeData[randomNum].types[0].type.name)} type`);
    }

    //Add node to p element
    questionText.appendChild(node);
    //Append question with text
    questionHintDiv.appendChild(questionText);

    //If mode is normal than provide an image
    if(mode === 'normal'){
        //Create img and set src/alt
        let questionImage = document.createElement('img');
        questionImage.setAttribute('src', pokeData[randomNum].sprites.back_default);
        questionImage.setAttribute('alt', `PokedexID_${pokeData[randomNum].id}`)
        //Add image to div
        questionImageDiv.appendChild(questionImage);
    }
    
    //If mode is harder than give pokemon's ability instead of image
    if(mode === 'harder'){
        //Create new p tag and node to add abilities
        questionText = document.createElement('p');
        
        //Not every pokemon has two abilities and one secret ability.
        //Try for all three abilities and if not get one ability and one secret ability
        try 
        {
            node = document.createTextNode(`May have ${pokeData[randomNum].abilities[0].ability.name} 
            ability, ${pokeData[randomNum].abilities[1].ability.name} ability or 
            ${pokeData[randomNum].abilities[2].ability.name} secret ability`);
        }
        catch 
        {
            node = document.createTextNode(`May have ${pokeData[randomNum].abilities[0].ability.name} 
            ability or ${pokeData[randomNum].abilities[1].ability.name} secret ability`);
        }
        //Add node to p element
        questionText.appendChild(node);
        //Append question with text
        questionHintDiv.appendChild(questionText);
    }
}

//Function to capitalize the first letter of typing
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function checkAnswer(event)
{
    //Prevent submit from clearing form by default
    event.preventDefault();

    //Reset result values
    result.innerHTML = '';
    resultImage.innerHTML = '';

    //Get answer from user and from the array. Set user answer to lower.
    const userAnswer = userResponse.answer.value.toLowerCase();
    const answer = pokeData[randomNum].name;

    //Create img and set src/alt
    let answerImage = document.createElement('img');
    answerImage.setAttribute('src', pokeData[randomNum].sprites.front_default);
    answerImage.setAttribute('alt', `PokedexID_${answer}`);

    //Check if answer is correct
    if(userAnswer === answer)
    {
        //Append h2 element with Correct to result
        let correct = document.createElement('h2');
        correct.innerText = 'Correct!';
        result.appendChild(correct);
    }
    else
    {
        //Append h3 element with Wrong and right answer to result
        let wrong = document.createElement('h3');

        //Function to capitalize the answer so it looks better
        let capitalize = answer => answer[0].toUpperCase() + answer.slice(1)

        wrong.innerText = `Wrong! The correct answer was ${capitalize(answer)}.`;
        result.appendChild(wrong);
    }
    
    //Append the image to result regardless of answer
    resultImage.appendChild(answerImage);
}

//Event listeners for generate question and submit answer
start.addEventListener('click', generateQuestion);
generationSelection.addEventListener('change', switchGeneration);
userResponse.addEventListener('submit', checkAnswer);