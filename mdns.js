const mdns = require('mdns');

module.exports = () => (port, needle, cb) => {
	needle = mdns.tcp('tm-' + needle.slice(0, 12));

	// Advertisment of the local peer
	const ad = mdns.createAdvertisement(needle, port, { name: 'Tubemail Peer' });
	ad.start();

	// Searching for remote peers
	const browser = mdns.createBrowser(needle, {resolverSequence: [
		mdns.rst.DNSServiceResolve(),
		'DNSServiceGetAddrInfo' in mdns.dns_sd ? mdns.rst.DNSServiceGetAddrInfo({families:[0]}) : mdns.rst.getaddrinfo({families:[0]}),
		mdns.rst.makeAddressesUnique()
	]});
	browser.on('serviceUp', (service) => cb(service));
	browser.start();

	// Return stop method
	return () => {
		ad.stop();
		browser.stop();
	};
};
