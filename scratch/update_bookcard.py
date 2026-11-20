import re

file_path = r'c:\Users\ADMIN\Desktop\smartlib\frontend\src\components\BookCard.jsx'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the Action Bar section
old_action_bar_pattern = re.compile(
    r'(\s*\{\s*/\*\s*──\s*Editorial Action Bar.*?\*/\s*\}.*?)(<div style=\{\{ marginTop: \'10px\' \}\}>.*?</article>)',
    re.DOTALL
)

replacement_jsx = """        {/* ── Editorial Action Bar (Explore / Reserve / Manage) ── */}
        <div style={{ marginTop: '10px' }}>
          {isBorrowedByUser ? (
            <div style={{ display: 'grid', gridTemplateColumns: onReturn ? '1fr 1fr' : '1fr', gap: '8px' }}>
              {onReturn ? (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onReturn(book);
                  }}
                  className="btn btn-secondary btn-sm"
                  style={{
                    fontSize: '0.76rem',
                    padding: '6px 10px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '5px'
                  }}
                  title="Return this copy"
                >
                  <RotateCcw size={13} strokeWidth={2.2} />
                  <span>Return Copy</span>
                </button>
              ) : null}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onViewDetails && onViewDetails(book.id);
                }}
                className="btn btn-outline btn-sm"
                style={{ fontSize: '0.76rem', padding: '6px 10px' }}
              >
                Explore →
              </button>
            </div>
          ) : isAvailable ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '8px' }}>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onViewDetails && onViewDetails(book.id);
                }}
                className="btn btn-primary btn-sm"
                style={{
                  fontSize: '0.82rem',
                  padding: '7px 14px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  width: '100%'
                }}
              >
                <BookOpen size={14} strokeWidth={2.2} />
                <span>Explore</span>
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: onReserve ? '1fr 1fr' : '1fr', gap: '8px' }}>
              {onReserve && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onReserve(book.id);
                  }}
                  className="btn btn-secondary btn-sm"
                  style={{
                    fontSize: '0.78rem',
                    padding: '6px 12px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <Bookmark size={13} strokeWidth={2.2} />
                  <span>Join Waiting List</span>
                </button>
              )}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onViewDetails && onViewDetails(book.id);
                }}
                className="btn btn-outline btn-sm"
                style={{ fontSize: '0.78rem', padding: '6px 12px', width: '100%' }}
              >
                Explore →
              </button>
            </div>
          )}
        </div>
      </div>
    </article>"""

new_content = old_action_bar_pattern.sub(replacement_jsx, content)

if new_content == content:
    print("Pattern did not match, trying substring replacement")
    # Substring approach
    idx = content.find("Editorial Action Bar")
    if idx != -1:
        start_idx = content.rfind("{/*", 0, idx)
        end_idx = content.find("</article>", idx) + len("</article>")
        new_content = content[:start_idx] + replacement_jsx + content[end_idx:]

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Updated BookCard.jsx successfully")
