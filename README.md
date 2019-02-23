# Tube Mail: Discovery mDNS

This is just a helper module for [Tube Mail](https://github.com/jue89/node-tubemail). This module can be used to enable mDNS-based discovery.

## Example

```js
// npm install tubemail tubemail-mds
const fs = require('fs');
const tubemail = require('tubemail');

const toBuffer = (obj) => Buffer.from(obj.toString());

tubemail.join({
	key: fs.readFileSync('./hood.peer1.key'),
	cert: fs.readFileSync('./hood.peer1.crt'),
	ca: fs.readFileSync('./hood.crt'),
	discovery: require('tubemail-mdns');
}).then((hood) => {
	// Send the current time every second
	setInterval(() => hood.send(toBuffer(new Date())), 1000);

	// Say hello to new neighs
	hood.on('foundNeigh', (n) => n.send(toBuffer(`Hello ${n.info.subject.commonName}!`)));
});
```
