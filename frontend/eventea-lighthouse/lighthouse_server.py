from __future__ import annotations

import gzip
import os
from datetime import datetime, timezone
from email.utils import formatdate, parsedate_to_datetime
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from io import BytesIO
from pathlib import Path


ROOT = Path(__file__).resolve().parent
HOST = "127.0.0.1"
PORT = int(os.environ.get("PORT", "8766"))


class LighthouseHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def send_head(self):
        self._gzip_response = False
        request_path = Path(self.translate_path(self.path))
        if request_path.is_dir():
            for index_name in ("index.html", "EVENTEA.html"):
                index_path = request_path / index_name
                if index_path.is_file():
                    request_path = index_path
                    break
            else:
                self.send_error(404, "No index page exists in this directory.")
                return None

        if not request_path.is_file():
            self.send_error(404, "File not found.")
            return None

        try:
            stat = request_path.stat()
            body = request_path.read_bytes()
        except OSError:
            self.send_error(404, "File not found.")
            return None

        modified = formatdate(stat.st_mtime, usegmt=True)
        if self._not_modified_since(modified):
            self.send_response(304)
            self._add_common_headers(request_path, modified)
            self.end_headers()
            return None

        content_type = self.guess_type(str(request_path))
        if request_path.suffix.lower() == ".webp":
            content_type = "image/webp"

        compressible = (
            content_type.startswith("text/")
            or content_type in {"application/javascript", "application/json", "image/svg+xml"}
        )
        if compressible and len(body) >= 512 and self._accepts_gzip():
            compressed = gzip.compress(body, compresslevel=6, mtime=0)
            if len(compressed) < len(body):
                body = compressed
                self._gzip_response = True

        self.send_response(200)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(len(body)))
        self._add_common_headers(request_path, modified)
        if getattr(self, "_gzip_response", False):
            self.send_header("Content-Encoding", "gzip")
        self.end_headers()
        return BytesIO(body)

    def _add_common_headers(self, path: Path, modified: str) -> None:
        self.send_header("Last-Modified", modified)
        self.send_header("Vary", "Accept-Encoding")
        if path.suffix.lower() == ".html":
            self.send_header("Cache-Control", "no-cache, must-revalidate")
        elif path.is_relative_to(ROOT / "assets") or path.suffix.lower() in {".css", ".js", ".svg"}:
            self.send_header("Cache-Control", "public, max-age=2592000")

    def _accepts_gzip(self) -> bool:
        for encoding in self.headers.get("Accept-Encoding", "").split(","):
            name, *parameters = encoding.strip().lower().split(";")
            if name == "gzip" and not any(parameter.strip() == "q=0" for parameter in parameters):
                return True
        return False

    def _not_modified_since(self, modified: str) -> bool:
        value = self.headers.get("If-Modified-Since")
        if not value:
            return False
        try:
            request_date = parsedate_to_datetime(value)
            file_date = datetime.fromtimestamp(
                parsedate_to_datetime(modified).timestamp(), tz=timezone.utc
            )
            return request_date.replace(microsecond=0) >= file_date
        except (TypeError, ValueError, OverflowError):
            return False

    def log_message(self, format_string: str, *args) -> None:
        print(f"{self.log_date_time_string()} {format_string % args}")


if __name__ == "__main__":
    with ThreadingHTTPServer((HOST, PORT), LighthouseHandler) as server:
        print(f"EVENTA listo para Lighthouse en http://{HOST}:{PORT}/")
        try:
            server.serve_forever()
        except KeyboardInterrupt:
            print("\nServidor detenido.")
