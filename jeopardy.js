/*
### **Requirements**

- The game board should be 6 categories across, 5 question down, displayed in a table. Above this should be a header row with the name of each category.
- At the start of the game, you should randomly pick 6 categories from the jService API. For each category, you should randomly select 5 questions for that category.
- Initially, the board should show with **?** on each spot on the board (on the real TV show, it shows dollar amount, but we won’t implement this).
- When the user clicks on a clue **?**, it should replace that with the question text.
- When the user clicks on a visible question on the board, it should change to the answer (if they click on a visible answer, nothing should happen)
- When the user clicks the “Restart” button at the bottom of the page, it should load new categories and questions.

We’ve provided an HTML file and CSS for the application (you shouldn’t change the HTML file; if you want to tweak any CSS things, feel free to).

We’ve also provided a starter JS file with function definitions. Implement these functions to meet the required functionality.




In order to fetch the correct data you will be using an external **API**. The "endpoint" is [https://projects.springboard.com/jeopardy/api](https://projects.springboard.com/jeopardy/api/categories?count=10) .

We will need two following subsequent endpoints:

1. **GET** "https://projects.springboard.com/jeopardy/api/categories?count=[integer]"
2. **GET** "[https://projects.springboard.com/jeopardy/api/categories?id=[integer]]
(https://projects.springboard.com/jeopardy/api/categories?id=[integer])"

Now that you know how to retrieve all available categories, think about how you can retrieve questions in a specific category:

To review, the format for the URL is the following:

**GET** "[https://projects.springboard.com/jeopardy/api/category?id=[**integer**](https://rithm-jeopardy.herokuapp.com/api/category?id=[**integer**)]"

*/




// categories is the main data structure for the app; it looks like this:

//  [
//    { title: "Math",
//      clues: [
//        {question: "2+2", answer: 4, showing: null},
//        {question: "1+1", answer: 2, showing: null}
//        ...
//      ],
//    },
//    { title: "Literature",
//      clues: [
//        {question: "Hamlet Author", answer: "Shakespeare", showing: null},
//        {question: "Bell Jar Author", answer: "Plath", showing: null},
//        ...
//      ],
//    },
//    ...
//  ]

let categories = [];
const NUM_CATEGORIES = 6;
const NUM_QUESTIONS_PER_CAT = 5;

/** Get NUM_CATEGORIES random category from API.
*
* Returns array of category ids
*/

async function getCategoryIds() {
    const response = await axios.get('https://projects.springboard.com/jeopardy/api/categories?count=20');
    const categoryIds = new Set();
    // console.log(response);
    
    while (categoryIds.size < NUM_CATEGORIES && categoryIds.size < response.data.length) {
        let r = Math.floor(Math.random() * response.data.length);
        categoryIds.add(response.data[r].id);
    }
    
    // console.log(categoryIds);
    return categoryIds;
}

/** Return object with data about a category:
*
*  Returns { title: "Math", clues: clue-array }
*
* Where clue-array is:
*   [
*      {question: "Hamlet Author", answer: "Shakespeare", showing: null},
*      {question: "Bell Jar Author", answer: "Plath", showing: null},
*      ...
*   ]
*/

async function getCategory(catId) {
    const response = await axios.get('https://rithm-jeopardy.herokuapp.com/api/category?id=' + catId);
    const clues = [];
    const categoryData = {};
    
    // console.log(response);
    
    categoryData.title = response.data.title;
    categoryData.clues = response.data.clues.map((clue) => {
        return {
            answer: clue.answer,
            question: clue.question,
            value: clue.value,
            showing: null
        };
    });
    
    // console.log(categoryData);
    
    return categoryData;
}

/** Fill the HTML table#jeopardy with the categories & cells for questions.
*
* - The <thead> should be filled w/a <tr>, and a <td> for each category
* - The <tbody> should be filled w/NUM_QUESTIONS_PER_CAT <tr>s,
*   each with a question for each category in a <td>
*   (initally, just show a "?" where the question/answer would go.)
*/

async function fillTable() {
    document.getElementById('board').innerHTML = '';
    let html = '<table><thead><tr>';
    
    for (category of categories) {
        html += '<td>' + category.title + '</td>';
    }
    html += '</tr></thead><tbody id="table-body"></tbody></table>';
    document.getElementById('board').innerHTML = html;
    let tbody = document.getElementById('table-body');
    
    for (row = 0; row < NUM_QUESTIONS_PER_CAT; row++) {
        let tr = tbody.appendChild(document.createElement('tr'));
        c = 0;
        for (category of categories) {
            let td = document.createElement('td');
            td.setAttribute('data-category', c);
            td.setAttribute('data-clue', row);
            td.innerHTML = '?';
            td.addEventListener('click', handleClick);
            tr.appendChild(td);
            c++;
        }
    }
    
}

/** Handle clicking on a clue: show the question or answer.
*
* Uses .showing property on clue to determine what to show:
* - if currently null, show question & set .showing to "question"
* - if currently "question", show answer & set .showing to "answer"
* - if currently "answer", ignore click
* */

function handleClick(e) {
    const clue = categories[e.target.dataset.category]
    .clues[e.target.dataset.clue];

    // check state
    switch (clue.showing) {
        case 'question':
            e.target.innerHTML = clue.answer;
            clue.showing = 'answer';
            break;
        case 'answer':
            break;
        default: // null
            e.target.innerHTML = clue.question;
            clue.showing = 'question';
    }

}

/** Wipe the current Jeopardy board, show the loading spinner,
* and update the button used to fetch data.
*/

function showLoadingView() {
    document.getElementById('board').innerHTML = '';
    document.getElementById('start-game').innerHTML = 'Loading...';
    document.getElementById('start-game').classList.add('loading');
    document.getElementById('loading-icon').classList.remove('hidden');
}

/** Remove the loading spinner and update the button used to fetch data. */

function hideLoadingView() {
    document.getElementById('start-game').innerHTML = 'Restart';
    document.getElementById('start-game').classList.remove('loading');
    document.getElementById('loading-icon').classList.add('hidden');
}

/** Start game:
*
* - get random category Ids
* - get data for each category
* - create HTML table
* */

async function setupAndStart() {
    categories = []
    const _categories = await getCategoryIds();
    for (c of _categories) {
        categories.push(await getCategory(c));
    }
    console.log(categories);
}

/** On click of start / restart button, set up game. */

// TODO

/** On page load, add event handler for clicking clues */

// TODO/

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('start-game').addEventListener('click', async () => {
        showLoadingView();
        await setupAndStart();
        hideLoadingView();
        fillTable();
    });
});
