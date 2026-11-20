import os
import subprocess
import shutil

REPO_ROOT = r'c:\Users\ADMIN\Desktop\smartlib'
COMMIT = 'f67edcf'

def run_git_show(path):
    cmd = ['git', 'show', f'{COMMIT}:{path}']
    res = subprocess.run(cmd, cwd=REPO_ROOT, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    if res.returncode != 0:
        raise RuntimeError(f"Failed to get {path} from {COMMIT}: {res.stderr.decode('utf-8', errors='ignore')}")
    return res.stdout

def main():
    # 1. Get all files in frontend at COMMIT
    cmd = ['git', 'ls-tree', '-r', '--name-only', COMMIT, 'frontend']
    res = subprocess.run(cmd, cwd=REPO_ROOT, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    all_files = [line.strip() for line in res.stdout.splitlines() if line.strip()]
    
    print(f"Restoring {len(all_files)} files from {COMMIT}...")
    for f in all_files:
        full_path = os.path.join(REPO_ROOT, f)
        os.makedirs(os.path.dirname(full_path), exist_ok=True)
        content = run_git_show(f)
        with open(full_path, 'wb') as out_f:
            out_f.write(content)
            
    print("Files restored successfully.")
    
    # 2. Clean up untracked Bauhaus/Swiss extras in frontend/src
    untracked_to_remove = [
        r'frontend\src\components\DashboardSidebar.jsx',
        r'frontend\src\components\InterestCategorySelector.jsx',
        r'frontend\src\components\ProfileDropdown.jsx',
        r'frontend\src\components\ThemeToggle.jsx',
        r'frontend\src\context\ThemeContext.jsx',
        r'frontend\src\data\interestCategories.js',
    ]
    for rel_path in untracked_to_remove:
        p = os.path.join(REPO_ROOT, rel_path)
        if os.path.exists(p):
            os.remove(p)
            print(f"Removed untracked extra: {rel_path}")
            
    styles_dir = os.path.join(REPO_ROOT, r'frontend\src\styles')
    if os.path.exists(styles_dir):
        shutil.rmtree(styles_dir)
        print("Removed frontend/src/styles directory")

if __name__ == '__main__':
    main()
