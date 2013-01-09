stuff = [];

$(document).ready(function() {
	
	$.getJSON("http://openstates.org/api/v1/bills/?state=ut&fields=title&apikey=c13dee9099be4512a8bca6ad4f94c4aa&callback=?", function (json) {
		stuff.push(json);
		$('#searchBox').removeClass("hide");
	});

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
                    $.grep(stuff, function() {
 
                        //set this to true when your callback executes
                        self.data('active',true);
 
                        //Filter out your own parameters. Populate them into an array, since this is what typeahead's source requires
 						
                        var arr = [],
                            i=stuff[0].length;
                        while(i--){
                            arr[i] = $.trim(stuff[0][i].title)
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
	
	var getBillInfo = function () {

		// check which radio button is pushed
		// 
		// then call the appropriate searchBills or getBill
		// 
		searchBills();

	};


	var searchBills = function () {
		
		var searchTerm = $('#term').val();
		$("#loading").removeClass("hide");
		$("#counter h3").html("");
		$(".table").html("");

		$.getJSON("http://openstates.org/api/v1/bills/?q=" + searchTerm + "&state=ut&apikey=c13dee9099be4512a8bca6ad4f94c4aa&callback=?", function(json) {

			if (json.length !== 0 && json[0].action_dates.length === 0) {
				for (var i = 0; i < json.length; i++) {
					if (i === 0) {
						$('#table').append('<thead id="table2"><tr><th>#</th><th>title</th><th>bill Id</th><th>created</th><th>subjects</th></tr></thead>');
					} else {
						$('#table').append('<tbody><tr id="test"><td>' + i + '</td><td>' + $.trim(JSON.parse(JSON.stringify(json[i].title))) + '</td><td>' + $.trim(JSON.parse(JSON.stringify(json[i].bill_id))) +'</td><td>' + $.trim(JSON.parse(JSON.stringify(json[i].session))) + '</td><td>' + $.trim(JSON.parse(JSON.stringify(json[i].subjects))) +'</td></tr></tbody>');
					}

					$("#counter h3").html("Found: " + i + " results.");
					$("#loading").addClass("hide");

				}
			} else if (json.length === 0) {
				$(".table").html('<h2 class="loading">We\'re afraid nothing was found for that search. Try again.');
				$("#loading").addClass("hide");
			} else  {
				console.log("call get unique bill");
			}
		});
	};


	// Radio functionality
	
	
	$("input[name='optionsRadios']").click(function () {
		if ($("input[name='optionsRadios']:checked").val() === "bill_id") {
			$("#session").removeClass("hide");
		} else{
			$("#session").addClass("hide");
		}
	});


	$('#search').click(getBillInfo);
	$('#term').keyup(function(event){
		if(event.keyCode == 13){
			getBillInfo();
    }
	});

});
