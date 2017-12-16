function init() {
	console.log("*** S T A R T ***");
	getKitList($("tr"));
	localStorage.kits = JSON.stringify(kits);
	localStorage.matches = JSON.stringify(matches);
	console.log(kits);
	console.log(matches);
}

var kits = {
	addKitNum : function(num) {
				if (this[num]) {
					console.log("kit - " + num + " already exist !");
				} else {
					this[num] = {};
				}
			},

	addKit: function(cs) {
				if (this[cs[0].textContent] && !$.isEmptyObject(kits[cs[0].textContent])) {
					console.log("kit - " + cs[0].textContent + " already exist !");
				} else {
					this[cs[0].textContent] = new DnaKit(cs[0].textContent, 
														cs[1].textContent, 
														cs[4].textContent, 
														cs[17].textContent, 
														cs[18].textContent,
														cs[5].textContent,
														cs[6].textContent);
				}
			}
};

var matches = {
	addMatch: function(currentKit, cs) {
		var matchName = [currentKit, cs[0].textContent].sort().toString();
		if (this[matchName]) {
			console.log("match - " + matchName + " already exist !")
		} else {
			this[matchName] = {
				"autosomal": new Autosomal(
					Number(cs[9].textContent),
					Number(cs[10].textContent),
					Number(cs[11].textContent)
				)
			};
			if (Number(cs[14].textContent) != 0) {
				this[matchName]["xMatch"] = new XMatch(
					Number(cs[14].textContent),
					Number(cs[15].textContent)
				)
			}
		}
	}
};

function DnaKit(kitNum, type, sex, name, email, _Mt, _Y) {
	this.kitNum = kitNum;
	this.type = type;
	this.sex = sex;
	this.name = name;
	this.email = email;
	this.haplogroup = {Mt: _Mt, Y: _Y};
}

function Match(totalCM, largestCM) {
	this.totalCM = totalCM;
	this.largestCM = largestCM;
}

function Autosomal(totalCM, largestCM, gen) {
	Match.call(this, totalCM, largestCM);
	this.gen = gen;
}

function XMatch(totalCM, largestCM) {
	Match.call(this, totalCM, largestCM);
}

function getKitList(rs) {
	var currentKit = $("input")[0].name;
	var count = rs.length;
	kits.addKitNum(currentKit);
	for (i = 3; i < count; i++) {
        var cs = rs[i].children;
		kits.addKit(cs);
		matches.addMatch(currentKit, cs)
	}
}

/*
$(function(){
    var rs = $("tr");
    var pList = [];

    console.log("Match list")
    
    for (i = 3; i < 6; i++) {
        var row = rs[i];
        var cs = rs[i].children;
        var kitNum = cs[0].textContent;
        pList[i] = {kitNum: kitNum,
            type: cs[1].textContent,
            sex: cs[4].textContent,
            haplogroup: {Mt: row.children[6].textContent,
                            Y: row.children[7].textContent},
            autosomal: {totalCM: row.children[9].textContent,
                            largestCM: row.children[10].textContent,
                            gen: row.children[11].textContent},
            xDNA: {totalCM: row.children[14].textContent,
                            largestCM: row.children[15].textContent},
            name: row.children[17].textContent,
            email: row.children[18].textContent,
            commomListLink: row.children[2].children[0].attributes.href
        }
    }
    
    console.log(pList.length);

    console.log(pList)
});
*/
