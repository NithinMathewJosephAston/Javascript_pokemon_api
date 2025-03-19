let offset = 0;
const limit = 10;

async function pokemonFetch(offset) {
    try {
        const response =await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}.`);
        const data = await response.json();
        // console.log(data);
        return data;
        }
    catch(error){
        console.error("Error fetching data:",error);
    }
}

async function getPokemonImage(pokemon_image){
    const response = await fetch(pokemon_image);
    const data = await response.json();
    return data.sprites.front_default;
}


async function pokemonTable(Pokedex){
    const tableBody = document.getElementById('pokemon-table-body');
    tableBody.innerHTML = '';
    for (let index = 0; index < Pokedex.length; index++) {
        const pokemon = Pokedex[index];
        const row = document.createElement('tr');
        const image_png =  await getPokemonImage(pokemon.url)
        row.innerHTML = `
        <td scope="row" class="align-middle text-center">${offset + index + 1}</td>
        <td class="align-middle text-center">${pokemon.name}</td>
        <td>
            <a href="${pokemon.url}" target="_blank">
            <img src="${image_png}" alt="${pokemon.name}" width="100" height="100">
            </a>
        </td>
        `;
        tableBody.appendChild(row);
    }
}

async function loadData() {
    const data = await pokemonFetch(offset);
    await pokemonTable(data.results);
    document.getElementById('prev-btn').disabled = offset === 0;
    document.getElementById('next-btn').disabled = !data.next;
    // Need to find a way to get the value of the total list without loading the data each time? Need to check with Jess
    return Math.round(data.count/limit)
}

// Function to handle the button click event
function handleButtonClick(event) {
    const buttonId = event.target.id;
    
    // Handle different button clicks based on their ID
    if (buttonId === 'prev-btn') {
        console.log('Previous button clicked');
        if (Number(document.getElementById("pg-1-btn").innerText) !== 1){
            // Todo --> store the button element in a variable for reusability or make a function that can be reused
            document.getElementById("pg-1-btn").innerText = String(Number(document.getElementById("pg-1-btn").innerText) - 1);
            document.getElementById("pg-2-btn").innerText = String(Number(document.getElementById("pg-2-btn").innerText) - 1);
            document.getElementById("pg-3-btn").innerText = String(Number(document.getElementById("pg-3-btn").innerText) - 1);
        } 
    } else if (buttonId === 'next-btn') {
        // Todo --> store the button element in a variable for reusability or make a function that can be reused
        document.getElementById("pg-1-btn").innerText = String(Number(document.getElementById("pg-1-btn").innerText) + 1);
        document.getElementById("pg-2-btn").innerText = String(Number(document.getElementById("pg-2-btn").innerText) + 1);
        document.getElementById("pg-3-btn").innerText = String(Number(document.getElementById("pg-3-btn").innerText) + 1);
    } else {
        const textElement = document.getElementById(`${buttonId}`);
        const reference = Number(textElement.innerText)
        if (reference !== total){
            if ( buttonId.split('-')[1]%3 === 0){
                document.getElementById("pg-1-btn").innerText = reference; 
                document.getElementById("pg-2-btn").innerText = String(reference + 1);
                textElement.innerText = String(reference + 2);  
            }
        }
        // Todo --> make A function if this logic is reusable
        offset = (reference - 1) * limit;
        console.log(offset);
        const dummy = loadData(); 
    }
}

// Attach the event listener to all the page buttons dynamically
document.querySelectorAll('.page-link').forEach(button => {
    button.addEventListener('click', handleButtonClick);
});

const total = loadData();