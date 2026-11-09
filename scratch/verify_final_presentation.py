from pptx import Presentation

prs = Presentation('LibraMind_Design_Thinking_Presentation.pptx')
print(f"Total Slides: {len(prs.slides)}")
print(f"Slide Dimensions: {prs.slide_width.inches:.3f} x {prs.slide_height.inches:.3f} inches (16:9 Widescreen)")

for idx, slide in enumerate(prs.slides):
    texts = []
    for shape in slide.shapes:
        if shape.has_text_frame:
            for p in shape.text_frame.paragraphs:
                txt = p.text.strip()
                if txt and len(txt) > 3:
                    texts.append(txt[:55])
    print(f"\n--- Slide {idx+1} ({len(slide.shapes)} shapes) ---")
    for t in texts[:4]:
        print(f"   • {t}")

