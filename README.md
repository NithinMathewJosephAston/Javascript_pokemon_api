# Javascript Pokemon API

Pokedex UI Build, use an online-accessible API ([pokeapi](https://pokeapi.co/)) and create a page that requests this information and visualises it. Start with a table that displays the information received about each Pokemon and uses pagination to show only 50 records at a time (`hint`: Example GET request uses a URL like https://pokeapi.co/api/v2/pokemon/?limit=50&offset=50 to view the second set of 50 Pokemons). Open the URL to see the data. Use pagination component in addition to a table to visualise the data. Use Javascript to update the table when receiving new data from the api 

> Logic: `for every record I receive I'll need to add this HTML for a new table row to the table element`

## Detailed Overview
The outcome will be a table with pagination to view Pokemons (e.g. view 50 at a time). The first part is to use Bootstrap, Javascript and HTML to fetch the first set of pokemon (e.g. limit=50, offset=0 for first 50 pokemon) and display these nicely.

- Perform the fetch using Javascript’s fetch API
- Cast the results to JSON
- Store this as a standard Javascript variable
- Create a function that, given the Javascript variable just created, loops over each Pokemon in the list and adds a new record in the display table. (`hint`: This function should also remove whatever is currently in the table). Need to add HTML to the table element using Javascript for this.
- Create a second function that, given a string (which will either be "next" or "previous"), gets the next/previous URL from the current JSON results and uses this to perform a fetch and update the Javascript variable as before, then runs the 'update display' function above.
- Add the pagination buttons, with an onclick of the function created above with either "next" or "previous" passed, depending on the button. This will fire the "get the new data, store it as JSON and update the display"
