function Spy (target, method) {
	var spy = {};
	var origin = target[method];
	spy.count = 0;
	target[method] = function() {
		spy.count++;
		origin.apply(target, arguments);
	};
	return spy;
}

module.exports = Spy