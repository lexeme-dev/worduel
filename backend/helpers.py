import os
from pathlib import Path


def get_full_path(relative_project_path):
    return os.path.join(Path(__file__).parent, relative_project_path)
