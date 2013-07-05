
function cmd_init() {
    loaded("cmd");
}

function cmd_run(c) {
    if(c == "help") {
	return _("help").replace(/\[LEVEL\]/g,"5").replace(/\[LAST-NAME\]/g,"Moore");
    }
    return false;
}