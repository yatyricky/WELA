// JavaScript Document

var s_cast1;
var s_cast2;
var s_cast3;
var s_chn1;
var s_chn2;
var s_chn3;
var s_rng1;
var s_rng2;
var s_rng3;
var s_aoe1;
var s_aoe2;
var s_aoe3;
var s_cost1;
var s_cost2;
var s_cost3;
var s_dur1;
var s_dur2;
var s_dur3;
var s_cd1;
var s_cd2;
var s_cd3;
var s_rut;
var s_ut1;
var s_ut2;
var s_ut3;

function undo() {
	var o = document.getElementById("cast1");
	o.value = s_cast1;
	o = document.getElementById("cast2");
	o.value = s_cast2;
	o = document.getElementById("cast3");
	o.value = s_cast3;
	o = document.getElementById("chn1");
	o.value = s_chn1;
	o = document.getElementById("chn2");
	o.value = s_chn2;
	o = document.getElementById("chn3");
	o.value = s_chn3;
	o = document.getElementById("rng1");
	o.value = s_rng1;
	o = document.getElementById("rng2");
	o.value = s_rng2;
	o = document.getElementById("rng3");
	o.value = s_rng3;
	o = document.getElementById("cost1");
	o.value = s_cost1;
	o = document.getElementById("cost2");
	o.value = s_cost2;
	o = document.getElementById("cost3");
	o.value = s_cost3;
	o = document.getElementById("aoe1");
	o.value = s_aoe1;
	o = document.getElementById("aoe2");
	o.value = s_aoe2;
	o = document.getElementById("aoe3");
	o.value = s_aoe3;
	o = document.getElementById("dur1");
	o.value = s_dur1;
	o = document.getElementById("dur2");
	o.value = s_dur2;
	o = document.getElementById("dur3");
	o.value = s_dur3;
	o = document.getElementById("cd1");
	o.value = s_cd1;
	o = document.getElementById("cd2");
	o.value = s_cd2;
	o = document.getElementById("cd3");
	o.value = s_cd3;
	o = document.getElementById("ut1");
	o.value = s_ut1;
	o = document.getElementById("ut2");
	o.value = s_ut2;
	o = document.getElementById("ut3");
	o.value = s_ut3;
	o = document.getElementById("rut");
	o.value = s_rut;
}

function textitem() {
	var qlvl = document.getElementById("qlvl");
	
	document.write(qlvl.value);
	
	var name = document.getElementById("name");
	
	var qlvlindicator = "";
	var qlvlcolour = "|cffffffff";
	if (qlvl.value == 1) {
		qlvlcolour = "|cff00ff00";
		qlvlindicator = qlvlcolour + "优秀" + "|r";
	} else if (qlvl.value == 2) {
		qlvlcolour = "|cff8b00ff";
		qlvlindicator = qlvlcolour + "稀有" + "|r";
	} else if (qlvl.value == 3) {
		qlvlcolour = "|cff00ff00";
		qlvlindicator = qlvlcolour + "优秀" + "|r";
	}
	name.value = qlvlcolour + name.value + "|r";
	
	
}

