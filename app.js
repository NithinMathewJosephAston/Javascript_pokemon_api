let offset = 0;
const limit = 10;
// const interval = 10;

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


function pokemonTable(Pokedex){
    const tableBody = document.getElementById('pokemon-table-body');
    tableBody.innerHTML = '';
    // console.log(Pokedex);
    Pokedex.forEach((pokemon, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
        <td scope="row" style="text-align: center;">${offset + index + 1}</td>
        <td>${pokemon.name}</td>
        <td><a href="${pokemon.url}" target="_blank">View Details</a></td>
        `;
        tableBody.appendChild(row);
    });
}

async function loadData() {
    const data = await pokemonFetch(offset);
// console.log(data);
    pokemonTable(data.results);
    document.getElementById('prev-btn').disabled = offset === 0;
    document.getElementById('next-btn').disabled = !data.next;
}

document.getElementById('prev-btn').addEventListener('click', () => {
  if (offset >= limit) {
    offset -= limit;
    loadData();
  }
});

document.getElementById('pg-1-btn').addEventListener('click', () => {
    offset += limit;
    loadData();
});

document.getElementById('pg-2-btn').addEventListener('click', () => {
    offset += limit;
    loadData();
});

document.getElementById('pg-3-btn').addEventListener('click', () => {
    offset += limit;
    loadData();
});

document.getElementById('next-btn').addEventListener('click', () => {
  offset += limit;
  loadData();
});


loadData();