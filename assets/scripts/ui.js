
var KEY_ENTER=13;
var KEY_BACKSPACE=8;
var KEY_RIGHT=39;
var KEY_LEFT=37;
var KEY_UP=38;
var KEY_DOWN=40;

function ui_init() {
    prop.ui={};

    prop.ui.background={};
    prop.ui.background.pan=0;

    prop.ui.special={};
    prop.ui.special.text="";
    prop.ui.special.command="";

    $("#special").mouseup(function() {
	ui_special_run();
    });

    /*
    setInterval(function() {
	prop.ui.background.pan+=0.005;
	var pan=Math.sin(prop.ui.background.pan)*50-50;
	$("body").css("background-position",pan+"px 0");
    },1000/60);
    */
    prop.ui.terminal={};

    prop.ui.terminal.history=[];
    prop.ui.terminal.current_history=0;
    prop.ui.terminal.current_input="";
    prop.ui.terminal.processing=false;

    prop.ui.terminal.prompt=_("prompt");

    prop.ui.terminal.cursor={};
    prop.ui.terminal.cursor.position=0;

    prop.ui.terminal.input="";
    
    ui_clear()

    ui_print(_("suspicious-activity-in-utah-center"),"error");
    ui_print(_("welcome").replace(/\[LAST-NAME\]/g,"Moore"));

    $(window).keypress(function(e) {
	if(prop.ui.terminal.processing == true)
	    return;
	if(e.which == KEY_ENTER) {
	    ui_run_line();
	} else {
	    var c=String.fromCharCode(e.charCode);
	    prop.ui.terminal.cursor.position=clamp(0,prop.ui.terminal.cursor.position);
	    var before_cursor=prop.ui.terminal.input.substr(0,prop.ui.terminal.cursor.position);
	    var after_cursor=prop.ui.terminal.input.substr(prop.ui.terminal.cursor.position);
	    prop.ui.terminal.input=before_cursor+c+after_cursor;
	    prop.ui.terminal.cursor.position++;
	    ui_update_input();
	}
    });

    $(window).keydown(function(e) {
	if(prop.ui.terminal.processing == true)
	    return;
	if([37,38,39,40].indexOf(e.keyCode) > -1) {
            e.preventDefault();
	}
	if(e.which == KEY_RIGHT) {
	    prop.ui.terminal.cursor.position++;
	} else if(e.which == KEY_LEFT) {
	    prop.ui.terminal.cursor.position--;
	} else if(e.which == KEY_BACKSPACE) {
	    var before_cursor=prop.ui.terminal.input.substr(0,prop.ui.terminal.cursor.position-1);
	    var after_cursor=prop.ui.terminal.input.substr(prop.ui.terminal.cursor.position);
	    prop.ui.terminal.input=before_cursor+after_cursor;
	    prop.ui.terminal.cursor.position--;
	} else if(e.which == KEY_UP) {
	    return;
	    if(prop.ui.terminal.current_history == prop.ui.terminal.history.length) {
		prop.ui.terminal.current_input=prop.ui.terminal.input;
	    }
	    prop.ui.terminal.current_history--;
	    prop.ui.terminal.current_history=clamp(0,prop.ui.terminal.current_history);
	    prop.ui.terminal.cursor.position=Infinity;
	    prop.ui.terminal.input=prop.ui.terminal.history[prop.ui.terminal.current_history];
	} else if(e.which == KEY_DOWN) {
	    return;
	    prop.ui.terminal.current_history++;
	    prop.ui.terminal.current_history=clamp(0,prop.ui.terminal.current_history,prop.ui.terminal.history.length);
	    if(prop.ui.terminal.current_history == prop.ui.terminal.history.length) {
		prop.ui.terminal.input=prop.ui.terminal.current_input;
	    }
	    prop.ui.terminal.cursor.position=Infinity;
	}
	prop.ui.terminal.cursor.position=clamp(0,prop.ui.terminal.cursor.position);
	ui_update_input();
    });

    loaded("ui");
}

