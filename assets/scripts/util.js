
String.prototype.insert = function (index, string) {
    if (index > 0)
	return this.substring(0, index) + string + this.substring(index, this.length);
  else
      return string + this;
};

function clamp(l,n,h) {
    if(h == undefined)
	h=Infinity;
    return Math.max(l,Math.min(n,h));
}

function s(i) {
    if(i == 1)
	return "";
    else
	return "s";
}

function degrees(radians) {
    return (radians/(Math.PI*2))*360;
}

function radians(degrees) {
    return (degrees/360)*(Math.PI*2);
}