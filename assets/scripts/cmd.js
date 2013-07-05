
function cmd_init() {
    loaded("cmd");
}

function cmd_run(c) {
    if(c == "help") {
	return "Welcome to the remote NatSec computer system.\n\
Your position is currently <em>Technician</em>, and your security status is <em>level 3</em>.\n\
\n\
Thank you for helping the organization.";
    }
    return false;
}