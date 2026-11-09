for fname in ['LibrarianNavbar.jsx', 'AdminNavbar.jsx']:
    p = 'frontend/src/components/' + fname
    with open(p, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    new_lines = []
    skip = False
    for line in lines:
        if 'Design Thinking PPT' in line or ('onOpenPresentation' in line and '<button' in line):
            # If button starts
            skip = True
            # if previous line was <button
            if new_lines and '<button' in new_lines[-1]:
                new_lines.pop()
            continue
        if skip:
            if '</button>' in line:
                skip = False
            continue
        new_lines.append(line)
        
    with open(p, 'w', encoding='utf-8') as f:
        f.writelines(new_lines)
    print(f"Cleaned {fname}")

