/*
 * Copyright 2016, Joyent, Inc. All rights reserved.
 * Author: Alex Wilson <alex.wilson@joyent.com>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to
 * deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 * sell copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 * IN THE SOFTWARE.
*/
const mod_tape = require('tape');
const mod_pty = require('node-pty');

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
				term.write('\r');
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
