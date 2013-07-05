
function cmd_init() {
    loaded("cmd");
}

function cmd_run(c) {
    if(c == "ls")
	return ["total 0"];
    return false;
}