
function cmd_init() {
    loaded("cmd");
}

function cmd_run(c) {
    console.log(c);
    if(c == "help") {
	return _("help");
    } else if(c == "logout") {
	return _("logged-out");
    }
    return false;
}