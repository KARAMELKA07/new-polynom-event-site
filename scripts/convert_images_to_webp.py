from __future__ import annotations

import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
PILLOW_PATH = ROOT / ".codex_tmp" / "pillow"

if PILLOW_PATH.exists():
    sys.path.insert(0, str(PILLOW_PATH))

from PIL import Image  # type: ignore  # noqa: E402


SOURCE_EXTENSIONS = {".png", ".jpg", ".jpeg"}
SKIP_SEGMENTS = {"dist", "node_modules", ".git", ".codex_tmp"}


def should_skip(path: Path) -> bool:
    return any(segment in SKIP_SEGMENTS for segment in path.parts)


def iter_images() -> list[Path]:
    found: list[Path] = []
    for folder_name in ("public", "promo"):
        folder = ROOT / folder_name
        if not folder.exists():
            continue

        for path in folder.rglob("*"):
            if (
                path.is_file()
                and path.suffix.lower() in SOURCE_EXTENSIONS
                and not should_skip(path)
            ):
                found.append(path)

    return sorted(found)


def convert_image(source: Path) -> tuple[Path, int, int]:
    target = source.with_suffix(".webp")
    before_size = source.stat().st_size

    with Image.open(source) as image:
        if image.mode not in ("RGB", "RGBA"):
            image = image.convert("RGBA" if "A" in image.getbands() else "RGB")

        save_options = {
            "format": "WEBP",
            "quality": 84,
            "method": 6,
        }
        image.save(target, **save_options)

    after_size = target.stat().st_size
    return target, before_size, after_size


def format_size(value: int) -> str:
    return f"{value / 1024:.1f} KB"


def main() -> None:
    images = iter_images()
    print(f"Found {len(images)} raster images.")

    for source in images:
        target, before_size, after_size = convert_image(source)
        print(
            f"{source.relative_to(ROOT)} -> {target.relative_to(ROOT)} "
            f"({format_size(before_size)} -> {format_size(after_size)})"
        )


if __name__ == "__main__":
    main()
