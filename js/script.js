$(document).ready(function() {
	
	// This is all @geuis ---- lifesaver! 
	var autocomplete = $('#term').typeahead()
        .on('keyup', function(ev){
 
            ev.stopPropagation();
            ev.preventDefault();
 
            //filter out up/down, tab, enter, and escape keys
            if( $.inArray(ev.keyCode,[40,38,9,13,27]) === -1 ){
 
                var self = $(this);
                
                //set typeahead source to empty
                self.data('typeahead').source = [];
 
                //active used so we aren't triggering duplicate keyup events
                if( !self.data('active') && self.val().length > 0){
 
                    self.data('active', true);
 
                    //Do data request. Insert your own API logic here.
                    $.getJSON("http://openstates.org/api/v1/bills/?state=ut&apikey=c13dee9099be4512a8bca6ad4f94c4aa&callback=?",{
                        q: $(this).val()
                    }, function(data) {
 
                        //set this to true when your callback executes
                        self.data('active',true);
 
                        //Filter out your own parameters. Populate them into an array, since this is what typeahead's source requires
                        var arr = [],
                            i=data.length;
                        while(i--){
                            arr[i] = data[i].title
                        }
 
                        //set your results into the typehead's source
                        self.data('typeahead').source = arr;
 
                        //trigger keyup on the typeahead to make it search
                        self.trigger('keyup');
 
                        //All done, set to false to prepare for the next remote query.
                        self.data('active', false);
 
                    });
 
                }
            }
        });
	
	var getBill = function () {

		var searchTerm = $('#term').val();

		$("#loading").removeClass("hide");
		$("#table2").remove();
		$("#counter h3").html("");
		$(".table").html("");

		$.getJSON("http://openstates.org/api/v1/bills/?q=" + searchTerm + "&state=ut&apikey=c13dee9099be4512a8bca6ad4f94c4aa&callback=?", function(json) {

			if (json.length !== 0) {

				for (var i = 0; i < json.length; i++) {
					if (i === 0) {
						$('#table').append('<thead id="table2"><tr><th>#</th><th>title</th><th>bill Id</th><th>created</th><th>subjects</th></tr></thead>');
					} else {
						$('#table2').append('<tr><td>' + i + '</td><td>' + JSON.parse(JSON.stringify(json[i].title)) + '</td><td>' + JSON.parse(JSON.stringify(json[i].bill_id)) +'</td>' + '</th><td>' + JSON.parse(JSON.stringify(json[i].created_at)) + '</th><td>' + JSON.parse(JSON.stringify(json[i].subjects)) +'<td></tr>');
					}

					$("#counter h3").html("Found: " + i + " results.");

				}
			} else {
				$(".table").html('<h2 class="loading">We\'re afraid nothing was found for that search. Try again.');
			}
		});

	};

	$('#search').click(getBill);
	$('#term').keyup(function(event){
		if(event.keyCode == 13){
			getBill();
    }
	});

});
