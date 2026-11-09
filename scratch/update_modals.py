import re

# 1. Update VisualBlueprintModal.jsx
with open('frontend/src/components/VisualBlueprintModal.jsx', 'r', encoding='utf-8') as f:
    text = f.read()

target = '{/* Download All 21 ZIP Package */}'
replacement = '''{/* Open Standalone Offline Website */}
            <a
              href="/LibraMind_Offline_Website_&_Blueprints.html"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: '#FAF8F5',
                color: 'var(--editorial-accent)',
                border: '1px solid var(--editorial-accent)',
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '0.78rem',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
                textDecoration: 'none'
              }}
              title="Open standalone self-contained offline website and blueprint viewer (Works with server closed)"
            >
              🌐 Standalone Offline Website
            </a>

            {/* Download Presentation */}
            <a
              href="/LibraMind_Design_Thinking_Presentation.pptx"
              download="LibraMind_Design_Thinking_Presentation.pptx"
              style={{
                background: '#C2923D',
                color: '#14221A',
                border: 'none',
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '0.78rem',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
                textDecoration: 'none'
              }}
              title="Download Book-Themed 15-Slide Presentation (.PPTX)"
            >
              📖 Book PPT (.PPTX)
            </a>

            {/* Download All 21 ZIP Package */}'''

if target in text:
    new_text = text.replace(target, replacement, 1)
    with open('frontend/src/components/VisualBlueprintModal.jsx', 'w', encoding='utf-8') as f:
        f.write(new_text)
    print("Updated VisualBlueprintModal.jsx successfully!")
else:
    print("Target in VisualBlueprintModal.jsx not found!")

# 2. Update visualBlueprints.js downloadAllBlueprintsZIP to directly download pre-generated zip
with open('frontend/src/data/visualBlueprints.js', 'r', encoding='utf-8') as f:
    vb_text = f.read()

# Replace downloadAllBlueprintsZIP implementation with direct link
old_zip_fn_start = 'export function downloadAllBlueprintsZIP() {'
if old_zip_fn_start in vb_text:
    # We can inject direct download at beginning of function
    new_zip_fn = '''export function downloadAllBlueprintsZIP() {
  const link = document.createElement('a');
  link.href = '/LibraMind_Complete_Blueprints_Offline_Bundle.zip';
  link.download = 'LibraMind_Complete_Blueprints_Offline_Bundle.zip';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  return;
'''
    vb_text = vb_text.replace(old_zip_fn_start, new_zip_fn, 1)
    with open('frontend/src/data/visualBlueprints.js', 'w', encoding='utf-8') as f:
        f.write(vb_text)
    print("Updated downloadAllBlueprintsZIP in visualBlueprints.js!")

