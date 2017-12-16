$(document).ready(function () {

	$("#save-csv").click(function() {

		$.post("Include/OneToManyData.php", { 'kit_num': 'T628654', 'cm_limit': '10', 'offset': '0', 'limit': '10000', 'group': 'A' }, function(data) {

      if (data.Status == "Success") {
        json2csv.convert(data.Data,"T628654",true);
      }

	  }, "json")
		.fail(function(jqXHR, textStatus, error) {
			alert( "AJAX error: " + error);
		})

		return false;
	});

});
