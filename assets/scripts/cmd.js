
function cmd_init() {
    loaded("cmd");
}

function cmd_run(c) {
    if(c == "help") {
	ui_special(_("open-document")+_(" ")+_("general-usage"),["open","general-usage"]);
	return _("help");
    } else if(c == "clear") {
	ui_clear();
	return "";
    } else if(c == "logout") {
	return _("logged-out");
    }
    return null;
}