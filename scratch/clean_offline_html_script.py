with open('scripts/build_offline_html.py', 'r', encoding='utf-8') as f:
    text = f.read()

# Remove the PPT button from the offline header bar
old_btn = '''      <button class="btn-offline-dl outline" onclick="downloadPptxOffline()">
        📊 Download Presentation (.PPTX)
      </button>'''

if old_btn in text:
    text = text.replace(old_btn, '')
    with open('scripts/build_offline_html.py', 'w', encoding='utf-8') as f:
        f.write(text)
    print("Removed PPT button from build_offline_html.py")
else:
    print("Button not found, trying regex...")
    import re
    text = re.sub(r'\s*<button class="btn-offline-dl outline" onclick="downloadPptxOffline\(\)">[\s\S]*?<\/button>', '', text)
    with open('scripts/build_offline_html.py', 'w', encoding='utf-8') as f:
        f.write(text)
    print("Removed with regex!")

