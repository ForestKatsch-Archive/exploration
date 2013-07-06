
var locale={

};

locale[" "]=" ";
locale["open-document"]="Open";
locale["unisec"]="UniSec";
locale["prompt"]=locale.unisec+" $ ";
locale["general-usage"]="General Usage";
locale["suspicious-activity-in-utah-center"]="Suspicious activity detected in Utah center.";
locale["unknown-command"]="Unknown command &lsquo;[COMMAND]&rsquo;. Please contact a Security Administrator with level 1 access.";
locale["welcome"]="Welcome to the "+locale.unisec+" database console, Technician [LAST-NAME].";
locale["help"]="Welcome to the "+locale.unisec+" database console, Technician [LAST-NAME].\n\
This system provides "+locale.unisec+" employees access to their UniSec accounts and some "+locale.unisec+"\n\
information. The amount information accessible by a user is dictated by his or her\n\
security level.\n\
\n\
The available commands for level [LEVEL] members are:\n\
- <em>help</em>     This help.\n\
\n\
(You may want to refer to the "+locale["general-usage"]+" document for more information).";
locale["logged-out"]="You have been disconnected.";

function _(s) {
    if(s in locale) {
	return locale[s].
	    replace(/\[LEVEL\]/g,prop.player.level).
	    replace(/\[TITLE\]/g,prop.player.name.title).
	    replace(/\[LAST-NAME\]/g,prop.player.name.last).
	    replace(/\[FIRST-NAME\]/g,prop.player.name.first);
    } else {
	console.log(s+" needs a translation!");
	return s;
    }
}