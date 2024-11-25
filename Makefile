.PHONY: help list preview serve build build-all clean clean-all

# 默认目标：显示帮助信息
.DEFAULT_GOAL := help

# 获取所有幻灯片目录
SLIDES := $(wildcard slides/*)
SLIDE_NAMES := $(notdir $(SLIDES))

# 帮助信息
help:
	@echo "Slides Management Commands:"
	@echo ""
	@echo "Preview Commands:"
	@echo "  make preview SLIDE=name  - Preview a specific slide (live reload)"
	@echo "  make serve               - Serve built slides locally"
	@echo ""
	@echo "Build Commands:"
	@echo "  make build SLIDE=name    - Build a specific slide"
	@echo "  make build-all           - Build all slides"
	@echo ""
	@echo "Clean Commands:"
	@echo "  make clean SLIDE=name    - Clean specific slide's build"
	@echo "  make clean-all           - Clean all built files"
	@echo ""
	@echo "Info Commands:"
	@echo "  make list                - List all available slides"
	@echo "  make help                - Show this help message"
	@echo ""
	@echo "Example:"
	@echo "  make preview SLIDE=my-slide"

# 列出所有幻灯片
list:
	@if [ -z "$(SLIDE_NAMES)" ]; then \
		echo "No slides found. Create one with ./scripts/init-slide.sh <name>"; \
	else \
		echo "Available slides:"; \
		for slide in $(SLIDE_NAMES); do \
			echo "  - $$slide"; \
		done; \
	fi

# 预览特定幻灯片
preview:
	@if [ -z "$(SLIDE)" ]; then \
		echo "Error: SLIDE parameter is required"; \
		echo "Usage: make preview SLIDE=<name>"; \
		echo "Available slides:"; \
		for slide in $(SLIDE_NAMES); do \
			echo "  - $$slide"; \
		done; \
		exit 1; \
	fi
	@if [ ! -d "slides/$(SLIDE)/src" ]; then \
		echo "Error: Slide '$(SLIDE)' not found"; \
		echo "Available slides:"; \
		for slide in $(SLIDE_NAMES); do \
			echo "  - $$slide"; \
		done; \
		exit 1; \
	fi
	@echo "Previewing $(SLIDE)..."
	@$(MAKE) -C slides/$(SLIDE)/src live

# 构建特定幻灯片
build:
	@if [ -z "$(SLIDE)" ]; then \
		echo "Error: SLIDE parameter is required"; \
		echo "Usage: make build SLIDE=<name>"; \
		echo "Available slides:"; \
		for slide in $(SLIDE_NAMES); do \
			echo "  - $$slide"; \
		done; \
		exit 1; \
	fi
	@if [ ! -d "slides/$(SLIDE)/src" ]; then \
		echo "Error: Slide '$(SLIDE)' not found"; \
		exit 1; \
	fi
	@echo "Building $(SLIDE)..."
	@mkdir -p dist
	@$(MAKE) -C slides/$(SLIDE)/src build
	@node scripts/generate-index.js

# 构建所有幻灯片
build-all:
	@echo "Building all slides..."
	@mkdir -p dist
	@for slide in $(SLIDES); do \
		echo "Building $$(basename $$slide)..."; \
		$(MAKE) -C $$slide/src build || exit 1; \
	done
	@node scripts/generate-index.js
	@echo "Build complete. Use 'make serve' to preview."

# 清理特定幻灯片的构建
clean:
	@if [ -z "$(SLIDE)" ]; then \
		echo "Error: SLIDE parameter is required"; \
		echo "Usage: make clean SLIDE=<name>"; \
		exit 1; \
	fi
	@if [ ! -d "slides/$(SLIDE)/src" ]; then \
		echo "Error: Slide '$(SLIDE)' not found"; \
		exit 1; \
	fi
	@echo "Cleaning $(SLIDE)..."
	@$(MAKE) -C slides/$(SLIDE)/src clean

# 清理所有构建文件
clean-all:
	@echo "Cleaning all built files..."
	@rm -rf dist
	@for slide in $(SLIDES); do \
		echo "Cleaning $$(basename $$slide)..."; \
		$(MAKE) -C $$slide/src clean; \
	done

# 本地预览构建结果
serve:
	@if [ ! -d "dist" ]; then \
		echo "Error: No built slides found. Run 'make build-all' first."; \
		exit 1; \
	fi
	@echo "Starting local server at http://localhost:8000"
	@python3 -m http.server --directory dist 8000 || \
		(echo "Failed to start Python server. Trying Node..."; \
		npx http-server dist -p 8000)