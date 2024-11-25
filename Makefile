.PHONY: all clean build-all deploy

SLIDES := $(wildcard slides/*/src)

all: build-all

build-all: clean
	@mkdir -p dist
	@echo "Building all slides..."
	@for slide in $(SLIDES); do \
		echo "Building $${slide}..."; \
		if ! $(MAKE) -C $${slide} build; then \
			echo "Error building $${slide}"; \
			exit 1; \
		fi \
	done
	@echo "Generating index page..."
	@node scripts/generate-index.js

clean:
	@echo "Cleaning up..."
	rm -rf dist/

serve:
	@python3 -m http.server --directory dist 8000

live:
	@if [ -z "$(SLIDE)" ]; then \
		echo "Please specify SLIDE=<slide-name>"; \
		exit 1; \
	fi
	@$(MAKE) -C slides/$(SLIDE)/src live