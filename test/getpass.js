/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2016, Joyent, Inc.
 */

const mod_getpass = require('../lib/index');

mod_getpass.getPass(function (err, password) {
	var pwb64 = (new Buffer(password, 'utf8')).toString('base64');
	console.log(JSON.stringify({error: err, password: pwb64}));
});
