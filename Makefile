.PHONY: all clean build-all deploy

SLIDES := $(wildcard slides/*/src)

all: build-all

build-all: clean
	@mkdir -p dist
	@for slide in $(SLIDES); do \
		echo "Building $${slide}..."; \
		$(MAKE) -C $${slide} build; \
	done
	@node scripts/generate-index.js

clean:
	@echo "Cleaning up..."
	rm -rf dist/

# 本地预览
serve:
	@python3 -m http.server --directory dist 8000

# 本地预览特定幻灯片
live:
	@if [ -z "$(SLIDE)" ]; then \
		echo "Please specify SLIDE=<slide-name>"; \
		exit 1; \
	fi
	@$(MAKE) -C slides/$(SLIDE)/src live