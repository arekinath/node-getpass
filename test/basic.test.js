/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2016, Joyent, Inc.
 */

const mod_tape = require('tape');
const mod_pty = require('pty.js');

mod_tape.test('get a password', function (t) {
	var term = mod_pty.spawn('node', ['./test/getpass.js'], {
		name: 'xterm',
		cwd: process.cwd(),
		env: process.env
	});
	var buf = '';
	term.on('data', waitPrompt);
	function waitPrompt(data) {
		buf += data;
		if (buf === 'Password:') {
			buf = '';
			term.write('a');
			term.write('b');
			term.write('c123');
			setTimeout(function () {
				t.strictEqual(buf.length, 0);
				term.removeListener('data', waitPrompt);
				term.on('data', waitReply);
				term.write('\n');
				term.end();
			}, 100);
		}
	}
	function waitReply(data) {
		buf += data;
	}
	term.on('close', function () {
		t.strictEqual(buf.slice(0, 3), '\r\r\n');
		buf = buf.slice(2);
		var payload = JSON.parse(buf);
		t.strictEqual(payload.error, null);
		t.strictEqual(payload.password, 'YWJjMTIz');
		t.end();
	});
});
