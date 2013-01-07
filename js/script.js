$(document).ready(function() {
	
	var getBill = function () {

		var searchTerm = $('#term').val();

		$("#loading").removeClass("hide");

		$.getJSON("http://openstates.org/api/v1/bills/?q=" + searchTerm + "&state=ut&apikey=c13dee9099be4512a8bca6ad4f94c4aa&callback=?", function(json) {

			if (json.length !== 0) {

				for (var i = 0; i < json.length; i++) {
					if (i === 0) {
						$('#table').append('<thead id="table2"><tr><th>#</th><th>title</th><th>bill Id</th><th>created</th><th>subjects</th></tr></thead>');
					} else {
						$('#table2').append('<tr><td>' + i + '</td><td>' + JSON.stringify(json[i].title) + '</td><td>' + JSON.stringify(json[i].bill_id) +'</td>' + '</th><td>' + JSON.stringify(json[i].created_at) + '</th><td>' + JSON.stringify(json[i].subjects) +'<td></tr>');
					}

				}
			} else {
				$("#table").append('<h2 class="loading">We\'re afraid nothing was found for that search. Try again.');
			}
		});

		$("#loading").addClass("hide");
	};

	$('#search').click(getBill);
	$('#term').keyup(function(event){
		if(event.keyCode == 13){
			getBill();
    }
	});

});
