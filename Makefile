# DD2VTT foundry importer

modulename := "little-things"
rollup := node_modules/.bin/rollup
src := $(wildcard src/*.js)
target := module.js
zipsources := module.json ${target} ${target}.map
zipfile := ${modulename}.zip

all: ${target}

${rollup}:
	npm install --dev

${target}: ${src}
	${rollup} -c

watch: ${target}
	${rollup} -c \
		--watch

${zipfile}: ${zipsources}
	mkdir -p ${modulename}

	for fn in ${zipsources}; do \
		ln -s $${fn} $${modulename}/; \
	done

	zip -r ${zipfile} \
		${modulename}


.PHONY: watch

# end
