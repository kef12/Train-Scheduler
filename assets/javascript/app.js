$(document).ready(function() {

	//Initialize Firebase

  	var config = {
		apiKey: "AIzaSyCLcHyQUA4jnJ2wFpEz2sMJojMlaHqU4qc",
		authDomain: "train-scheduler-app-b9631.firebaseapp.com",
		databaseURL: "https://train-scheduler-app-b9631.firebaseio.com",
		projectId: "train-scheduler-app-b9631",
		storageBucket: "train-scheduler-app-b9631.appspot.com",
		messagingSenderId: "671323676468"
  	};

	firebase.initializeApp(config);

	var database = firebase.database();

	//Submit button collects and stores user input
	$(".submitInput").on("click", function (event) {

			var nameInput = $("#nameInput").val().trim();

			var destinationInput = $("#destInput").val().trim();

			var timeInput = $("#timeInput").val().trim();

			var frequencyInput = $("#freqInput").val().trim();

			//If/Else statement that validates input data
			if (nameInput != "" &&
				destinationInput != "" &&
				timeInput.length === 4 &&
				frequencyInput != "") {

					//Creates object for pushing input data
					database.ref().push({
						name: nameInput,
						destination: destinationInput,
						time: timeInput,
						frequency: frequencyInput,
					});

			} else {
				alert("Please enter valid train data");
				$("input").val("");
				return false;
			}

			$("input").val("");

	});
	
	//Firebase watcher 
	database.ref().on("child_added", function (childSnapshot) {
	

		var name = childSnapshot.val().name;
		var destination = childSnapshot.val().destination;
		var time = childSnapshot.val().time;
		var frequency = childSnapshot.val().frequency;

		//Time Formatting
		//This required a LOT of googling to figure out (haha)
		var frequency = parseInt(frequency);
		var currentTime = moment();

		//console.log("Current time: " + moment().format("HHmm"));

		var dateConvert = moment(childSnapshot.val().time, "HHmm").subtract(1, "years");

		//console.log("DATE CONVERTED: " + dateConvert);

		var trainTime = moment(dateConvert).format("HHmm");

		//console.log("Train time : " + trainTime);

		//Difference bw the times
		var timeConvert = moment(trainTime, "HHmm").subtract(1, "years");
		var timeDifference = moment().diff(moment(timeConvert), "minutes");

		//console.log("Difference in time: " + timeDifference);

		//Remainder
		var timeRemaining = timeDifference % frequency;

		//console.log("Time remaining: " + timeRemaining);

		//Time until next train
		var timeAway = frequency - timeRemaining;

		//console.log("Minutes until next train: " + timeAway);

		//Next train arrival
		var nextArrival = moment().add(timeAway, "minutes");

		var arrivalDisplay = moment(nextArrival).format("HHmm");

	//Change the HTML to reflect
	$("#boardText").append(
		"<tr><td id='nameDisplay'>" + childSnapshot.val().name + 
		"<td id='destinationDisplay'>" + childSnapshot.val().destination + 
		"<td id='frequencyDisplay'>" + childSnapshot.val().frequency +
		"<td id='arrivalDisplay'>" + arrivalDisplay + 
		"<td id='awayDisplay'>" + timeAway + " minutes until arrival" + "</td></tr>");

	});

	//Reset
	$(".resetInput").on("click", function(event){
    	location.reload();
	});
});