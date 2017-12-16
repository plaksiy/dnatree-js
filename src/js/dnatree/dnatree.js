(function (window) {

  var dnatree = {
    persons: {
      add: function (person) {
        if (this[person.id]) {
          // console.log(person.name + " already exist !");
        } else {
          this[person.id] = person;
        }
      }
    },

    kits: {
      add: function (kit) {
        if (this[kit.kitNum]) {
          // console.log("Kit - " + kit.kitNum + " already exist !");
        } else {
          this[kit.kitNum] = kit;
        }
      }
    },

    matches: {
      add: function (match) {
        if (this[match.id]) {
          // console.log("Match beetwen kits - " + match.id + " already exist !");
        } else {
          this[match.id] = match;
        }
      }
    },

    isManagedKit: function (kitNumber) {
      return this.myKits.indexOf(kitNumber) >= 0
    },

    updateData: function () {
      // localStorage.dnatreeObjs = JSON.stringify(this);
      persistence.browserLocalStorage.storeDnaTree();
      this.updateStatistic();
    },

    updateStatistic: function () {
      this.statistic = {
        persons: Object.keys(dnatree.persons).length - 1,
        kits: Object.keys(dnatree.kits).length - 1,
        matches: Object.keys(dnatree.matches).length - 1
      };
    }
  };


  function Person(id, name, email) {
    this.id = id;
    this.sex = "U";
    this.name = name;
    this.email = email;
    asMale = function() {
      return new Male(this.id, this.name, this.email);
    };
    asFemale = function() {
      return new Female(this.id, this.name, this.email);
    };
    asSexless = function() {
      return new PersonSexless(this.id, this.name, this.email);
    };
  }

  function Male(id, name, email) {
    Person.call(this, id, name, email);
    this.sex = "M";
  }

  function Female(id, name, email) {
    Person.call(this, id, name, email);
    this.sex = "F";
  }

  function PersonSexless(id, name, email) {
    Person.call(this, id, name, email);
    this.sex = "U";
  }

  function DnaKit(kitNum, date, personId, type, _Mt, _Y) {
  	this.kitNum = kitNum;
    this.date = date;
    this.personId = personId;
  	this.type = type;
    this.laboratory = kitNum.substr(0,1);
  	this.haplogroup = {Mt: _Mt, Y: _Y};
  }

  function Match(kit1, kit2, a_totalCM, a_largestCM, a_gen, x_totalCM, x_largestCM) {
    this.id = [kit1, kit2].sort().toString();
    this.autosomal = {totalCM: a_totalCM, largestCM: a_largestCM, gen: a_gen};
    this.xMatch = {totalCM: x_totalCM, largestCM: x_largestCM};
  }


  window.dnatree = dnatree;
  window.Person = Person;
  window.Male = Male;
  window.Female = Female;
  window.PersonSexless = PersonSexless;
  window.DnaKit = DnaKit;
  window.Match = Match;

})(window);
