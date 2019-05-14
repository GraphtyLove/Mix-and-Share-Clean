/***************************************************************
 **                  API Custom Vision 	                      **
 ***************************************************************/

// Variable that contain the anwer of the API (as an object)
let answerOfTheApi;
console.log("open");
// Call of the API
$("#uploadForm").submit(function(e) {
	e.preventDefault();
	let formData = new FormData(this);
	console.log("test 1");
	$.ajax({
		url: "/upload",
		data: formData,
		method: "POST",
		processData: false,
		contentType: false,
		cache: false
	}).done(function(data) {
		let json = JSON.parse(data);
		let url = json.url;
		console.log("test 2");
		$.ajax({
			url:
				"https://southcentralus.api.cognitive.microsoft.com/customvision/v3.0/Prediction/027982a2-369c-4e04-a5a0-496e43a8f720/detect/iterations/Iteration14/url/",
			beforeSend: function(xhrObj) {
				// Request headers
				xhrObj.setRequestHeader("Content-Type", "application/json");
				xhrObj.setRequestHeader(
					"Prediction-key",
					"86154571a69d4431a8874eda8abaf33f"
				);
			},
			type: "POST",
			dataType: "json",
			processData: false,
			// Request body
			data: JSON.stringify({
				url: url
			})
		})
			.done(function(data) {
				answerOfTheApi = data;
				console.log("API success:");
				console.log(answerOfTheApi);
				showAnswer();
			})
			.fail(function(err) {
				console.log(`API fail: ${err}`);
				textToDisplay = "Nous n'avons pas détecté de bouteilles. Veuillez réessayer.";
				let answerDiv = document.createElement("p");
				answerDiv.classList.add("textBottle");
				let answerText = document.createTextNode(textToDisplay);
				answerDiv.appendChild(answerText);
				document.getElementById("anwerOfApiDiv").appendChild(answerDiv);
			});
	});
});

// Function that display the anwer of the API on the webpage
// It also display cocktails depending of the alcohol avalaible
let showAnswer = () => {
	// --- number of the bottle we got from the API ---
	let tequila = 0;
	let vodka = 0;
	let rhum = 0;

	// Add bottles of each alcohol in his variable if there is more than 25% of precision
	for (let i = 0; i < answerOfTheApi.predictions.length; i++) {
		if (
			answerOfTheApi.predictions[i].tagName === "vodka" &&
			answerOfTheApi.predictions[i].probability > 0.25
		) {
			vodka++;
			console.log(vodka);
		}
		if (
			answerOfTheApi.predictions[i].tagName === "rhum" &&
			answerOfTheApi.predictions[i].probability > 0.25
		) {
			rhum++;
			console.log(rhum);
		}
		if (
			answerOfTheApi.predictions[i].tagName === "tequila" &&
			answerOfTheApi.predictions[i].probability > 0.25
		) {
			tequila++;
			console.log(tequila);
		}
	}

	// Set the string to append to the div we will add when we have the anwer of the API
	let textToDisplay = "Vous avez: ";

	if (vodka > 0) {
		textToDisplay += `${vodka} bouteille(s) de vodka`;
	}
	if (rhum > 0) {
		textToDisplay += `${rhum} bouteille(s) de rhum`;
	}
	if (tequila > 0) {
		textToDisplay += `${tequila} bouteille(s) de tequila`;
	}
	if (rhum === 0 && vodka === 0 && tequila === 0) {
		textToDisplay =
			"Nous n'avons pas détecté de bouteilles. Veuillez réessayer.";
	}

	// Create the div we will add when we have the anwer of the API
	if (answerOfTheApi) {
		let answerDiv = document.createElement("p");
		answerDiv.classList.add("textBottle");
		let answerText = document.createTextNode(textToDisplay);
		answerDiv.appendChild(answerText);
		document.getElementById("anwerOfApiDiv").appendChild(answerDiv);

		if (tequila > 0) {
			let divtequila = document.createElement("p");
			divtequila.classList.add("textCocktail");
			let tequilaText = document.createTextNode("Tequila Sunrise");
			divtequila.appendChild(tequilaText);
			document.getElementById("listcoktails").appendChild(divtequila);
		}

		if (vodka > 0) {
			let divVodka = document.createElement("p");
			divVodka.classList.add("textCocktail");
			let vodkaText = document.createTextNode("Bloody Merry");
			divVodka.appendChild(vodkaText);
			document.getElementById("listcoktails").appendChild(divVodka);
		}

		if (rhum > 0) {
			let divRhum = document.createElement("p");
			divRhum.classList.add("textCocktail");
			let rhumText = document.createTextNode("Grocq");
			divRhum.appendChild(rhumText);
			document.getElementById("listcoktails").appendChild(divRhum);
		}
	}
};
