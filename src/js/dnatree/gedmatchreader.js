(function (window) {

  var gedmatchReader = {
    processMatcheRow: function (kitNum, date, matchRow) {
      function getPerson(matchRow) {
        var sex = matchRow.sex;
        if (sex == "M") {
            return new Male(matchRow.kit_num_ext, matchRow.name, matchRow.email);
          } else if (sex == "F") {
            return new Female(matchRow.kit_num_ext, matchRow.name, matchRow.email);
          } else {
            return new PersonSexless(matchRow.kit_num_ext, matchRow.name, matchRow.email);
          }
      }

      function toDate(date, days) {
        var newDate = new Date();
        newDate.setDate(date.getDate() - days);
        return newDate.toISOString().slice(0,10);
      }

      function toNum(numStr) {
        return Math.round(Number(numStr) * 100) / 100;
      }

      var person = getPerson(matchRow);

      var kit = new DnaKit(
        matchRow.kit_num_ext,
        toDate(date, Number(matchRow.days)),
        person.id,
        matchRow.kit_type,
        matchRow.MT_haplo,
        matchRow.Y_haplo
      );

      var match = new Match(
        kitNum,
        matchRow.kit_num_ext,
        toNum(matchRow.shared_cm),
        toNum(matchRow.largest),
        toNum(matchRow.gen),
        toNum(matchRow.x_shared_cm),
        toNum(matchRow.x_largest)
      );

      dnatree.persons.add(person);
      dnatree.kits.add(kit);
      dnatree.matches.add(match);
    },

    processManagedKit: function (request) {
      request.matches.map( m => {
        if ( Number(m.largest) >= 10) gedmatchReader.processMatcheRow(request.kitNum, request.date, m)
      });
    },

    processOneToManyMatches: function (request) {
      request.matches.map( m => {
        if (dnatree.isManagedKit(m.kit_num_ext) || Number(m.gen) <= 3 || dnatree.kits[m.kit_num_ext]) {
          gedmatchReader.processMatcheRow(request.kitNum, request.date, m);
        }
      });
    }
  };

  window.gedmatchReader = gedmatchReader;

})(window);
