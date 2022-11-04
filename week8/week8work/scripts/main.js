const detailsBox = document.getElementById("detailsbox");
const basePokemonUrl = "https://pokeapi.co/api/v2/pokemon";
let limit = 10;

async function fetchPokemon(url)
{
    response = await fetch(url);
    if(response.ok){
        const pokemon = await response.json();
        return pokemon;
    };
}

function getPokemon(url) {
    return fetchPokemon(url);
}

function renderPokemonList(pokemonList, pokemonListElement) {
    const list = pokemonListElement.children[1];
    list.innerHTML = "";
    pokemonList.forEach(function (pokemon) {
        let listItem = document.createElement("tr");
        let pokeData = null;

        getPokemon(pokemon.url).then(function (data){
            listItem.innerHTML = `
                <td><a href="${pokemon.url}">${pokemon.name}</a></td>
                <td>${data.id}</td>
                `;
            pokeData = data;
        });
        

        listItem.addEventListener("click", function (event) {
            event.preventDefault();
            renderPokemonDetails(pokeData);
        });

        list.appendChild(listItem);
    });
}

// function getPokemonDetails(url) {
//     getPokemon(url).then(function (data) {
//         renderPokemonDetails(data);
//     });
// }

function renderPokemonDetails(pokeData) {
    detailsBox.setAttribute("class", "visible")
    let type = '';
    try
    {
        type = `${pokeData.types[0].type.name} type and ${pokeData.types[1].type.name} type`;
    }
    catch 
    {
        type = `${pokeData.types[0].type.name} type`;
    }

    detailsBox.innerHTML = `
        <dl>
            <dt>Name:</dt>
            <dd>${pokeData.name}</dd>
        </dl>
        <dl>
            <dt>Picture:</dt>
            <dd>
                <img src="${pokeData.sprites.front_default}" alt="${pokeData.name}" id="image">
            </dd>
        </dl>
        <dl>
            <dt>Type:</dt>
            <dd>${type}</dd>
        </dl>
        <dl>
            <dt>Weight:</dt>
            <dd>${pokeData.weight} lbs</dd>
        </dl>
        <dl>
            <dt>Hp Base Stat:</dt>
            <dd>${pokeData.stats[0].base_stat}</dd>
        </dl>
        <dl>
            <dt>Attack Base Stat:</dt>
            <dd>${pokeData.stats[1].base_stat}</dd>
        </dl>
        <dl>
            <dt>Defense Base Stat:</dt>
            <dd>${pokeData.stats[2].base_stat}</dd>
        </dl>
        <dl>
            <dt>Special Attack Base Stat:</dt>
            <dd>${pokeData.stats[3].base_stat}</dd>
        </dl>
        <dl>
            <dt>Special Defense Base Stat:</dt>
            <dd>${pokeData.stats[4].base_stat}</dd>
        </dl>
        <dl>
            <dt>Speed Base Stat:</dt>
            <dd>${pokeData.stats[5].base_stat}</dd>
        </dl>
    `;
}

function showPokemon(url = `${basePokemonUrl}?limit=${limit}`) {
    getPokemon(url).then(function (data) {
      console.log(data);
      const results = data.results;
  
      //get the list element
      const pokemonListElement = document.getElementById("pokemonlist");
      renderPokemonList(results, pokemonListElement);
  
      // enable the next and prev buttons.
      if (data.next) {
        const next = document.getElementById("next");

        next.onclick = () => {
          showPokemon(data.next);
          
          detailsBox.setAttribute("class", "hidden")
        };
      }
      if (data.previous) {
        const prev = document.getElementById("prev");
  
        prev.onclick = () => {
          showPokemon(data.previous);
          
          detailsBox.setAttribute("class", "hidden")
        };
      }
      pagination(data);
    });
  }

  function pagination(data){
    const parentElement = document.getElementById("parentElement");
    parentElement.innerHTML = "";
    for(let i=0;i<data.count/limit;i++){

        const pagin = document.createElement('a');
        pagin.setAttribute("href", "#");
    
        pagin.textContent = `${i+1}`;
        
        pagin.addEventListener('click', () => {
          showPokemon(basePokemonUrl + `?offset=${(i*10)+1}&limit=${limit}`);
        });
    
        parentElement.appendChild(pagin);
      }    
  }
  showPokemon();