function AnimationObject(params) {
	this._x = params.x;
	this._y = params.y;
	this._rotation = params.rotation;
	this.animationQueue = [];
}
AnimationObject.prototype.queueAnimation = animation => {
};

export default AnimationObject;