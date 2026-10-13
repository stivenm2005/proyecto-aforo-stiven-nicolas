import hashlib
import re
from pathlib import Path

from rcssmin import cssmin
from rjsmin import jsmin


ROOT = Path(__file__).resolve().parent


def write_minified(source_name: str, output_name: str, minifier) -> None:
    source = ROOT / source_name
    output = ROOT / output_name
    original = source.read_text(encoding="utf-8")
    minified = minifier(original)
    output.write_text(minified, encoding="utf-8")
    saved = len(original.encode("utf-8")) - len(minified.encode("utf-8"))
    print(f"{output_name}: {saved:,} bytes saved")


if __name__ == "__main__":
    write_minified("styles.css", "styles.min.css", cssmin)
    write_minified("script.js", "script.min.js", jsmin)
    styles_hash = hashlib.sha256((ROOT / "styles.min.css").read_bytes()).hexdigest()[:12]
    script_hash = hashlib.sha256((ROOT / "script.min.js").read_bytes()).hexdigest()[:12]
    html_path = ROOT / "index.html"
    html = html_path.read_text(encoding="utf-8")
    html = re.sub(
        r'(?<=href=")styles\.min\.css(?:\?v=[^"]*)?(?=")',
        f"styles.min.css?v={styles_hash}",
        html,
    )
    html = re.sub(
        r'(?<=src=")script\.min\.js(?:\?v=[^"]*)?(?=")',
        f"script.min.js?v={script_hash}",
        html,
    )
    html_path.write_text(html, encoding="utf-8")
    (ROOT / "EVENTEA.html").write_text(html, encoding="utf-8")
