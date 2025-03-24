let offset = 0;
let total = 0;
let textElement;
let reference;
const limit = 10;



/**
 * Fetches data from the API.
 * 
 * @param {string} url - The full API URL to fetch data from.
 * @returns {Promise<Object>} A promise that resolves to the API response data.
 */
async function pokemonFetch(url) {
    try {
        const response =await fetch(url);
        const data = await response.json();
        // console.log(data);
        return data;
        }
    catch(error){
        console.error("Error fetching data:",error);
    }
}


/**
 * Populates an HTML table with Pokémon data.
 * 
 * @param {Array} Pokedex - An array of Pokémon objects retrieved from the API.
 * @returns {Promise<void>} A promise that resolves when the table is populated.
 */
async function pokemonTable(Pokedex){
    const tableBody = document.getElementById('pokemon-table-body');
    tableBody.innerHTML = '';
    for (let index = 0; index < Pokedex.length; index++) {
        const pokemon = Pokedex[index];
        const row = document.createElement('tr');
        const image_png =  await pokemonFetch(pokemon.url)
        row.innerHTML = `
        <td scope="row" class="align-middle text-center">${offset + index + 1}</td>
        <td class="align-middle text-center">${pokemon.name}</td>
        <td class="pokemon-sprite">
            <a href="${pokemon.url}" target="_blank">
            <img src="${image_png.sprites.front_default}" alt="${pokemon.name}" width="100" height="100">
            </a>
        </td>
        `;
        tableBody.appendChild(row);
    }
}


/**
 * Fetches Pokémon data from the API and populates the table.
 * 
 * Disables or enables pagination buttons based on available data.
 * 
 * @returns {Promise<void>} A promise that resolves when the data is loaded and the UI is updated.
 */
async function loadData() {
    const data = await pokemonFetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`);
    await pokemonTable(data.results);

    document.getElementById('prev-btn').parentElement.classList.toggle('disabled', document.getElementById("pg-1-btn").innerText === '1');

    // Todo: Disable "Next" if there's no next page
    // document.getElementById('next-btn').parentElement.classList.toggle('disabled', !data.next);
}


/**
 * Updates pagination numbers dynamically based on the clicked button.
 * 
 * If "Previous" is clicked, page numbers decrease by 1.
 * If "Next" is clicked, page numbers increase by 1.
 * If any other button is clicked, page numbers increase by 2 (default case).
 * 
 * @param {string} button - The ID of the clicked pagination button ('prev-btn' or 'next-btn').
 */
function buttonPageChange(button){
    switch(button){
        case 'prev-btn':
            for (let i=1; i<4; i++){
                document.getElementById(`pg-${i}-btn`).innerText = String(Number(document.getElementById(`pg-${i}-btn`).innerText) - 1);
            }
            break;
        case 'next-btn':
            for (let i=1; i<4; i++){
                document.getElementById(`pg-${i}-btn`).innerText = String(Number(document.getElementById(`pg-${i}-btn`).innerText) + 1);
            }
            break;
        case 'pg-2-btn':
                for (let i=1; i<4; i++){
                    document.getElementById(`pg-${i}-btn`).innerText = String(Number(document.getElementById(`pg-${i}-btn`).innerText) + 1);
                }
            break;
        case 'pg-3-btn':
            for (let i=1; i<4; i++){
                document.getElementById(`pg-${i}-btn`).innerText = String(Number(document.getElementById(`pg-${i}-btn`).innerText) + 2);
            }
            break;
    }
}


function pageHighlightChecker(currentVal, highlightValue){
    if (currentVal !== undefined){
        console.log(highlightValue);
        console.log(offset);
        for (let i=1; i<4; i++){
            if (document.getElementById(`pg-${i}-btn`).innerText === String(highlightValue)){
                document.getElementById(`pg-${i}-btn`).parentElement.classList.add('active');
            }
        }
    }
}

/**
 * Handles click events for pagination buttons.
 * 
 * - If "Previous" is clicked and the first page is not reached, it updates pagination.
 * - If "Next" is clicked, pagination is updated.
 * - If a numbered page button is clicked, it updates `offset` and reloads data.
 * 
 * @param {Event} event - The event object triggered by a button click.
 */
function handleButtonClick(event) {
    const buttonId = event.target.id;
    
    // Remove active class from all pagination buttons
    document.querySelectorAll('.pagination .page-item').forEach(item => {
        item.classList.remove('active');
    });

    // Handle different button clicks based on their ID
    if (buttonId === 'prev-btn') {
        console.log('Previous button clicked');
        if (Number(document.getElementById("pg-1-btn").innerText) !== 1){
            buttonPageChange(buttonId);
        } 
        pageHighlightChecker(textElement, reference);
        document.getElementById('prev-btn').parentElement.classList.toggle('disabled', document.getElementById("pg-1-btn").innerText === '1');
    } else if (buttonId === 'next-btn') {
        buttonPageChange(buttonId);
        pageHighlightChecker(textElement, reference);
        document.getElementById('prev-btn').parentElement.classList.toggle('disabled', document.getElementById("pg-1-btn").innerText === '1');
    } else {
        textElement = document.getElementById(`${buttonId}`);
        reference = Number(textElement.innerText);
        if (reference !== total){
            if ( buttonId.split('-')[1]%3 === 0){ 
                buttonPageChange(buttonId);
                textElement = document.getElementById("pg-1-btn");
            }
            else if (buttonId.split('-')[1]%2 === 0){
                buttonPageChange(buttonId);
                textElement = document.getElementById("pg-1-btn");
            }
        }
        offset = (reference - 1) * limit;
        loadData(); 

        // Highlight the clicked button
        textElement.parentElement.classList.add('active');
    }
}

// Attach the event listener to all the page buttons dynamically
document.querySelectorAll('.page-link').forEach(button => {
    button.addEventListener('click', handleButtonClick);
});

fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}.`)
.then((response) => response.json())
.then((data)=>{
    pokemonTable(data.results);
    total = Math.round(data.count/limit);
})
