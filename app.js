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
    $('#pokemon-table-body').empty();
    for (let index = 0; index < Pokedex.length; index++) {
        const pokemon = Pokedex[index];
        const row = document.createElement('tr');
        const image_png =  await pokemonFetch(pokemon.url)
        if (image_png.sprites.front_default){
            row.innerHTML = `
            <td scope="row" class="align-middle text-center custom-color font-medium">${"No."+String(offset + index + 1).padStart(3, '0')}</td>
            <td class="align-middle text-center custom-color font-medium">${pokemon.name}</td>
            <td class="pokemon-sprite">
                <a href="${pokemon.url}">
                ${image_png.sprites.front_default ? `<img src="${image_png.sprites.front_default}" alt="${pokemon.name}" width="150" height="150">`: ''}        
                </a>
            </td>
            `;
            $('#pokemon-table-body').append(row);
        }
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
    const data = await pokemonFetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}try`);
    await pokemonTable(data.results);

    is_first = document.getElementById("pg-1-btn").innerText === '1';
    $('#prev-btn').parent().toggleClass('disabled', is_first);
    is_last = document.getElementById("pg-3-btn").innerText == total;
    $('#next-btn').parent().toggleClass('disabled', is_last);
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
    highlightValue = String(highlightValue);
    if (currentVal !== undefined){
        for (let i=1; i<4; i++){
            if (document.getElementById(`pg-${i}-btn`).innerText == highlightValue){
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
    // buttonName = event.target.innerText;
    buttonName = $(event.target).text();
    // Remove active class from all pagination buttons
    $('.pagination .page-item').removeClass('active');

    buttonPageChange(buttonName);
    pageLoading();
    // Highlight the clicked button
    textElement.parentElement.classList.add('active');
    $('#pokemon-details').hide()
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
    $('.pagination .page-item').removeClass('active');

    // Handle different button clicks based on their ID
    if (buttonId === 'prev-btn') {
        if (Number(document.getElementById("pg-1-btn").innerText) != 1){
            buttonPageChange(buttonId);
            reference = reference - 1;
            pageLoading();
        } 
        pageHighlightChecker(textElement, reference);
        is_first = document.getElementById("pg-1-btn").innerText === '1';
        $('#prev-btn').parent().toggleClass('disabled', is_first);
    } else if (buttonId === 'next-btn') {
        if (Number(document.getElementById("pg-3-btn").innerText) != total){
            buttonPageChange(buttonId);
            //Updating the reference value each time the next button is clicked
            reference = reference + 1;
            pageLoading();
        }
        pageHighlightChecker(textElement, reference);
        is_last = document.getElementById("pg-3-btn").innerText == total;
        $('#next-btn').parent().toggleClass('disabled', is_last);
    } else {
        textElement = document.getElementById(`${buttonId}`);
        reference = Number($(textElement).text());
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
    }
    $('#pokemon-details').hide()
}


/**
 * Displays detailed information about a selected Pokémon in the detail card panel.
 * Fetches the Pokémon's data from the provided URL and populates the card with:
 * - Name
 * - Types (as badges)
 * - Image
 * - Height and Weight
 * - Moves (as badges)
 * - Abilities (as badges)
 *
 * @param {string} url - The API URL to fetch the Pokémon details from.
 */
async function showPokemonDetails(url) {
    const response = await fetch(url);
    const data = await response.json();

    $('#pokemon-name').text(data.name);

    // Badge Helper
    const createBadgeGroup = (items, label, bgClass) => {
        const container = $('<div></div>');
        if (label) {
            container.append($('<p></p>').addClass('card-text text-start').text(label));
        }
        items.slice(0, 8).forEach(item => {
            container.append($('<span></span>')
            .addClass(`badge rounded-pill ${bgClass} me-2 mb-2`)
            .text(item.toUpperCase())
            );
        });
        return container;
    };

    // Add Types
    const types = data.types.map(t => t.type.name);
    $('#pokemon-type').empty().append(createBadgeGroup(types, null, 'text-bg-light'));

    // Add Image
    $('#pokemon-image')
        .attr('src', data.sprites.front_default || '')
        .attr('alt', data.name);

    // Add Height & Weight
    $('#pokemon-stat').text(`HT ${data.height}\nWT ${data.weight} lbs.`);

    // Add Moves
    const moves = data.moves.map(m => m.move.name);
    $('#pokemon-moves').empty().append(createBadgeGroup(moves, "MOVES:", 'text-bg-danger'));

    // Add Abilities
    const abilities = data.abilities.map(a => a.ability.name);
    $('#pokemon-abilities').empty().append(createBadgeGroup(abilities, "ABILITIES:", 'text-bg-success'));

    // Show the card
    $('#pokemon-details').show();
}


function getRemInPixels(rem){
    return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
}

function updateFixedElementWidth() {
    const fixedEl = document.getElementById('pokemon-details');
    const column = document.getElementById('empty-column');

    if (window.innerWidth >= 992 && fixedEl && column) { // 992px = Bootstrap lg
      const colWidth = column.offsetWidth;
      fixedEl.style.width = (colWidth - getRemInPixels(4)) + 'px';
    } 
}

window.addEventListener('resize', updateFixedElementWidth);
window.addEventListener('load', updateFixedElementWidth);

// Attach the event listener to all the page buttons dynamically
$('.page-link').on('click', handleButtonClick);

$('.btn.btn-danger').on('click', firstAndLastPage);

fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`)
// fetch(``)
.then((response) => response.json())
.then((data)=>{
    pokemonTable(data.results);
    total = Math.ceil(data.count/limit);
    textElement = document.getElementById("pg-1-btn")
    reference = Number(textElement.innerText);
    pageHighlightChecker(textElement, reference);
    is_last = document.getElementById("pg-3-btn").innerText == total;
    $('#next-btn').parent().toggleClass('disabled', is_last);
})
.catch((error)=>{
    console.log(error);
    document.getElementById('pokemon-table').style.display = 'none';
    document.getElementById('pagination-container').classList.add('d-none');
    const errorDiv = document.getElementById('error-message');
        errorDiv.innerText = "Oops! Unable to load Pokémon. Please try again later.";
        errorDiv.style.display = 'block';
})


document.getElementById('pokemon-table-body').addEventListener('click', function(event) {
    if (event.target.tagName === 'IMG' || event.target.tagName === 'A') {
        event.preventDefault();
        const url = event.target.closest('a').href;
        showPokemonDetails(url);
    }
});


$('#toggle-info').on('click', function () {
    $('#pokemon-details').slideToggle('fast'); // or .fadeToggle('fast')
    $(this).toggleClass('fa-caret-up fa-caret-down');
  });