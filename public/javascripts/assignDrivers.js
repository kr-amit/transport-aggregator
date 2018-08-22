// Get the modal
var modal = document.getElementById('myModal');

// Get the button that opens the modal
var btn = document.getElementById("myBtn");

//get the <p> tag where text is diplayed
// var p= document.getElementByClassName("display");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// document.getElementByClassName("display").textContent="----------------";
// When the user clicks on the button, open the modal 

function retrieve(){
		var mongo=require('mongodb');
	var uri="mongodb:localhost://27017:demodb";
	
	mongo.connect(uri,function(err,db){
		if(err) {throw(err);}
		//console.log(db.collection("drivers").find({}));
		var data=db.collection("drivers").find({});
		console.log(data);
		return data;

	});


}


btn.onclick = function() {
	
	modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}



