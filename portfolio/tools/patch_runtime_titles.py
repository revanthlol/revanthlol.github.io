#!/usr/bin/env python3
"""
patch_runtime_titles.py

Patches the Framer client-side runtime metadata chunks so that hydrated document.title
matches the static HTML title for each route:
  - /          -> "Revanth | Student and open source developer"
  - /projects/ -> "Projects | Revanth"
  - /contact/  -> "Connect | Revanth"

Follows exact-string replacement with assertions and logging.
"""

from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

def patch_file(rel_path: str, search: str, replace: str, expected_count: int = 1):
    file_path = ROOT / rel_path
    assert file_path.is_file(), f"Target file not found: {file_path}"
    content = file_path.read_text(encoding="utf-8")
    count = content.count(search)
    assert count == expected_count, (
        f"Expected {expected_count} occurrence(s) of '{search}' in {rel_path}, found {count}"
    )
    patched = content.replace(search, replace)
    file_path.write_text(patched, encoding="utf-8")
    print(f"PASS: Patched {rel_path} ({count} occurrence replaced)")

def main():
    print("Running patch_runtime_titles.py...")

    # 1. Base shared library template default title in efb987...
    patch_file(
        "assets/framerusercontent.com/efb987c2109a668f4db230e4.mjs",
        "title:`Revanth - Minimalistic Portfolio Template`",
        "title:`Revanth | Student and open source developer`",
        expected_count=1
    )

    # 2. Home page route metadata chunk b82ba...
    patch_file(
        "assets/framerusercontent.com/b82ba147541aff3243efe779.mjs",
        "title:t(e,n).title||`Home`",
        "title:`Revanth | Student and open source developer`",
        expected_count=1
    )

    # 3. Projects page route metadata chunk d00f...
    patch_file(
        "assets/framerusercontent.com/d00f6f1e5f059f8bdfffc38f.mjs",
        "title:`Projects`",
        "title:`Projects | Revanth`",
        expected_count=1
    )

    # 4. Contact page route metadata chunk 38cc...
    patch_file(
        "assets/framerusercontent.com/38ccd7021df5669847bf3cb5.mjs",
        "title:t(e,n).title||`Contact`",
        "title:`Connect | Revanth`",
        expected_count=1
    )

    print("Successfully patched all runtime title metadata chunks.")

if __name__ == "__main__":
    main()
