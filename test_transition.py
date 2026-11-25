from pptx import Presentation
from pptx.oxml import parse_xml
from pptx.oxml.ns import nsdecls

prs = Presentation()
slide = prs.slides.add_slide(prs.slide_layouts[6])
trans = parse_xml(f'<p:transition {nsdecls("p")} spd="med"><p:fade/></p:transition>')
slide._element.append(trans)
prs.save('test_trans.pptx')
print("Transition test passed!")
