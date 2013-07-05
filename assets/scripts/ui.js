
var KEY_ENTER=13;
var KEY_BACKSPACE=8;
var KEY_RIGHT=39;
var KEY_LEFT=37;
var KEY_UP=38;
var KEY_DOWN=40;

function ui_init() {
    prop.ui={};
    prop.ui.terminal={};

    prop.ui.terminal.history=[];
    prop.ui.terminal.current_history=0;
    prop.ui.terminal.current_input="";

    prop.ui.terminal.prompt="$ ";

    prop.ui.terminal.cursor={};
    prop.ui.terminal.cursor.position=0;

    prop.ui.terminal.input="";

    $("#terminal").append("<li class='line current'><span class='prompt'>"+prop.ui.terminal.prompt+"</span><span id='input'><span id='cursor'>&nbsp;</span></span></li>");

    $(window).keypress(function(e) {
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

function ui_run_line() {
    prop.ui.terminal.cursor.position=0;
    $(".current.line").remove();
    var line=$(document.createElement("li"));
    line.addClass("line");
    line.append("<span class='prompt'>"+prop.ui.terminal.prompt+"</span>")
    line.append("<span class='command'>"+prop.ui.terminal.input+"</span>")
    $("#terminal").append(line);
    var c=prop.ui.terminal.input;
    var s=c.split(/\s+/);
    var o=cmd_run(s);
    if(o == false) {
	if(s[0].length != 0) {
	    var line=$(document.createElement("li"));
	    var out=$(document.createElement("span"));
	    out.addClass("output");
	    out.addClass("error");
	    out.text("The program '"+s[0]+"' isn't installed.");
	    line.append(out);
	    $("#terminal").append(line);
	}
    } else {
	prop.ui.terminal.history.push(prop.ui.terminal.input);
	prop.ui.terminal.current_history++;
	for(var i=0;i<o.length;i++) {
	    var line=$(document.createElement("li"));
	    var out=$(document.createElement("span"));
	    out.addClass("output");
	    out.text(o[i]);
	    line.append(out);
	    $("#terminal").append(line);
	}
    }
    line=$(document.createElement("li"));
    line.addClass("line current");
    line.append("<span class='prompt'>"+prop.ui.terminal.prompt+"</span>")
    line.append("<span id='input'><span id='cursor'>&nbsp;</span></span>")
    $("#terminal").append(line);
    prop.ui.terminal.input="";
    $("#terminal").scrollTop($("#terminal")[0].scrollHeight);
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
