#!/bin/bash
# Script to convert all PPTX files in pptx_sources/ to Markdown (.md) in md_sources/ using pptx2md

SRC_DIR="pptx_sources"
DST_DIR="md_sources"

# Ensure destination directory exists
mkdir -p "$DST_DIR"

# Check if pptx_sources directory exists
if [ ! -d "$SRC_DIR" ]; then
    echo "Error: Directory '$SRC_DIR' does not exist."
    exit 1
fi

# Count PPTX files
pptx_count=$(find "$SRC_DIR" -maxdepth 1 -name "*.pptx" | wc -l | tr -d ' ')

if [ "$pptx_count" -eq 0 ]; then
    echo "No .pptx files found in '$SRC_DIR'."
    exit 0
fi

echo "Found $pptx_count PPTX file(s) to convert."
echo ""

for file in "$SRC_DIR"/*.pptx; do
    [ -e "$file" ] || continue
    filename=$(basename "$file" .pptx)
    output_md="$DST_DIR/${filename}.md"
    img_dir="$DST_DIR/img/${filename}"

    echo "Converting: $file -> $output_md..."
    pptx2md "$file" -o "$output_md" -i "$img_dir"
    if [ $? -eq 0 ]; then
        echo "  ✓ Successfully converted to $output_md"
    else
        echo "  ✗ Error converting $file"
    fi
done

echo ""
echo "All conversions completed!"
