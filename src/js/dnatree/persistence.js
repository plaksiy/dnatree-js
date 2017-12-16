(function (window) {

  var persistence = {
    browserLocalStorage: {
      retrieveDnaTree: function () {
        this.decompressDnaTree();
        dnatree.updateStatistic();
      },

      storeDnaTree: function () {
        localStorage.dnatree = this.compressDnaTree();
      },

      compressDnaTree: function () {
        return JSON.stringify({
          persons: this.compressPersons(),
          kits   : this.compressKits(),
          matches: this.compressMatches()
        });
      },

      compressPersons: function () {
        return Object.values(dnatree.persons).slice(1).map(function (p) {
          return [p.id, p.sex, p.name, p.email];
        });
      },

      compressKits: function () {
        return Object.values(dnatree.kits).slice(1).map(function (k) {
          return [k.kitNum, k.date, k.personId, k.type, k.laboratory, k.haplogroup.Mt, k.haplogroup.Y];
        });
      },

      compressMatches: function () {
        return Object.values(dnatree.matches).slice(1).map(function (m) {
          var kits = m.id.split(',');
          return [kits[0], kits[1],
                  m.autosomal.totalCM, m.autosomal.largestCM, m.autosomal.gen,
                  m.xMatch.totalCM, m.xMatch.largestCM];
        });
      },

      decompressDnaTree: function () {
        var compressed = JSON.parse(localStorage.dnatree);
        this.decompressPersons(compressed.persons);
        this.decompressKits(compressed.kits);
        this.decompressMatches(compressed.matches);
      },

      decompressPersons: function (persons) {
        function create(p) {
          var sex = p[1];
          if (sex == "M") {
            return new Male(p[0], p[2], p[3]);
          } else if (sex == "F") {
            return new Female(p[0], p[2], p[3]);
          } else {
            return new PersonSexless(p[0], p[2], p[3]);
          }
        }

        return persons.map(function (person) {
          dnatree.persons.add(create(person));
        });
      },

      decompressKits: function (kits) {
        return kits.map(function (k) {
          dnatree.kits.add(new DnaKit(k[0], k[1], k[2], k[3], k[5], k[6]));
        });
      },

      decompressMatches: function (matches) {
        return matches.map(function (m) {
          dnatree.matches.add(new Match(m[0], m[1], m[2], m[3], m[4], m[5], m[6]));
        });
      }
    }
  };


  window.persistence = persistence;

})(window);
