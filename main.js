

// http://api.jquery.com/jquery.getjson/#jsonp
var quoteUrl = "http://api.forismatic.com/api/1.0/?method=getQuote&lang=en&format=jsonp&jsonp=?";
//var problemQuoteUrl = "http://api.forismatic.com/api/1.0/?method=getQuote&lang=en&format=jsonp&jsonp=?";


$( document ).ready(function() {
    
    getJSON();

    $('#quoteGETJSON').click(function(){
		  console.log(" ------------------------------------------------------ function -> getJSON button------------------------------------------ ");
		  //console.log(author);
		  $( "#con" ).fadeTo(500, 0);
		  
		  //use timeout function whilst the container fades
		  setTimeout(function(){
		  	//
		  	$("#tweet_inner").empty();
		  	$("#wikiImg").attr("src","");
		  	$("#tweet_inner").css({"opacity":"0"});
		  	getJSON();
		  }, 500);
	});
});

function getJSON(){
   
    $.ajax({
    dataType: "jsonp",
    url: quoteUrl,
    success: update,
    error: function(){
	    	console.log("failure of getJSON api");
	    	//try again
	    	getJSON();
	    }
  });
};

function update(response) {

		var quoteAuthor = response['quoteAuthor'].trim().replace(/ /g,"_");
	

	 	response['quoteAuthor']; //$('#response').html(JSON.stringify(response));
	   	$('#quote').html('"' + response["quoteText"] + '"');
		$('#author').html(response["quoteAuthor"]);

		var quoteAuthor = response["quoteAuthor"];

		getWiki(quoteAuthor, '"' +response["quoteText"] +'"');
		

}//end of update

function handleErr(jqxhr, textStatus, err) {
  console.log("Request Failed: " + textStatus + ", " + err);
}


function getWiki(author,quote){

	
	var wikiUrl = "https://en.wikipedia.org/w/api.php?action=query&format=json&redirects&titles="+author+"&prop=pageimages&pithumbsize=300&callback=?";
	//var wikiUrl = "https://en.wikipedia.org/w/api.php?action=query&format=json&redirects&titles=Dominik_Sliver&prop=pageimages&pithumbsize=300&callback=?"


	$.ajax( {
	    url: wikiUrl,
	     data: {
        format: 'json'
   		 },
	    dataType: 'json',
	    type: 'GET',
	    headers: { 'Api-User-Agent': 'Example/1.0' },
	    success: function(data) {
	       
	    	console.log("wiki api success");

				function searchObj(obj,label,limit){

					console.log(" ****** searchObj called ****** ");
					//console.log(author);
					console.log(wikiUrl);
					console.log(obj);
					console.log("length of obj : " + objLength(obj));
					var result = [];
					var counter = 0;

					for ( var key in obj){

						if(limit===0){return "limit hit";}
						limit--;
			
						var val = obj[key];
					

						 if ((val && typeof val === 'object') || typeof val === 'function' || typeof val === 'unknown') {
						   
						     var result = searchObj(val, label, limit); // recursion step
						      // if return = a limit variable 
						     if(result=== "finished"){ return "finished";}
						     if(result[2] ==="finished"){ return result;}
						     if (result[0]==="found"){ 					     
						     	result.push("finished");
						     	return result;}
						     if (result === "limit hit"){						     
						     	return "finished";
						     }else
						     if (typeof result[2] == 'number'){
						     	var limit = limit - (result[2])			     
						     }
					    }else	if(key=== label){ // found the thing	    
					    	var found = ["found"][val];
					    	return ["found", val];
					   	 
						}
						counter++;
						if(counter === objLength(obj)){
							return ["not found","",counter];
						}
					}
						// return ["found/not found/ finished"][val][counter]

				}// end of searchObj()

			function objLength(obj){
			  var i=0;
			  for (var x in obj){
			    if(obj.hasOwnProperty(x)){
			      i++;
			    }
			  } 
			  return i;
			}



			//console.log(obj);
			var result = searchObj(data, "source", 500);
			console.log(" result = " + result);



			if(result === "finished" || result[0] === 'not found'){ //can not display the image

				var removedLeft = $( ".left_column" ).hide();
				$( ".right_column" ).css({"width":"90%", "right":"5%"});
				//wait to launch the box
				twitter(quote, author);			
				fadeInCon();
				return "img not found";

			}else if(result[0]=== "found"){ // img url is returned

				console.log("value is found it is -> " + result[1]);
				//wait to launch the box
				var removedLeft = $( ".left_column" ).show();
				$(".right_column").css({"width":"70%","right":"0%"});
				$("#wikiImg").attr("src",result[1]);
				twitter(quote, author);

				fadeInCon();
				return "found";


			}

	
	},  //end of success

	error: function(){
	    	console.log("failure of getWiki api");
	    }
	
	}); // end of whatsit
	
	
}; // function getWIki


			function twitter(quote, author){
				


					!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+'://platform.twitter.com/widgets.js';fjs.parentNode.insertBefore(js,fjs);}}(document, 'script', 'twitter-wjs');

					

					twttr.ready(function (twttr) {
         
						//create button
					var twitterButton = document.createElement('a');
					twitterButton.setAttribute('href', 'https://twitter.com/share');

					twitterButton.setAttribute('class', 'twitter-share-button');
					twitterButton.setAttribute('style', '');
					if(author !==""){var authorProcessed = " - " + author;}else{var authorProcessed =author;}  
							
					twitterButton.setAttribute("data-text" ,quote + authorProcessed );
					twitterButton.setAttribute("data-via" ,"Random Quote App") ;
					twitterButton.setAttribute("data-size" ,"large") ;
					
				
				       

				        $("#tweet_inner").append(twitterButton).animate(
				        	{  opacity: 1 },
				        	2000,
				        	'swing'
								    // Animation complete.
						);


					
					   twttr.widgets.load(); //very important//very important

					

      				});
					
				

				}//end of twitter function
			

function imgDisplay(url){

	console.log("****** function imgDisplay ******");
	console.log("url = " + url);


}
function fadeInCon(){

setTimeout(function(){ 

	$( "#con" ).animate(  	{  opacity: 1 },  	1000, 'swing');

}, 350);

};