import pathlib
p = pathlib.Path('frontend/src/pages/LibrarianDashboard.jsx')
text = p.read_text(encoding='utf-8')
needle = '                                 <span></span>\n                                 <span>{dateInfo.dateStr}</span>'
print(text.count(needle))
text = text.replace(needle, '                                 <span>{dateInfo.dateStr}</span>')
p.write_text(text, encoding='utf-8', newline='\n')
