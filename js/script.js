$(document).ready(function() {

	$('#term').typeahead({
		source: function (query, process) {
			options = [];
			var data = $.getJSON("http://openstates.org/api/v1/bills/?state=ut&fields=first_name&apikey=c13dee9099be4512a8bca6ad4f94c4aa&callback=?");
			console.log(data);
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
