#
# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at http://mozilla.org/MPL/2.0/.
#
# Copyright (c) 2016, Joyent, Inc.
#

#
# Tools
#
NPM_EXEC	:= $(shell which npm)
NPM		:= npm
TAP		:= ./node_modules/.bin/tape
JSON		:= ./node_modules/.bin/json

#
# Makefile.defs defines variables used as part of the build process.
#
include ./tools/mk/Makefile.defs

#
# Configuration used by Makefile.defs and Makefile.targ to generate 
# "check" and "docs" targets.
#
DOC_FILES	 = index.md
JSON_FILES	 = package.json
JS_FILES	:= $(shell find lib test -name '*.js')
JSL_FILES_NODE	 = $(JS_FILES)
JSSTYLE_FILES	 = $(JS_FILES)

JSL_CONF_NODE	 = tools/jsl.node.conf
JSSTYLE_FLAGS	 = -f tools/jsstyle.conf

include ./tools/mk/Makefile.defs
include ./tools/mk/Makefile.node_deps.defs

#
# Repo-specific targets
#
.PHONY: all
all: $(SMF_MANIFESTS) | $(TAP) $(REPO_DEPS)
	$(NPM) rebuild

$(TAP): | $(NPM_EXEC)
	$(NPM) install
$(JSON): | $(NPM_EXEC)
	$(NPM) install

CLEAN_FILES += $(TAP) ./node_modules/tap

.PHONY: test
test: $(TAP)
	TAP=1 $(TAP) test/*.test.js

.PHONY: coverage
coverage: all
	$(NPM_EXEC) install istanbul && \
	    ./node_modules/.bin/istanbul cover \
	    $(TAP) test/*.test.js

include ./tools/mk/Makefile.deps
include ./tools/mk/Makefile.node_deps.targ
include ./tools/mk/Makefile.targ
