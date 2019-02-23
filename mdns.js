const util = require('util');
const debug = util.debuglog('tubemail-mdns');
const Bonjour = require('bonjour-hap');

module.exports = (hood, cb) => {
	const mdns = new Bonjour();

	const port = hood.port;
	const type = `tm-${hood.fingerprint.slice(0, 12)}`;
	const name = `Tubemail Peer ${hood.id.slice(0, 7)} (${hood.info.subject.commonName})`;

	// Advertisment of the local peer
	debug('publishing type="%s" port=%d name="%s"', type, port, name);
	mdns.publish({type, port, name});

	// Searching for remote peers
	mdns.find({type}, (service) => cb(service));

	// Return stop method
	return () => mdns.destroy();
};
