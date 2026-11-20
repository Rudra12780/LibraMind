file_path = r'frontend/src/pages/BookDetails.jsx'

with open(file_path, 'r', encoding='utf-8') as f:
    code = f.read()

target = """                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <button
                      onClick={handleReturnBook}
                      disabled={returning}
                      className="btn btn-secondary btn-sm"
                      style={{
                        backgroundColor: 'var(--warm-beige)',
                        color: 'var(--forest-dark)',
                        fontWeight: 700,
                        padding: '8px 10px'
                      }}
                    >
                      {returning ? 'Returning...' : '✓ Return Book'}
                    </button>
                    <button
                      onClick={handleRenewLoan}
                      className="btn btn-outline btn-sm"
                      style={{ fontWeight: 600, padding: '8px 10px' }}
                    >
                      Renew (+14d)
                    </button>
                  </div>"""

replacement = """                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', boxSizing: 'border-box' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '8px', width: '100%', boxSizing: 'border-box' }}>
                    <button
                      onClick={handleReturnBook}
                      disabled={returning}
                      className="btn btn-secondary btn-sm"
                      style={{
                        backgroundColor: 'var(--editorial-accent)',
                        color: '#FFFFFF',
                        fontWeight: 700,
                        padding: '8px 12px',
                        minWidth: 0,
                        width: '100%',
                        whiteSpace: 'normal',
                        textAlign: 'center',
                        boxSizing: 'border-box'
                      }}
                    >
                      {returning ? 'Returning...' : '✓ Return Book'}
                    </button>
                    <button
                      onClick={handleRenewLoan}
                      className="btn btn-outline btn-sm"
                      style={{
                        fontWeight: 600,
                        padding: '8px 12px',
                        minWidth: 0,
                        width: '100%',
                        whiteSpace: 'normal',
                        textAlign: 'center',
                        boxSizing: 'border-box'
                      }}
                    >
                      Renew (+14d)
                    </button>
                  </div>"""

if target in code:
    code = code.replace(target, replacement)
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(code)
    print("Replaced successfully")
else:
    print("Target not found")
