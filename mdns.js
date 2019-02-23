const mdns = require('mdns');

module.exports = (opts = {}) => (port, needle, cb) => {
	needle = mdns.tcp('tm-' + needle.slice(0, 12));

	// Advertisment of the local peer
	const ad = mdns.createAdvertisement(needle, port, {
		name: opts.name || `Tubemail Peer ${port}`
	});
	ad.on('error', (err) => console.log('MDNS Advertisement Error', err));
	ad.start();

	// Searching for remote peers
	const browser = mdns.createBrowser(needle, {resolverSequence: [
		mdns.rst.DNSServiceResolve(),
		'DNSServiceGetAddrInfo' in mdns.dns_sd ? mdns.rst.DNSServiceGetAddrInfo({families:[0]}) : mdns.rst.getaddrinfo({families:[0]}),
		mdns.rst.makeAddressesUnique()
	]});
	browser.on('serviceUp', (service) => cb(service));
	browser.on('error', (err) => console.log('MDNS Browser Error', err));
	browser.start();

	// Return stop method
	return () => {
		ad.stop();
		browser.stop();
	};
};
