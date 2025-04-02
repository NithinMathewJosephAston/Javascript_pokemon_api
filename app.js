let offset = 0;
let total = 0;
let textElement, reference;
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
        // console.log(pokemon.url);
        row.innerHTML = `
        <td scope="row" class="align-middle text-center press-start-2p-regular" style="color:white;font-size:14px;">${"No."+String(offset + index + 1).padStart(3, '0')}</td>
        <td class="align-middle text-center press-start-2p-regular" style="color:white;font-size:14px">${pokemon.name}</td>
        <td class="pokemon-sprite">
            <a href="${pokemon.url}" target="_blank">
            ${image_png.sprites.front_default ? `<img src="${image_png.sprites.front_default}" alt="${pokemon.name}" width="150" height="150">`: ''}
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

    document.getElementById('prev-btn').parentElement.classList.toggle('disabled', document.getElementById("pg-1-btn").innerText == '1');
    document.getElementById('next-btn').parentElement.classList.toggle('disabled', document.getElementById("pg-3-btn").innerText == total);
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
    let button_values = [0];
    for (let i=1; i<4; i++){
        button_values.push( parseInt(document.getElementById(`pg-${i}-btn`).innerText) );
    }
    switch(button){
        case 'prev-btn':
            for (let i=1; i<4; i++){
                document.getElementById(`pg-${i}-btn`).innerText = button_values[i] - 1;
            }
            break;
        case 'next-btn':
            for (let i=1; i<4; i++){
                document.getElementById(`pg-${i}-btn`).innerText = button_values[i] + 1;
            }
            break;
        case 'pg-3-btn':
            for (let i=1; i<4; i++){
                document.getElementById(`pg-${i}-btn`).innerText = button_values[i] + 2;
            }
            break;
        case 'First':
            for (let i=1; i<4; i++){
                document.getElementById(`pg-${i}-btn`).innerText = i;
            }
            textElement = document.getElementById("pg-1-btn");
            reference = 1;
            break;
        case 'Last':
            for (let i=1; i<4; i++){
                document.getElementById(`pg-${i}-btn`).innerText = total - (3 - i);
            }
            textElement = document.getElementById("pg-3-btn");
            reference = total;
            break;
    }
}


/**
 * Highlights the pagination button corresponding to the given value.
 * 
 * @param {number} currentVal - The current value to check (ensures it's defined before proceeding).
 * @param {number} highlightValue - The value to match against the pagination buttons.
 * 
 * This function iterates over pagination buttons (pg-1-btn to pg-3-btn) and checks if their innerText 
 * matches the `highlightValue`. If a match is found, it adds the 'active' class to its parent element.
 */
function pageHighlightChecker(currentVal, highlightValue){
    if (currentVal !== undefined){
        for (let i=1; i<4; i++){
            if (document.getElementById(`pg-${i}-btn`).innerText == String(highlightValue)){
                document.getElementById(`pg-${i}-btn`).parentElement.classList.add('active');
            }
        }
    }
}


/**
 * Calculates the offset based on the current reference value and triggers data loading.
 * 
 * This function updates the `offset` by computing it from the `reference` variable 
 * and the predefined `limit`. After updating the offset, it calls `loadData()` 
 * to fetch and display the relevant data.
 */
function pageLoading(){
    offset = (reference - 1) * limit;
    loadData();
}


/**
 * Handles pagination button clicks and updates the displayed data accordingly.
 * 
 * This function updates the `reference` based on the clicked button's text. 
 * It removes the 'active' class from all pagination buttons to reset the highlighting.
 * Then, it calls `buttonPageChange(reference)` to update the pagination numbers 
 * and `pageLoading()` to fetch and display the corresponding data. 
 * Finally, it highlights the clicked button by adding the 'active' class.
 * 
 * @param {Event} event - The click event triggered by a pagination button.
 */
function firstAndLastPage(event){
    buttonName = event.target.innerText;
    // Remove active class from all pagination buttons
    document.querySelectorAll('.pagination .page-item').forEach(item => {
        item.classList.remove('active');
    });

    buttonPageChange(buttonName);
    pageLoading();
    // Highlight the clicked button
    textElement.parentElement.classList.add('active');
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
        if (Number(document.getElementById("pg-1-btn").innerText) != 1){
            buttonPageChange(buttonId);
            reference = reference - 1;
            pageLoading();
        } 
        pageHighlightChecker(textElement, reference);
        document.getElementById('prev-btn').parentElement.classList.toggle('disabled', document.getElementById("pg-1-btn").innerText === '1');
    } else if (buttonId === 'next-btn') {
        if (Number(document.getElementById("pg-3-btn").innerText) != total){
            buttonPageChange(buttonId);
            //Updating the reference value each time the next button is clicked
            reference = reference + 1;
            pageLoading();
        }
        pageHighlightChecker(textElement, reference);
        document.getElementById('next-btn').parentElement.classList.toggle('disabled', document.getElementById("pg-3-btn").innerText == total);
    } else {
        textElement = document.getElementById(`${buttonId}`);
        reference = Number(textElement.innerText);
        if (reference != total){
            if (reference == (total-1) && Number(document.getElementById("pg-3-btn").innerText) == (total-1)){
                buttonPageChange('next-btn');
                console.log(reference);
                textElement = document.getElementById("pg-2-btn");
            }
            else if ( Number(buttonId.split('-')[1]) == 3  && Number(document.getElementById("pg-3-btn").innerText) != total){ 
                buttonPageChange(buttonId);
                textElement = document.getElementById("pg-1-btn");
            }
            else if (Number(buttonId.split('-')[1]) == 2 && Number(document.getElementById("pg-3-btn").innerText) != total ){
                // console.log(document.getElementById("pg-3-btn").innerText);
                buttonPageChange('next-btn');
                textElement = document.getElementById("pg-1-btn");
            } 
        }
        pageLoading();

        // Highlight the clicked button
        pageHighlightChecker(textElement, reference);
        // textElement.parentElement.classList.add('active');
    }
}


// Attach the event listener to all the page buttons dynamically
document.querySelectorAll('.page-link').forEach(button => {
    button.addEventListener('click', handleButtonClick);
});

document.querySelectorAll('.btn.btn-danger').forEach(button => {
    button.addEventListener('click', firstAndLastPage);
});

fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`)
.then((response) => response.json())
.then((data)=>{
    pokemonTable(data.results);
    total = Math.ceil(data.count/limit);
    textElement = document.getElementById("pg-1-btn")
    reference = Number(textElement.innerText);
    pageHighlightChecker(textElement, reference);
    document.getElementById('next-btn').parentElement.classList.toggle('disabled', document.getElementById("pg-3-btn").innerText == total);
})