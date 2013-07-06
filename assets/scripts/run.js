
function run_init() {
    loaded("run");
}

function run(c) {
    if(c == undefined)
	return;
    console.log("Running ",c);
    if(c[0] == "open") {
	doc_open(c[1]);
    }
}