function ui_replace(element,text,number) {
    if(element.text() == text)
	return;
    if(number == undefined || number == 0)
	number=-1;
    if(number < 0) {
	var t=element.text();
	if(t.length == 0) {
	    number=1;
	} else {
	    element.text(t.substr(0,t.length-1));
	    number--;
	}
    } else if(number > 0) {
	var t=element.text();
	if(t.length == text.length) {
	    number=0;
	} else {
	    element.text(text.substr(0,t.length+1));
	    number++;
	}
    }
    if(number != 0 && number != undefined) {
	setTimeout(function() {
	    ui_replace(element,text,number);
	},1000/50);
    }
}

function ui_special(text,command) {
    prop.ui.special.text=text;
    prop.ui.special.command=command;
    ui_replace($("#special"),text);
}

function ui_special_run() {
    var c=prop.ui.special.command;
    if(c == "")
	return;
    console.log(c);
    if(c[0] == "open") {
	console.log("Opening the "+c[1]+" document.");
    }
}

function ui_reset_input() {
    $(".current.line").remove();
    $("#terminal").append("<li class='line current'><span class='prompt'>"+prop.ui.terminal.prompt+"</span><span id='input'><span id='cursor'>&nbsp;</span></span></li>");
}

function ui_clear() {
    $("#terminal").empty();
    ui_reset_input();
}

function ui_print(l,classes) {
    var line=$(document.createElement("li"));
    var out=$(document.createElement("span"));
    out.addClass("output");
    if(classes != undefined)
	out.addClass(classes);
    out.html(l);
    line.append(out);
    $("#terminal").append(line);
    ui_reset_input();
}

function ui_run(c,callback) {
    var s=c.split(/\s+/);
    if(s[0] == "")
	s=s.splice(1);
    var o=cmd_run(s);
    if(o == null) {
	if(s.length != 0) {
	    var line=$(document.createElement("li"));
	    var out=$(document.createElement("span"));
	    out.addClass("output");
	    out.addClass("error");
	    out.html(_("unknown-command").replace(/\[COMMAND\]/g,s[0]));
	    line.append(out);
	    $("#terminal").append(line);
	}
    } else {
	prop.ui.terminal.history.push(prop.ui.terminal.input);
	prop.ui.terminal.current_history++;
	if(o != "") {
	    o=o.split("\n");
	    for(var i=0;i<o.length;i++) {
		ui_print(o[i]);
	    }
	}
    }
    prop.ui.terminal.processing=false;
    callback();
}

function ui_run_line() {
    prop.ui.terminal.processing=true;
    prop.ui.terminal.cursor.position=0;
    $(".current.line").remove();
    var line=$(document.createElement("li"));
    line.addClass("line");
    line.append("<span class='prompt'>"+prop.ui.terminal.prompt+"</span>")
    line.append("<span class='command'>"+prop.ui.terminal.input+"</span>")
    $("#terminal").append(line);
    ui_run(prop.ui.terminal.input,function() {
	ui_reset_input();
	prop.ui.terminal.input="";
	$("#terminal").scrollTop($("#terminal")[0].scrollHeight);
    });
}

function ui_update_input() {
    $("#input").remove();
    var input_element=$(document.createElement("span"));
    input_element.attr("id","input");
    var before_cursor=prop.ui.terminal.input.substr(0,prop.ui.terminal.cursor.position);
    var after_cursor=prop.ui.terminal.input.substr(prop.ui.terminal.cursor.position+1);
    var at_cursor=prop.ui.terminal.input.substr(prop.ui.terminal.cursor.position,1);
    if(at_cursor.length == 0)
	at_cursor="&nbsp;";
    input_element.append(before_cursor+"<span id='cursor'>"+at_cursor+"</span>"+after_cursor);
    $(".current.line").append(input_element);
    $("#terminal").scrollTop($("#terminal")[0].scrollHeight);
}
