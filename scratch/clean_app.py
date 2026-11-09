import re

with open('frontend/src/App.jsx', 'r', encoding='utf-8') as f:
    text = f.read()

# Replace import
text = text.replace("import PresentationModal from './components/PresentationModal';", "// PresentationModal removed per user request")

# Remove JSX
text = re.sub(r'\{\/\* 15-Slide Design Thinking Presentation Download Modal \*\/\}\s*<PresentationModal[\s\S]*?\/>', '', text)

# Neutralize handleOpenPresentation
text = text.replace("setPresentationModalOpen(true);", "// disabled per user request")

with open('frontend/src/App.jsx', 'w', encoding='utf-8') as f:
    f.write(text)

print("Cleaned App.jsx successfully!")

