
var VERSION=[0,0,1];

var modules=["cmd","main","assets","prop","ui","run"];
var module_number=0;
var module_start_time;

function loaded(module) {
    if(!(module in modules))
	throw "ModuleError: nonexistent module '"+module+"'";
    if(modules[module] == true)
	throw "ModuleError: module '"+module+"' was loaded multiple times";
    console.log("Loaded "+module);
    module_number+=1;
    modules[module]=true;
    for(var i in modules) {
	if(modules[i] == false)
	    return;
    }
    done();
}

function init() {
    module_start_time=new Date().getTime();
    var m={};
    for(var i=0;i<modules.length;i++)
	m[modules[i]]=false;
    modules=m;
}

$(document).ready(function() {
    init();
    setTimeout(function() {
	prop_init(); // MUST BE FIRST!
	run_init();
	assets_init();
	cmd_init();
	ui_init();
	loaded("main");
    },0);
});

function done() {
    var time=new Date().getTime()-module_start_time;
    time=(time/1000).toFixed(3);
    console.log("Loaded "+module_number+" module"+s(module_number)+" in "+time+" second"+s(time))
}

var last_frame_time=0;

function update() {
    var time=new Date().getTime();
    requestAnimationFrame(update);
    scene_update();
    assets_update();
    render_update();
    var fps=1/((time-last_frame_time)/1000);
    prop.about.fps=((fps*(prop.about.fps_samples-1))+prop.about.fps)/prop.about.fps_samples;
    last_frame_time=time;
}