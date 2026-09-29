"""Create a deterministic, dependency-free developer-preview ZIP."""
from pathlib import Path
from io import BytesIO
from zipfile import ZipFile, ZipInfo, ZIP_STORED
import sys

root = Path(__file__).resolve().parent
files = ['background.js', 'manifest.json', 'model.js', 'panel.css', 'panel.html', 'panel.js']
buffer = BytesIO()
with ZipFile(buffer, 'w', compression=ZIP_STORED) as archive:
    for name in sorted(files):
        info = ZipInfo(name, (2026, 1, 1, 0, 0, 0))
        info.external_attr = 0o644 << 16
        info.create_system = 3
        archive.writestr(info, (root / 'unpacked' / name).read_text(encoding='utf-8').replace('\r\n', '\n').encode('utf-8'))
target = root.parent / 'frontend' / 'public' / 'downloads' / 'socratescode-chrome.zip'
if '--check' in sys.argv:
    if not target.exists() or target.read_bytes() != buffer.getvalue():
        raise SystemExit('Extension ZIP is stale. Run node extension/build.mjs and python extension/package.py.')
    print('Extension ZIP matches the checked source.')
else:
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_bytes(buffer.getvalue())
    print(target)
