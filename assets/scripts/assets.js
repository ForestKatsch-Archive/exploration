
var ASSET_TYPE_UNKNOWN=0;
var ASSET_TYPE_MODEL=1;
var ASSET_TYPE_TEXT=2;

var AssetModel=function(vertices) {
    
};

var Asset=function(name,data,type) {
    this.type=type;
    this.name=name;
    this.data=data;
};

function assets_init() {
    prop.assets={};
    prop.assets.assets={};
//    asset_add("text",new AssetModel(),ASSET_TYPE);
    loaded("assets");
}

function asset_add(name,data,type) {
    var a=new Asset(name,data,type);
    prop.assets.assets[name]=a;
}

function assets_update() {

}