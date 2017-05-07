var config = {
    apiKey: "AIzaSyA_-5-CogOAOkNtTKFL8BbV4HU7trCgyt4",
    authDomain: "train-time-25999.firebaseapp.com",
    databaseURL: "https://train-time-25999.firebaseio.com",
    projectId: "train-time-25999",
    storageBucket: "train-time-25999.appspot.com",
    messagingSenderId: "518880047498"
};

firebase.initializeApp(config);

setInterval(updateMin, 60000);



var database = firebase.database();

var name = "";
var destination = "";
var firstTime = "";
var freq = "";
var minAway;
var snapVal = {};


$("#submitbtn").on("click", function(event) {
	event.preventDefault();
    name = $("#tName").val().trim();
    destination = $("#des").val().trim();
    firstTime = $("#fTime").val().trim();
    freq = $("#freq").val().trim();

    database.ref().push({
        dName: name,
        dDest: destination,
        dTime: firstTime,
        dFreq: freq

    });
    $(".form-control").val("");
});

function addData(dName, dDest, dTime, dFreq, key) {
	var m = moment(new Date());
	var minuteNow = (m.hour()*60) + m.minute();
	var dM = moment(dTime, "HH:mm");
	var minute1 = (dM.hour()*60) + dM.minute();

	var difMin = (minuteNow - minute1) % dFreq ;

	minAway = dFreq - difMin;
	var nextA = moment().add(minAway, "minutes").format("hh:mm");



    $("#table > tbody").append("<tr id=" + key + "><td>" + 
        dName + "</td><td>" + dDest + "</td><td>" + dFreq + "</td><td>" + nextA + 
        "</td><td>" + minAway + "</td><td><button class='d' key=" + 
        key + ">Del</button></td>");




};

function updateMin(){
    $('#table > tbody').empty();
    database.ref().on("value", function(snapshot){
        snapshot.forEach(function(snapshotChild){
            addData(snapVal.dName, snapVal.dDest, snapVal.dTime, snapVal.dFreq, snapshot.key);

        });
    });

};

$(document).on("click", ".d", function() {
        alert("hello");
        var key = $(this).attr("key");
        database.ref().child(key).remove();
        $("#" + key).empty();
    });


database.ref().on("child_added", function(snapshot) {

    snapVal = snapshot.val();

    addData(snapVal.dName, snapVal.dDest, snapVal.dTime, snapVal.dFreq, snapshot.key)

}, function(errorObject) {
    console.log("The read failed: " + errorObject.code);
});



