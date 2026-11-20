import pathlib

TARGETS = {
    'frontend/src/components/AiAssistantModal.jsx': [('background: \'linear-gradient(90deg, var(--bh-red) 0% 33.3%, var(--bh-yellow) 33.3% 66.6%, var(--bh-blue) 66.6% 100%)\',',
                                                       'background: \'linear-gradient(90deg, var(--bh-red) 0 84px, var(--bh-ink) 84px 100%)\',')],
    'frontend/src/components/ProfileDropdown.jsx': [('background: \'linear-gradient(90deg, var(--bh-red) 0% 55%, var(--bh-blue) 55% 100%)\'',
                                                     'background: \'linear-gradient(90deg, var(--bh-red) 0 84px, var(--bh-ink) 84px 100%)\'')],
    'frontend/src/pages/About.jsx': [('background: \'linear-gradient(90deg, var(--bh-red) 0 84px, var(--bh-ink) 84px 100%) 0% 33.3%, var(--bh-yellow) 33.3% 66.6%, var(--bh-blue) 66.6% 100%)\'',
                                      'background: \'linear-gradient(90deg, var(--bh-red) 0 84px, var(--bh-ink) 84px 100%)\'')],
    'frontend/src/pages/LibrarianDashboard.jsx': [('background: \'linear-gradient(90deg, var(--bh-red) 0 84px, var(--bh-ink) 84px 100%) 0% 55%, var(--bh-blue) 55% 100%)\'',
                                                   'background: \'linear-gradient(90deg, var(--bh-red) 0 84px, var(--bh-ink) 84px 100%)\'')],
    'frontend/src/pages/Login.jsx': [('background: \'linear-gradient(90deg, var(--bh-red) 0 84px, var(--bh-ink) 84px 100%) 0% 55%, var(--bh-blue) 55% 100%)\'',
                                      'background: \'linear-gradient(90deg, var(--bh-red) 0 84px, var(--bh-ink) 84px 100%)\'')],
    'frontend/src/pages/ProfileCompletion.jsx': [('background: \'linear-gradient(90deg, var(--bh-red) 0 84px, var(--bh-ink) 84px 100%), var(--bh-yellow))\'',
                                                 'background: \'linear-gradient(90deg, var(--bh-red) 0 84px, var(--bh-ink) 84px 100%)\'')],
    'frontend/src/pages/Register.jsx': [('background: \'linear-gradient(90deg, var(--bh-red) 0 84px, var(--bh-ink) 84px 100%) 0% 55%, var(--bh-blue) 55% 100%)\'',
                                         'background: \'linear-gradient(90deg, var(--bh-red) 0 84px, var(--bh-ink) 84px 100%)\'')],
    'frontend/src/pages/ResetPassword.jsx': [('background: \'linear-gradient(90deg, var(--bh-red) 0 84px, var(--bh-ink) 84px 100%) 0% 55%, var(--bh-ink) 55% 100%)\'',
                                              'background: \'linear-gradient(90deg, var(--bh-red) 0 84px, var(--bh-ink) 84px 100%)\'')],
}

for path, pairs in TARGETS.items():
    p = pathlib.Path(path)
    text = p.read_text(encoding='utf-8')
    for old, new in pairs:
        if old not in text:
            print('MISS', path)
            continue
        text = text.replace(old, new)
    p.write_text(text, encoding='utf-8', newline='\n')
    print('ok', path)
