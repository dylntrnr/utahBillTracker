utTitle = [];

$(document).ready(function() {
	
	$.getJSON("http://openstates.org/api/v1/bills/?state=ut&fields=title&apikey=c13dee9099be4512a8bca6ad4f94c4aa&callback=?", function (json) {
		utTitle.push(json);
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
                    $.grep(utTitle, function() {
 
                        //set this to true when your callback executes
                        self.data('active',true);
 
                        //Filter out your own parameters. Populate them into an array, since this is what typeahead's source requires
 						
                        var arr = [],
                            i=utTitle[0].length;
                        while(i--){
                            arr[i] = $.trim(utTitle[0][i].title)
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
	var counter = 0;
	display = function (key, value) {
		if(typeof(value) == "object") {
			$.each(value, display);
		} else {
			$("#testing").append("<div class='row'><div class='span1 " + key +"' id=" + $.trim(key) + $.trim(counter) + "><strong>" + $.trim(key) + "</strong></div><div class='span9 offset1 " + key +"Result' id='K" + $.trim(key) + "'>" + $.trim(value) + "</div>");
		}
		counter += 1;
	};

	// Inserting new get bill function
	// 
	// _________________________________
	// 
	
	getBillFromTable = function (billid, sessionid) {
		var session = sessionid;
		var billId = billid;
		$("#loading").removeClass("hide");

		resetHtml();
		hashAndTitle(session, billId);
		var success = false;
		// Set a 5-second (or however long you want) timeout to check for errors
		setTimeout(function() {
			if (!success) {
				// Handle error accordingly
				$(".table").html('<h2 class="loading">By golly, nothing came up with that search. Try again.');
				$("#loading").addClass("hide");
			}
		}, 5000);

		$.getJSON("http://openstates.org/api/v1/bills/ut/" + session + "/" + billId +"?fields=bill_id,sponsors,title,chamber,actions.date,actions.actor,actions.action,sponsors.name,sponsors.type,votes.yes_count,votes.data,votes.chamber,votes.motion,votes.no_count,votes.type,sources,versions.url,versions.name,votes.passed&apikey=c13dee9099be4512a8bca6ad4f94c4aa&callback=?", function(json) {

			
			

			$.each(json, display);
			
			$("#loading").addClass("hide");
			
			success = true;
		});
	};


	// ENDing new get bill function
	// --------------------------

	// search for specific bill and get detailed information returned
	var getBill = function () {
		var session = $("#sessionInput").val();
		var billId = $("#term").val().toUpperCase();

		resetHtml();
		hashAndTitle(session, billId);
		var success = false;
		// Set a 5-second (or however long you want) timeout to check for errors
		setTimeout(function() {
			if (!success) {
				// Handle error accordingly
				$(".table").html('<h2 class="loading">By golly, nothing came up with that search. Try again.');
				$("#loading").addClass("hide");
			}
		}, 2000);

		$.getJSON("http://openstates.org/api/v1/bills/ut/" + session + "/" + billId +"?fields=bill_id,sponsors,title,chamber,actions.date,actions.actor,actions.action,sponsors.name,sponsors.type,votes.yes_count,votes.data,votes.chamber,votes.motion,votes.no_count,votes.type,sources,versions.url,versions.name,votes.passed&apikey=c13dee9099be4512a8bca6ad4f94c4aa&callback=?", function(json) {

			
			

			$.each(json, display);
			
			$("#loading").addClass("hide");
			
			success = true;
		});

	};

	// reset the html everything
	var resetHtml = function () {
		$("#loading").removeClass("hide");
		$("#counter h3").html("");
		$(".table").html("");
		$("#testing").html("");
		counter = 0;
	};

	var hashAndTitle = function (searchTerm, billId) {
		if(arguments.length === 2) {
			location.hash = (billId + '-' + searchTerm).replace(/ /g, '-');
			document.title = billId;
		} else {
			location.hash = searchTerm.replace(/ /g, '-');
			document.title = searchTerm;
		}
	};

	// search for non - specific bill
	var searchBills = function () {
		
		var searchTerm = $('#term').val();
		resetHtml();
		hashAndTitle(searchTerm);
		
		$.getJSON("http://openstates.org/api/v1/bills/?q=" + searchTerm + "&state=ut&apikey=c13dee9099be4512a8bca6ad4f94c4aa&callback=?", function(json) {

			

			$('#table').append('<thead id="table2"><tr></tr></thead><tbody><tr></tr></tbody>');

			if (json.length !== 0 && !json[0].hasOwnProperty("sponsors")) {
				for (var i = (json.length); i >= 0; i--) {
					if (i === json.length) {
						$('#table thead tr').append('<th>#</th><th>title</th><th>bill Id</th><th>session</th><th>subjects</th>');
					} else {
						$('#table tbody').append('<tr class="tablerow"><td><strong>' + i + '</strong></td><td class="tt">' + $.trim(json[i].title) + '</td><td id="billid">' + $.trim(json[i].bill_id) +'</td><td id="sessionid">' + $.trim(json[i].session) + '</td><td>' + $.trim(json[i].subjects) +'</td></tr>');
					}



				}
					$("#counter h3").html("Found: " + (json.length-1) + " results.");
					$("#loading").addClass("hide");

			} else if (json.length === 0) {
				$(".table").html('<h2 class="loading">By golly, nothing came up with that search. Try again.');
				$("#loading").addClass("hide");
			} else  {
				getBill();
			}
			$(".tablerow").hover(function () {
				$(this).css('cursor','pointer');
			}, function() {
				$(this).css('cursor','auto');
			});

			$(".tablerow").click(function () {
				var billid = $(this).children("#billid").text();
				var sessionid = $(this).children("#sessionid").text();

				getBillFromTable(billid, sessionid);

			});
		});

	};

	// check which radio button is selected and search appropriately
	var checkAndSearch = function () {
		if ($("input[name='optionsRadios']:checked").val() === "bill_id") {
			if($("#sessionInput").val() !== "") {
				if($("#term").val() !== "") {
					getBill();
				} else {
					alert("Please enter bill id like: HB 10 or HB 344");
				}
			} else {
				alert("Please enter session data like: 2012 or 20092012");
			}
		} else{
			searchBills();
		}
	};

	// Radio functionality
	
	$("input[name='optionsRadios']").click(function () {
		if ($("input[name='optionsRadios']:checked").val() === "bill_id") {
			$("#session").removeClass("hide");
			
		} else{
			$("#session").addClass("hide");
		}
	});

	// hitting search button / enter

	$('#search').click(checkAndSearch);
	$('#term').keyup(function(event){
		if(event.keyCode == 13){
			checkAndSearch();
		}
	});

	// history.pushState(
	// 	// date
	// 	// title
	// 	// url
	// 	'some date',
	// 	'My title'

	// );














	// for testing purposes --------
	// ------------------------
	// ---------------------

	var testingBill = function () {
		var session = "2011";
		var billId = "HB 10";
		$("#loading").removeClass("hide");

		resetHtml();

		$.getJSON("http://openstates.org/api/v1/bills/ut/" + session + "/" + billId +"?fields=bill_id,sponsors,title,chamber,actions.date,actions.actor,actions.action,sponsors.name,sponsors.type,votes.yes_count,votes.data,votes.chamber,votes.motion,votes.no_count,votes.type,sources,versions.url,versions.name,votes.passed&apikey=c13dee9099be4512a8bca6ad4f94c4aa&callback=?", function(json) {

			// $('#table').append('<thead id="table2"><tr></tr></thead><tbody><tr></tr></tbody>');

			$.each(json, displayTest);
			console.log(json);
			
			$("#loading").addClass("hide");
			
		});

	};

	displayTest = function (key, value) {
		if(typeof(value) == "object") {
			$.each(value, displayTest);
		} else {
			$("#testing").append("<div class='row'><div class='span1 " + key +"' id=" + $.trim(key) + $.trim(counter) + "><strong>" + $.trim(key) + "</strong></div><div class='span4 offset1' id=" + $.trim(counter) + $.trim(key) + ">" + $.trim(value) + "</div>");
		}
		counter += 1;
	};

	// searchBills();

	

});
