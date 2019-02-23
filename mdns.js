const Bonjour = require('bonjour-hap');

module.exports = (opts = {}) => (port, needle, cb) => {
	const mdns = new Bonjour();

	const type = `tm-${needle.slice(0, 12)}`;
	const name = opts.name || `Tubemail Peer ${port}`

	// Advertisment of the local peer
	mdns.publish({type, port, name});

	// Searching for remote peers
	mdns.find({type}, (service) => cb(service));

	// Return stop method
	return () => mdns.destroy();
};