function textit() {
	var lvl1 = "|cffffcc00等级 1|r - ";
	var lvl2 = "|cffffcc00等级 2|r - ";
	var lvl3 = "|cffffcc00等级 3|r - ";
	var cast = "|cff99ccff施法时间：|r";
	var chn = "|cff99ccff引导时间：|r";
	var rng = "|cff99ccff施法距离：|r";
	var aoe = "|cff99ccff影响区域：|r";
	var cost = "|cff99ccff法力消耗：|r";
	var dur = "|cff99ccff持续时间：|r";
	var cd = "|cff99ccff冷却时间：|r";
	
	var cast1 = document.getElementById("cast1");
	var cast2 = document.getElementById("cast2");
	var cast3 = document.getElementById("cast3");
	var chn1 = document.getElementById("chn1");
	var chn2 = document.getElementById("chn2");
	var chn3 = document.getElementById("chn3");
	var rng1 = document.getElementById("rng1");
	var rng2 = document.getElementById("rng2");
	var rng3 = document.getElementById("rng3");
	var aoe1 = document.getElementById("aoe1");
	var aoe2 = document.getElementById("aoe2");
	var aoe3 = document.getElementById("aoe3");
	var cost1 = document.getElementById("cost1");
	var cost2 = document.getElementById("cost2");
	var cost3 = document.getElementById("cost3");
	var dur1 = document.getElementById("dur1");
	var dur2 = document.getElementById("dur2");
	var dur3 = document.getElementById("dur3");
	var cd1 = document.getElementById("cd1");
	var cd2 = document.getElementById("cd2");
	var cd3 = document.getElementById("cd3");
	s_cast1 = cast1.value;
	s_cast2 = cast2.value;
	s_cast3 = cast3.value;
	s_chn1 = chn1.value;
	s_chn2 = chn2.value;
	s_chn3 = chn3.value;
	s_rng1 = rng1.value;
	s_rng2 = rng2.value;
	s_rng3 = rng3.value;
	s_aoe1 = aoe1.value;
	s_aoe2 = aoe2.value;
	s_aoe3 = aoe3.value;
	s_cost1 = cost1.value;
	s_cost2 = cost2.value;
	s_cost3 = cost3.value;
	s_dur1 = dur1.value;
	s_dur2 = dur2.value;
	s_dur3 = dur3.value;
	s_cd1 = cd1.value;
	s_cd2 = cd2.value;
	s_cd3 = cd3.value;
	var info = "";
	var info1 = "";
	var info2 = "";
	var info3 = "";	
	if (cast1.value != "") {
		if (cast2.value == "") {
			cast2.value = cast1.value;
		}
		if (cast3.value == "") {
			cast3.value = cast2.value;
		}
	}
	if (chn1.value != "") {
		if (chn2.value == "") {
			chn2.value = chn1.value;
		}
		if (chn3.value == "") {
			chn3.value = chn2.value;
		}
	}
	if (rng1.value != "") {
		if (rng2.value == "") {
			rng2.value = rng1.value;
		}
		if (rng3.value == "") {
			rng3.value = rng2.value;
		}
	}
	if (aoe1.value != "") {
		if (aoe2.value == "") {
			aoe2.value = aoe1.value;
		}
		if (aoe3.value == "") {
			aoe3.value = aoe2.value;
		}
	}
	if (cost1.value != "") {
		if (cost2.value == "") {
			cost2.value = cost1.value;
		}
		if (cost3.value == "") {
			cost3.value = cost2.value;
		}
	}
	if (dur1.value != "") {
		if (dur2.value == "") {
			dur2.value = dur1.value;
		}
		if (dur3.value == "") {
			dur3.value = dur2.value;
		}
	}
	if (cd1.value != "") {
		if (cd2.value == "") {
			cd2.value = cd1.value;
		}
		if (cd3.value == "") {
			cd3.value = cd2.value;
		}
	}
	
	if (cast1.value != "") {
		info = info + cast + cast1.value;
		if (cast1.value != cast2.value || cast2.value != cast3.value) {
			info = info + "/" + cast2.value + "/" + cast3.value;
		}
		info = info + "秒\n";
		info1 = info1 + "\n" + cast + cast1.value + "秒";
		info2 = info2 + "\n" + cast + cast2.value + "秒";
		info3 = info3 + "\n" + cast + cast3.value + "秒";
	}
	if (chn1.value != "") {
		info = info + chn + chn1.value;
		if (chn1.value != chn2.value || chn2.value != chn3.value) {
			info = info + "/" + chn2.value + "/" + chn3.value;
		}
		info = info + "秒\n";
		info1 = info1 + "\n" + chn + chn1.value + "秒";
		info2 = info2 + "\n" + chn + chn2.value + "秒";
		info3 = info3 + "\n" + chn + chn3.value + "秒";
	}
	if (rng1.value != "") {
		info = info + rng + rng1.value;
		if (rng1.value != rng2.value || rng2.value != rng3.value) {
			info = info + "/" + rng2.value + "/" + rng3.value;
		}
		info = info + "码\n";
		info1 = info1 + "\n" + rng + rng1.value + "码";
		info2 = info2 + "\n" + rng + rng2.value + "码";
		info3 = info3 + "\n" + rng + rng3.value + "码";
	}	
	if (aoe1.value != "") {
		info = info + aoe + aoe1.value;
		if (aoe1.value != aoe2.value || aoe2.value != aoe3.value) {
			info = info + "/" + aoe2.value + "/" + aoe3.value;
		}
		info = info + "码\n";
		info1 = info1 + "\n" + aoe + aoe1.value + "码";
		info2 = info2 + "\n" + aoe + aoe2.value + "码";
		info3 = info3 + "\n" + aoe + aoe3.value + "码";
	}	
	if (cost1.value != "") {
		info = info + cost + cost1.value;
		if (cost1.value != cost2.value || cost2.value != cost3.value) {
			info = info + "/" + cost2.value + "/" + cost3.value;
		}
		info = info + "点\n";
		info1 = info1 + "\n" + cost + cost1.value + "点";
		info2 = info2 + "\n" + cost + cost2.value + "点";
		info3 = info3 + "\n" + cost + cost3.value + "点";
	}	
	if (dur1.value != "") {
		info = info + dur + dur1.value;
		if (dur1.value != dur2.value || dur2.value != dur3.value) {
			info = info + "/" + dur2.value + "/" + dur3.value;
		}
		info = info + "秒\n";
		info1 = info1 + "\n" + dur + dur1.value + "秒";
		info2 = info2 + "\n" + dur + dur2.value + "秒";
		info3 = info3 + "\n" + dur + dur3.value + "秒";
	}
	if (cd1.value != "") {
		info = info + cd + cd1.value;
		if (cd1.value != cd2.value || cd2.value != cd3.value) {
			info = info + "/" + cd2.value + "/" + cd3.value;
		}
		info = info + "秒\n";
		info1 = info1 + "\n" + cd + cd1.value + "秒";
		info2 = info2 + "\n" + cd + cd2.value + "秒";
		info3 = info3 + "\n" + cd + cd3.value + "秒";
	}
	info = info + "\n";
	var ctr = 0;
	var rut = document.getElementById("rut");
	s_rut = rut.value;
	ruts = rut.value.toString();
	for (var i = 0; i < ruts.length; i ++) {
		if (ruts.charAt(i) == "*") {
			if (ctr == 0) {
				ruts = ruts.substring(0, i) + info + lvl1 + ruts.substring(i + 1);				
			} else if (ctr == 1) {
				ruts = ruts.substring(0, i) + lvl2 + ruts.substring(i + 1);				
			} else if (ctr == 2) {
				ruts = ruts.substring(0, i) + lvl3 + ruts.substring(i + 1);				
			}
			ctr ++;
		}
	}
	rut.value = ruts;
	
	var ut = document.getElementById("ut1");
	s_ut1 = ut.value;
	ut.value = ut.value + "\n" + info1;
	ut = document.getElementById("ut2");
	s_ut2 = ut.value;
	ut.value = ut.value + "\n" + info2;
	ut = document.getElementById("ut3");
	s_ut3 = ut.value;
	ut.value = ut.value + "\n" + info3;
}