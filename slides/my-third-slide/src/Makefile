.PHONY: live build clean prepare

SLIDE_NAME := $(notdir $(patsubst %/src,%,$(CURDIR)))
COMMON_DIR := ../../../common
ROOT_DIR := ../../..
DIST_DIR := $(ROOT_DIR)/dist
BASE_URL := $(shell node -p "require('$(ROOT_DIR)/config.json').baseUrl")

prepare:
	@echo "Preparing resources for $(SLIDE_NAME)..."
	@cp $(COMMON_DIR)/heti_worker.js ./
	@cp $(COMMON_DIR)/custom.css ./
	@cp $(COMMON_DIR)/dark.css ./

live: prepare
	@echo "Previewing $(SLIDE_NAME) slides..."
	-@reveal-md main.md -w \
		--scripts https://cdn.tonycrane.cc/heti/heti.js,heti_worker.js \
		--template $(COMMON_DIR)/template.html \
		--css custom.css,dark.css \
		|| true

build: prepare
	@echo "Building $(SLIDE_NAME) slides..."
	@mkdir -p $(DIST_DIR)/$(SLIDE_NAME)
	@reveal-md main.md \
		--scripts https://cdn.tonycrane.cc/heti/heti.js,heti_worker.js \
		--template $(COMMON_DIR)/template.html \
		--css custom.css,dark.css \
		--static $(DIST_DIR)/$(SLIDE_NAME) \
		--assets-dir assets \
		--base-path $(BASE_URL)/$(SLIDE_NAME)
	@mkdir -p $(DIST_DIR)/$(SLIDE_NAME)/assets
	@cp heti_worker.js $(DIST_DIR)/$(SLIDE_NAME)/assets/
	@cp custom.css $(DIST_DIR)/$(SLIDE_NAME)/assets/
	@cp dark.css $(DIST_DIR)/$(SLIDE_NAME)/assets/
	@rm -f heti_worker.js custom.css dark.css

clean:
	@echo "Cleaning up $(SLIDE_NAME)..."
	@rm -f heti_worker.js custom.css dark.css
	@rm -rf $(DIST_DIR)/$(SLIDE_NAME)