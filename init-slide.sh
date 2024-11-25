#!/bin/bash

# 检查参数
if [ -z "$1" ]; then
    echo "Usage: ./init-slide.sh <slide-name>"
    echo "Example: ./init-slide.sh my-presentation"
    exit 1
fi

SLIDE_NAME=$1
SLIDE_DIR="slides/$SLIDE_NAME"

# 检查目录是否已存在
if [ -d "$SLIDE_DIR" ]; then
    echo "Error: Slide directory '$SLIDE_DIR' already exists"
    exit 1
fi

# 创建目录结构
echo "Creating directory structure..."
mkdir -p "$SLIDE_DIR/src"
mkdir -p "$SLIDE_DIR/site"

# 复制 Makefile
echo "Copying Makefile template..."
cp common/Makefile.template "$SLIDE_DIR/src/Makefile"

# 创建初始 main.md
echo "Creating initial main.md..."
cat > "$SLIDE_DIR/src/main.md" << EOL
# ${SLIDE_NAME}

Your First Slide

---

## Second Slide

* Point 1
* Point 2
* Point 3

---

## Thank You!

EOL

echo "Successfully created new slide: $SLIDE_DIR"
echo "You can now:"
echo "1. Edit slides/$SLIDE_NAME/src/main.md"
echo "2. Preview with: make live SLIDE=$SLIDE_NAME"
echo "3. Build with: make build-all"