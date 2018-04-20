$(function(){
  addScript('https://rawgit.com/plaksiy/dna/master/src/js/json2csv.js');

  var csvBtn = $('<button type="button" class="btn btn-default btn-xs" data-toggle="button" id="save-csv">Save to csv</button>');
  (csvBtn).insertAfter($("#select-all"));

  var myKits = ['T080477', 'T198364', 'T270347', 'T289368', 'T399041', 'T418777', 'T628654', 'T843670', 'T915796'];

  var newDate = new Date().toISOString().slice(0,10).replace(/-/g , '');
  // var request = new Request('T628654',  '20', '0', '200', 'A' );

	$("#save-csv").click(function() {
    myKits.map( kit => { getMatches(new Request(kit,  '20', '0', '200', 'A' )); });
		return false;
	});

  function addScript( src ) {
    var s = document.createElement( 'script' );
    s.setAttribute( 'src', src );
    document.head.appendChild( s );
  }

  function download(content, fileName, contentType) {
      var a = document.createElement("a");
      var file = new Blob([content], {type: contentType});
      a.href = URL.createObjectURL(file);
      a.download = fileName;
      a.click();
  }

  function Request(kit_num, cm_limit, offset, limit, group) {
    this.kit_num = kit_num;
    this.cm_limit = cm_limit;
    this.offset = offset;
    this.limit = limit;
    this.group = group;
  }
 
 function getMatches(request) {
	  $.post("Include/OneToManyData.php", request, function(data) {

      if (data['Status'] == "Success") {
        console.log('Start ' + request.kit_num);
        var jsonData = JSON.stringify(data['Data']);
        // gedmatch-matches-20171120-A975174-7cm-0.json
        var fileName = 'gedmatch-matches-' + newDate + '-' + request.kit_num + '-' + request.cm_limit + 'cm-' + request.offset + '.json';
        
        download(jsonData, fileName, 'text/plain');
        console.log('Finish ' + request.kit_num);
      }
      
	  }, "json")
		.fail(function(jqXHR, textStatus, error) {
			alert( "AJAX error: " + error);
		});   
 }

});
