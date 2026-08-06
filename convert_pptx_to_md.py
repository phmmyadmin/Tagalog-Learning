#!/usr/bin/env python3
"""
Script to convert all PPTX files in pptx_sources/ to Markdown (.md) in md_sources/
using the pptx2md tool.
"""

import os
import subprocess
import sys
from pathlib import Path

def convert_pptx_to_md(src_dir="pptx_sources", dst_dir="md_sources"):
    base_dir = Path(__file__).parent.resolve()
    pptx_folder = base_dir / src_dir
    md_folder = base_dir / dst_dir

    if not pptx_folder.exists():
        print(f"Error: Directory '{src_dir}' does not exist.")
        sys.exit(1)

    md_folder.mkdir(parents=True, exist_ok=True)

    pptx_files = sorted(list(pptx_folder.glob("*.pptx")))
    if not pptx_files:
        print(f"No .pptx files found in '{src_dir}'.")
        return

    print(f"Found {len(pptx_files)} PPTX file(s) to convert.\n")

    for pptx_file in pptx_files:
        md_file_name = f"{pptx_file.stem}.md"
        md_file_path = md_folder / md_file_name
        img_dir = md_folder / "img" / pptx_file.stem

        print(f"Converting: {pptx_file.name} -> {md_file_name}...")

        cmd = [
            "pptx2md",
            str(pptx_file),
            "-o", str(md_file_path),
            "-i", str(img_dir)
        ]

        try:
            result = subprocess.run(cmd, check=True, capture_output=True, text=True)
            print(f"  ✓ Successfully converted to {md_file_path.relative_to(base_dir)}")
        except subprocess.CalledProcessError as e:
            print(f"  ✗ Error converting {pptx_file.name}:")
            print(e.stderr)
        except FileNotFoundError:
            print("  ✗ Error: 'pptx2md' command not found. Make sure pptx2md is installed and in your PATH.")
            sys.exit(1)

    print("\nAll conversions completed!")

if __name__ == "__main__":
    convert_pptx_to_md()
