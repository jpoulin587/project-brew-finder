
/* establish the elements like this

let submitButton = document.getElementById("submit-button");
*/

/* // from trivia quiz, adapt to date from the array to the dynamically create the list of breweries.

function populateQuestion () {
    let currentQuestion = questionArray[questionIndex]
    questionText.innerText = currentQuestion.quest;
    currentQuestion.choices.forEach(function(choice, i){
        //console.log(questionIndex + "questionIndex")
        //console.log(i);
        //console.log(choice);
        let choiceButton = document.createElement("button");  
        choiceButton.textContent = choice; 
        choiceButton.onclick = questionClick;
        answerList.appendChild(choiceButton);
    })

}
*/

//declare global variables
let cityName = $('#city-name');
let brewName = $('#brew-name');
let brewResults = $("#brew-results");
let searchInput;
let userStartingNumber = document.getElementById("starting-number");
let userStartingStreet = document.getElementById("starting-street");
let userStartingStreetType = document.getElementById("street-type");
let userStartingCity = document.getElementById("starting-city");
let userStartingState = document.getElementById("starting-state");
let dataBrew;
let brewStreet;
let brewCity;
let brewAddress;
let userAddress;



function getBrewery() {
    // DONE add if statement to trigger alert if the user does not enter a city
    if (searchInput == "") {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Empty input!  Please enter a city',
            footer: '',
        })
        return;
    }

    fetch('https://api.openbrewerydb.org/breweries?by_type=brewpub&by_city=' + searchInput,)
        .then(function (response) {
            return response.json();
        })
        .then(function (dataBrew) {
            brewResults.empty();
            console.log(dataBrew);
            console.log('Brewery list \n----------');
            for (let i = 0; i < dataBrew.length; i++) {
                console.log("name " + dataBrew[i].name);
                console.log(dataBrew[i].brewery_type);
                console.log(dataBrew[i].street);
                console.log(dataBrew[i].city);
                console.log(dataBrew[i].latitude);
                console.log(dataBrew[i].longitude);

                let card = document.createElement('div');
                let cardBrewName = document.createElement('h4');
                let cardBrewStreet = document.createElement('p');
                let cardBrewCity = document.createElement('p');
                let triggerDirections = document.createElement('button');
                triggerDirections.setAttribute('data-brew', JSON.stringify(dataBrew[i])); // this adds the brewery info to each button. 


                cardBrewName.innerText = dataBrew[i].name;
                cardBrewStreet.innerText = dataBrew[i].street;
                cardBrewCity.innerText = dataBrew[i].city;
                triggerDirections.innerText = "get directions";

                card.append(cardBrewName);
                card.append(cardBrewStreet);
                card.append(cardBrewCity);
                card.append(triggerDirections);
                brewResults.append(card);

            }
        });


};

//TODO The next part is to get the directions to the pub.  Steps below.
//DONE   Create a "get directions button" Make a button on the search 
//TODO Populate the directions.


// blurring or hiding landing page image and showing brewery list
var subBtnEl = document.getElementById("subBtn")

subBtnEl.addEventListener("click", () => {
    hideLandingImg();
    showBreweryUserLocation();
    searchCityForm(); //get the form data
    getBrewery(); //runs the api call to openbrewery 
})

//this captures the data from the brewery city search form.
function searchCityForm(e) {
    searchInput = document.getElementById("city-name").value;
    console.log(searchInput);
};



//TODO put in the google fetch
$("#brew-results").on("click", function (event) {
    dataBrew = JSON.parse(event.target.getAttribute('data-brew'));
    brewStreet = dataBrew.street
    brewCity = dataBrew.city
    userStartingNumber = document.getElementById("starting-number").value;
    userStartingStreet = document.getElementById("starting-street").value;
    userStartingStreetType = document.getElementById("street-type").value;
    userStartingStreetType = document.getElementById("street-type").value;
    userStartingCity = document.getElementById("starting-city").value;
    userStartingState = document.getElementById("starting-state").value;
    //console.log(dataBrew);
    // console.log("brew street: " + brewStreet);
    // console.log("brew city " + brewCity);
    // console.log("user number " + userStartingNumber);
    brewAddress = brewStreet + " " + brewCity;
    //console.log(brewAddress);
    brewAddress = brewAddress.replace(/ /g, "+");
    console.log(brewAddress);
    userAddress = userStartingNumber + " " + userStartingStreet + " " + userStartingCity + " " + userStartingState;
    userAddress = userAddress.replace(/ /g, "+");
    console.log(userAddress);


    calcRoute(userAddress, brewAddress);

    var userFormEl = document.getElementById("user-input-form");
    userFormEl.setAttribute("style", "display: none");

    resBtnEl = document.getElementById("resBtn");
    resBtnEl.setAttribute("style", "visibility: visible");
});



function hideLandingImg() {
    var landingImgEl = document.querySelector(".back-img");
    landingImgEl.setAttribute("style", "display: none");
}
// The commented out function needs to run when the "Get Directions" button is clicked
function showBreweryUserLocation() {
    var userFormEl = document.getElementById("user-input-form");
    userFormEl.setAttribute("style", "display: block");

    var brewResultsEl = document.getElementById("brew-results");
    brewResultsEl.setAttribute("style", "visibility: visible");


}

//Reset Button on User Input Form/Alert Function
resBtnEl = document.getElementById("resBtn")

resBtn.addEventListener("click", function () {
    location.reload();
});

//  from https://developers.google.com/maps/documentation/javascript/directions


function calcRoute(start, end) {
    var directionsService = new google.maps.DirectionsService();
    var directionsRenderer = new google.maps.DirectionsRenderer();
    var request = {
        origin: start,
        destination: end,
        travelMode: 'DRIVING'
    };
    directionsService.route(request, function (result, status) {
        //console.log(result)

        //console.log("inside " + result.routes[0].legs[0].steps[0].instructions);
        let postSteps = result.routes[0].legs[0].steps;
        console.log(postSteps);
        //console.log("from variable " + postSteps[2].instructions);
        brewResults.empty();
        for (let i = 0; i < postSteps.length; i++) {
            //console.log("from loop " + postSteps[i].instructions);
            //console.log("from loop " + postSteps[i].distance.text)

            let postStepsClean = postSteps[i].instructions;
            postStepsClean = postStepsClean.replace(/[\/\\]/g, "");
            postStepsClean = postStepsClean.replace(/<b>/g, "");
            postStepsClean = postStepsClean.replace(/<div style="font-size:0.9em">/g, " ")
            postStepsClean = postStepsClean.replace(/<div>/g, " ")

            console.log(postStepsClean);

            let card = document.createElement('div');
            let cardSteps = document.createElement('p');

            cardSteps.innerText = postStepsClean + " for " + postSteps[i].distance.text;

            card.append(cardSteps);
            brewResults.append(card);
        }

    });


}

