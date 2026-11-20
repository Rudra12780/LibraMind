from pathlib import Path

path = Path(__file__).resolve().parents[1] / 'frontend' / 'src' / 'components' / 'ThemeToggle.jsx'
text = path.read_text(encoding='utf-8')
text = text.replace("'1.5px solid #00f0ff'", "'2px solid var(--bauhaus-red)'")
text = text.replace("'rgba(19, 9, 43, 0.7)'", "'var(--bauhaus-red-light)'")
text = text.replace("'#00f0ff'", "'var(--bauhaus-red)'")
text = text.replace("'0 0 12px rgba(0, 240, 255, 0.35), 0 0 2px rgba(255, 0, 127, 0.5)'", "'var(--shadow-sm)'")
text = text.replace('color="#ff007f"', 'color="var(--bauhaus-blue)"')
text = text.replace("'20px'", "'2px'")
text = text.replace('🍄 Psychedelic', 'Bauhaus Grid')
text = text.replace('📜 Classic', 'Bauhaus Grid')
path.write_text(text, encoding='utf-8')
print('ThemeToggle normalized to Bauhaus tokens')
