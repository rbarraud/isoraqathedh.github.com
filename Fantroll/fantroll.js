/**
 *  LLNIIS:HS (Fantroll Division) generator
 *
 *  @author  Isoraķatheð Zorethan <isoraqathedh.zorethan@gmail.com>
 *  @version β.2.00
 *
 */
function init() {
	var buttons = document.getElementById("buttonset").getElementsByTagName("button");
	for (i = 0; i <= 11; i++) {
		if (buttons[i].addEventListener) {buttons[i].addEventListener('click', apply, false);} 
		else if (buttons[i].attachEvent) {buttons[i].attachEvent('onclick', apply);}  
	}
}
function getContent(x) {return document.getElementById(x).innerHTML;}
function make() {
	var thumber = document.getElementById("thumber")
	var errorholder = document.getElementById("error");
	var pb = document.getElementById("progressbar");
	// Clear all the data from the tables
	pb.value = 0;
	thumber.innerHTML = "";
	for (i = 1; i < 6; i++) {
		document.getElementById("sum" + i).innerHTML = "0";
		document.getElementById("digitalroot" + i).innerHTML = "0";
	}
	pb.value = 2;
	
	// Start to split the texts into words
	var fname = document.getElementById("fname").value.toUpperCase().split("");
	var mname = document.getElementById("mname").value.toUpperCase().split("");
	var lname = document.getElementById("lname").value.toUpperCase().split("");
	var name = fname.concat(mname, lname);
	pb.value = 3;
	// Start assigning weights and multiplying with the letters in the name
	var counter = 0, sum = 0, runsum = 0, passed = false;
	// Add in some variables if one of the fields are empty
	for (i=0; i<name.length; i++) {
		var row = "";
		if (passed === false && counter === fname.length) {
			counter = 1;
			passed = true;
			document.getElementById("sum1").innerHTML = sum;
			sum = encode(name[i]);
		}
		else if (passed === true && counter === mname.length) {
			counter = 1;
			passed = false;
			document.getElementById("sum2").innerHTML = sum;
			sum = encode(name[i]);
		}
		else {
			counter++;
			sum = sum + counter * encode(name[i]);
		}
		runsum = runsum + counter * encode(name[i]);
		row += "<tr id='letter" + i + "'>"
		row += "<td id='letterbase" + i + "'>" + name[i] + "</td>";
		row += "<td id='encoded" + i + "'>" + encode(name[i]) + "</td>";
		row += "<td id='weight" + i + "'>" + counter + "</td>";
		row += "<td id='multiplied" + i + "'>" + (counter * encode(name[i])) + "</td>";
		row += "</tr>"
		thumber.innerHTML += row;
	}
	document.getElementById("sum3").innerHTML = sum;
	pb.value = 8;
	// And now, the last four digits!
	var outsider = "";
	var blood = document.getElementById("blood").value.toUpperCase(); // The blood bit!
	outsider += "<tr id='bloodcolor'>"
	outsider += "<td id='letterblood'>" + blood + "</td>";
	outsider += "<td id='bloodencoded'>" + encode(blood) + "</td>";
	outsider += "<td>7</td>";
	outsider += "<td>" + encode(blood)*7 + "</td>";
	outsider += "</tr>";
	outsider += "<tr id='hornsize'>" // The size of the horn bit!
	outsider += "<td id='hornsize'>" + document.getElementById("size").value + "</td>";
	outsider += "<td id='bloodencoded'>" + encode(document.getElementById("size").value) + "</td>";
	outsider += "<td>5</td>";
	outsider += "<td>" + encode(document.getElementById("size").value)*5 + "</td>";
	outsider += "</tr>";
	var jun = parseInt(document.getElementById("junctions").value);
	var spi = parseInt(document.getElementById("xspikesxx").value);
	var blo = parseInt(document.getElementById("xxblobsxx").value);
	var ben = parseInt(document.getElementById("xxbendsxx").value);
	var sna = parseInt(document.getElementById("xxsnapsxx").value);
	var cur = parseInt(document.getElementById("xcurvesxx").value);
	var hornthings = [jun, spi, blo, ben, sna, cur];
	for (i = 0; i < hornthings.length; i++) {if (isNaN(hornthings[i])) {
		hornthings[i] = 0;
		errorholder.innerHTML = "Please input numbers in the horn feature " + i + ".";
	}}
	pb.value = 10;
	// Now, adjust the numbers.
	// Spikes
	if (Math.floor((spi - 2)/2) == -1) {spi = 0;}
	else {spi = Math.floor((spi - 2)/2);}
	blo = blo * 2; ben = ben * 2; // Blobs and bends
	sna = sna * 3; // Snaps
	cur = Math.floor(cur * 1.5); // Curves
	var horntotal = jun + spi + blo + ben + sna + cur; // Sum it up...
	// Then split into two digits.
	var horntotalten = Math.floor(horntotal / 10), horntotalone = horntotal - horntotalten * 10;
	// Put the stuff together into a table...
	outsider += "<tr id='horntotalten'>"
	outsider += "<td id='ten'>" + horntotalten + "</td>";
	outsider += "<td id='horntotaltenencoded'>" + horntotalten + "</td>";
	outsider += "<td>3</td>";
	outsider += "<td id='horntotaltenweighted'>" + horntotalten*3 + "</td>";
	outsider += "<tr id='horntotalone'>"
	outsider += "<td id='one'>" + horntotalone + "</td>";
	outsider += "<td id='horntotaloneencoded'>" + horntotalone + "</td>";
	outsider += "<td>1</td>";
	outsider += "<td id='horntotaloneweighted'>" + horntotalone + "</td>";
	thumber.innerHTML += outsider;
	document.getElementById("sum4").innerHTML = encode(blood)*7;
	document.getElementById("sum5").innerHTML = document.getElementById("size").value*5 + horntotalten*3 + horntotalone;
	pb.value = 15;
	// Calculate the final hash...
	var dte, digitroot, drs = 0, dsk = 0;
	for (j = 1; j <= 5; j++) {
		digitroot = document.getElementById("sum" + j).innerHTML.split("");
		for (i = 0; i < digitroot.length; i++) {drs = drs + encode(digitroot[i]);}
		document.getElementById("digitalroot" + j).innerHTML = drs;
		drs = 0;
		dte = [getContent("sum" + j), getContent("digitalroot" + j)];
		dsk += parseInt(dte[0]) * parseInt(dte[1])
	}
	var hashed = "Z";
	if (!isNaN(dsk)) {hashed = toRadix(dsk, 26);}
	document.getElementById("sum6").innerHTML = dsk + " — " + hashed; //Put it in!
	pb.value = 18;
	// Now for the rest of the LNIIS. (Funny how that was done the last...)
	var canon = (document.getElementById("canony").checked === true) ? "T4" : "T9";
	blood = blood.toLowerCase();
	var fletter = encode(fname[0]);
	var lletter = lname[0].toLowerCase();
	var hornsze = document.getElementById("size").value;
	document.getElementById("output").innerHTML = canon + blood + fletter + lletter + hornsze + hashed;
	pb.value = 20;
	var t = setTimeout("document.getElementById(\"progressbar\").value = 0", 5000);
	if (document.getElementById("swapy").checked == true) {
		// Take in the new progress bar 
		pb.setAttribute("max", 40);
		
		// Get sexswap number code
		var sex = 0;
		var originalsex = document.getElementById("spsexm").checked;
		var newsex = document.getElementById("ssexm").checked;
		if (originalsex === true) {
			if (newsex === true) {sex = 4;}
			else {sex = 3;}
		}
		else {
			if (newsex === false) {sex = 2;}
			else {sex = 1;}
		}
		pb.value = 21;
	}
}
function toRadix(toConvert, radix) {
	var HexN = "", Q = Math.floor(Math.abs(toConvert)), R, custstring = "ZABCDEFGHIJKLMNOPQRTUVWXY";
	var cutoff = 0;
	while (true) {
		R = Q % radix;
		HexN = custstring.charAt(R) + HexN;
		Q = (Q - R) / radix;
		cutoff++;
		if (Q == 0 || cutoff > 100) break;
	}
	return ((toConvert<0) ? "-" + HexN : HexN);
}
function encode(x) { switch (x) {
	case " ": case "0": case "": return 0; break;
	case "A": case "1": return 1; break;
	case "B": case "2": return 2; break;
	case "C": case "3": return 3; break;
	case "D": case "4": return 4; break;
	case "E": case "5": return 5; break;
	case "F": case "6": return 6; break;
	case "G": case "7": return 7; break;
	case "H": case "8": return 8; break;
	case "I": case "9": return 9; break;
	case "J": return 10; break;
	case "K": return 11; break;
	case "L": return 12; break;
	case "M": return 13; break;
	case "N": return 14; break;
	case "O": return 15; break;
	case "P": return 16; break;
	case "Q": return 17; break;
	case "R": return 18; break;
	case "S": return 19; break;
	case "T": return 20; break;
	case "U": return 21; break;
	case "V": return 22; break;
	case "W": return 23; break;
	case "X": return 24; break;
	case "Y": return 25; break;
	case "Z": return 26; break;
	default: return 27;
}}
function apply() {
	var thingyid = this.getAttribute("data-order");
	var canontrolls = [];
	canontrolls[ 1] = ["f",  1, "Aradia", "Megido"];
	canontrolls[ 2] = ["m",  2, "Tavros", "Nitram"];
	canontrolls[ 3] = ["m",  3, "Sollux", "Captor"];
	canontrolls[ 4] = ["m", 14, "Karkat", "Vantas"];
	canontrolls[ 5] = ["f",  5, "Nepeta", "Leijon"];
	canontrolls[ 6] = ["f",  6, "Kanaya", "Maryam"];
	canontrolls[ 7] = ["f",  7, "Terezi", "Pyrope"];
	canontrolls[ 8] = ["f",  8, "Vriska", "Serket"];
	canontrolls[ 9] = ["m",  9, "Equius", "Zahhak"];
	canontrolls[10] = ["m", 10, "Gamzee", "Makara"];
	canontrolls[11] = ["m", 11, "Eridan", "Ampora"];
	canontrolls[12] = ["f", 12, "Feferi", "Peixes"];
	if (canontrolls[thingyid][0] === "m") {document.getElementById("spsexm").checked = "checked";}
	else {document.getElementById("spsexf").checked = "checked";}
	document.getElementById("blood").value = canontrolls[thingyid][1];
	document.getElementById("fname").value = canontrolls[thingyid][2];
	document.getElementById("mname").value = "";
	document.getElementById("lname").value = canontrolls[thingyid][3];
	document.getElementById("canonn").checked = "checked";
}