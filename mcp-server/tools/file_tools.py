from pathlib import Path

EXCLUDED_FOLDERS = {".git", "node_modules", ".venv", "dist", "build"}

def is_safe_path(base_path: Path, target_path: Path):
    try:
        target_path.resolve().relative_to(base_path.resolve())
        return True
    except ValueError:
        return False

def read_file(path, base_path, max_chars = 5000):
    path = Path(path)
    base_path = Path(base_path)
    
    if not is_safe_path(base_path, path):
        raise ValueError("Unsafe path: access denied")
    if not path.is_file():
        raise FileNotFoundError("file not found")
    
    return path.read_text(encoding="utf-8", errors="ignore")[:max_chars]


def list_directory(path, base_path):
    path = Path(path)
    base_path = Path(base_path)
    
    if not is_safe_path(base_path, path):
        raise ValueError("Unsafe path access denied")
    
    items = []
    
    for item in path.iterdir():
        if item.name in EXCLUDED_FOLDERS:
            continue
        
        items.append({
            "name": item.name,
            "type": "dir" if item.is_dir() else "file"
        })
        
    return items
         

