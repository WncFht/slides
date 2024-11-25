.PHONY: preview

# 预览特定幻灯片
preview:
	@if [ -z "$(SLIDE)" ]; then \
		echo "Usage: make preview SLIDE=<slide-name>"; \
		echo "Example: make preview SLIDE=test-slide"; \
		exit 1; \
	fi
	@if [ ! -d "slides/$(SLIDE)/src" ]; then \
		echo "Error: Slide '$(SLIDE)' not found"; \
		echo "Available slides:"; \
		ls slides/; \
		exit 1; \
	fi
	@echo "Previewing $(SLIDE)..."
	@$(MAKE) -C slides/$(SLIDE)/src live