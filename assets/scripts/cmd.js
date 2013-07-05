
function cmd_init() {
    loaded("cmd");
}

function cmd_run(c) {
    if(c == "ls")
	return ["That program isn't fucking installed you dumbass."];
    return false;
}