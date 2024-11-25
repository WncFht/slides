.PHONY: live build clean

# 获取当前幻灯片名称
SLIDE_NAME := $(notdir $(patsubst %/src,%,$(CURDIR)))
COMMON_DIR := ../../../common

# 复制所需的资源文件
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
	@reveal-md main.md \
		--scripts https://cdn.tonycrane.cc/heti/heti.js,heti_worker.js \
		--template $(COMMON_DIR)/template.html \
		--css custom.css,dark.css \
		--static ../site \
		--assets-dir assets
	@rm -f ../site/main.html
	@mkdir -p ../site/assets
	@cp heti_worker.js ../site/assets/
	@cp custom.css ../site/assets/
	@cp dark.css ../site/assets/
	@rm -f heti_worker.js custom.css dark.css

clean:
	@echo "Cleaning up $(SLIDE_NAME)..."
	@rm -f heti_worker.js custom.css dark.css
	rm -rf ../site/