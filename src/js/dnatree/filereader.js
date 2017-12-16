(function (window) {

  var fileReader = {
    isAPIAvailable: function () {
      // Check for the various File API support.
      if (window.File && window.FileReader && window.FileList && window.Blob) {
        // Great success! All the File APIs are supported.
        return true;
      } else {
        // source: File API availability - http://caniuse.com/#feat=fileapi
        // source: <output> availability - http://html5doctor.com/the-output-element/
        document.writeln('The HTML5 APIs used in this form are only available in the following browsers:<br />');
        // 6.0 File API & 13.0 <output>
        document.writeln(' - Google Chrome: 13.0 or later<br />');
        // 3.6 File API & 6.0 <output>
        document.writeln(' - Mozilla Firefox: 6.0 or later<br />');
        // 10.0 File API & 10.0 <output>
        document.writeln(' - Internet Explorer: Not supported (partial support expected in 10.0)<br />');
        // ? File API & 5.1 <output>
        document.writeln(' - Safari: Not supported<br />');
        // ? File API & 9.2 <output>
        document.writeln(' - Opera: Not supported');
        return false;
      }
    },

    handleFileSelect: function (evt) {
      var files = evt.target.files; // FileList object
      fileReader.handleManagedKits(files);
      fileReader.handleOtherKits(files);
    },

    handleManagedKits: function (files) {
      $('#list').append('<br/><span style="font-weight:bold;"> Process MANAGED kits:</span><br/>\n');
      for (var i = 0; i < files.length; i++) {
        var file = files[i];
        if ( dnatree.isManagedKit(file.name.slice(0, -4).split("-")[3]) ) {
          fileReader.handleFileData(file, true);
        }
      }
    },

    handleOtherKits: function (files) {
      $('#list').append('<br/><span style="font-weight:bold;"> Process OTHER kits:</span><br />\n');
      for (var i = 0; i < files.length; i++) {
        var file = files[i];
        if ( ! dnatree.isManagedKit(file.name.slice(0, -4).split("-")[3]) ) {
          fileReader.handleFileData(file, false);
        }
      }
    },

    handleFileData: function (file, isManagedKit) {
      fileReader.appendFileMetadata(file);

      let reader = new FileReader();
      reader.readAsText(file);

      reader.onload = function(event){
        let csv = event.target.result;
        let request = {
          kitNum: file.name.slice(0, -4).split("-")[3],
          source: file.name.slice(0, -4).split("-")[0],
          type: file.name.slice(0, -4).split("-")[1],
          date: parseDate(file.name.slice(0, -4).split("-")[2]),
          matches: $.csv.toObjects(csv)
        };

        if (isManagedKit) { gedmatchReader.processManagedKit(request); }
        else { gedmatchReader.processOneToManyMatches(request); }

        dnatree.updateData();

        console.log("localStorage.dnatree: ", localStorage.dnatree.length);
      };

      reader.onerror = function(){ alert('Unable to read ' + file.fileName); };

      function parseDate(dateStr) {
        return new Date(`${dateStr.slice(0,4)}-${dateStr.slice(4,6)}-${dateStr.slice(6)}`);
      }
    },

    appendFileMetadata: function (file) {
      var output = '';
          output += '<span style="font-weight:bold;">' + escape(file.name) + '</span><br />\n';
          output += ' - FileType: ' + (file.type || 'n/a') + '<br />\n';
          output += ' - FileSize: ' + file.size + ' bytes<br />\n';
          output += ' - LastModified: ' + (file.lastModifiedDate ? file.lastModifiedDate.toLocaleDateString() : 'n/a') + '<br />\n';

      $('#list').append(output);
    }

  };

  window.fileReader = fileReader;

})(window);
