import re

file_path = r'c:\Users\ADMIN\Desktop\smartlib\frontend\src\pages\BookDetails.jsx'

with open(file_path, 'r', encoding='utf-8') as f:
    code = f.read()

# 1. Add borrowingCopyCode state
code = code.replace(
    "const [borrowing, setBorrowing] = useState(false);",
    "const [borrowing, setBorrowing] = useState(false);\n  const [borrowingCopyCode, setBorrowingCopyCode] = useState(null);"
)

# 2. Add real-time event listener in useEffect
old_use_effect = """  useEffect(() => {
    fetchBookDetails();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [bookId]);"""

new_use_effect = """  useEffect(() => {
    fetchBookDetails();
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const handleDataUpdate = () => {
      fetchBookDetails();
    };
    window.addEventListener('libramind:data-updated', handleDataUpdate);
    let bc;
    try {
      bc = new BroadcastChannel('libramind_sync');
      bc.onmessage = () => fetchBookDetails();
    } catch (e) {}

    return () => {
      window.removeEventListener('libramind:data-updated', handleDataUpdate);
      if (bc) bc.close();
    };
  }, [bookId]);"""

code = code.replace(old_use_effect, new_use_effect)

# 3. Update handleSelfCheckout
old_checkout = """    setBorrowing(true);
    try {
      const payload = specificCopyCode && typeof specificCopyCode === 'string' ? { copy_code: specificCopyCode } : { book_id: book.id };
      const res = await api.checkoutBook(payload);
      showToast(`Success! Checked out copy ${res.copyCode}. Due: ${new Date(res.dueDate).toLocaleDateString()}`);
      setUserLoan({
        id: res.loanId,
        due_date: res.dueDate,
        copy_code: res.copyCode,
        status: 'active'
      });
      setUserReservation(null);
      setBook(prev => prev ? ({ ...prev, available_copies: Math.max(0, prev.available_copies - 1) }) : prev);
      fetchBookDetails();
    } catch (err) {
      showToast(err.message, true);
    } finally {
      setBorrowing(false);
    }"""

new_checkout = """    setBorrowing(true);
    setBorrowingCopyCode(specificCopyCode);
    try {
      const payload = specificCopyCode && typeof specificCopyCode === 'string' ? { copy_code: specificCopyCode } : { book_id: book.id };
      const res = await api.checkoutBook(payload);
      showToast(`Success! Checked out copy ${res.copyCode}. Due: ${new Date(res.dueDate).toLocaleDateString()}`);
      setUserLoan({
        id: res.loanId,
        due_date: res.dueDate,
        copy_code: res.copyCode,
        status: 'active'
      });
      setUserReservation(null);
      setBook(prev => prev ? ({ ...prev, available_copies: Math.max(0, prev.available_copies - 1) }) : prev);
      fetchBookDetails();
      window.dispatchEvent(new CustomEvent('libramind:data-updated', { detail: { bookId: book.id } }));
      try { const bc = new BroadcastChannel('libramind_sync'); bc.postMessage({ type: 'UPDATE', bookId: book.id }); bc.close(); } catch(e){}
    } catch (err) {
      showToast(err.message, true);
    } finally {
      setBorrowing(false);
      setBorrowingCopyCode(null);
    }"""

code = code.replace(old_checkout, new_checkout)

# 4. Update handleReturnBook
old_return = """    setReturning(true);
    try {
      await api.returnBook(userLoan.id);
      showToast(`Book successfully returned! You can now borrow it again directly.`);
      setUserLoan(null);
      setBook(prev => prev ? ({ ...prev, available_copies: prev.available_copies + 1 }) : prev);
      fetchBookDetails();
    } catch (err) {
      showToast(err.message, true);
    } finally {
      setReturning(false);
    }"""

new_return = """    setReturning(true);
    try {
      await api.returnBook(userLoan.id);
      showToast(`Book successfully returned! You can now borrow it again directly.`);
      setUserLoan(null);
      setBook(prev => prev ? ({ ...prev, available_copies: prev.available_copies + 1 }) : prev);
      fetchBookDetails();
      window.dispatchEvent(new CustomEvent('libramind:data-updated', { detail: { bookId: book.id } }));
      try { const bc = new BroadcastChannel('libramind_sync'); bc.postMessage({ type: 'UPDATE', bookId: book.id }); bc.close(); } catch(e){}
    } catch (err) {
      showToast(err.message, true);
    } finally {
      setReturning(false);
    }"""

code = code.replace(old_return, new_return)

# 5. Fix button squish in Currently Borrowed By You card
old_borrowed_buttons = """                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
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

new_borrowed_buttons = """                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', boxSizing: 'border-box' }}>
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
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
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

code = code.replace(old_borrowed_buttons, new_borrowed_buttons)

# 6. Fix button squish in My Shelf & Tools (Wishlist / Compare)
old_tools_buttons = """              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                <button
                  type="button"
                  onClick={handleToggleWishlist}
                  className={`btn btn-sm ${isWishlisted ? 'btn-primary' : 'btn-outline'}`}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.80rem' }}
                >
                  <Heart size={14} fill={isWishlisted ? '#FFFFFF' : 'none'} color={isWishlisted ? '#FFFFFF' : 'currentColor'} />
                  {isWishlisted ? 'In Wishlist' : 'Wishlist'}
                </button>

                <button
                  type="button"
                  onClick={handleToggleCompare}
                  className={`btn btn-sm ${compareBookIds.includes(parseInt(book.id, 10)) || compareBookIds.includes(book.id) ? 'btn-primary' : 'btn-outline'}`}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.80rem' }}
                >
                  <GitCompare size={14} />
                  {compareBookIds.includes(parseInt(book.id, 10)) || compareBookIds.includes(book.id) ? 'In Compare' : 'Compare'}
                </button>
              </div>"""

new_tools_buttons = """              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '8px', marginBottom: '8px', width: '100%', boxSizing: 'border-box' }}>
                <button
                  type="button"
                  onClick={handleToggleWishlist}
                  className={`btn btn-sm ${isWishlisted ? 'btn-primary' : 'btn-outline'}`}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.80rem', width: '100%', minWidth: 0, whiteSpace: 'normal', textAlign: 'center', boxSizing: 'border-box' }}
                >
                  <Heart size={14} fill={isWishlisted ? '#FFFFFF' : 'none'} color={isWishlisted ? '#FFFFFF' : 'currentColor'} />
                  {isWishlisted ? 'In Wishlist' : 'Wishlist'}
                </button>

                <button
                  type="button"
                  onClick={handleToggleCompare}
                  className={`btn btn-sm ${compareBookIds.includes(parseInt(book.id, 10)) || compareBookIds.includes(book.id) ? 'btn-primary' : 'btn-outline'}`}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.80rem', width: '100%', minWidth: 0, whiteSpace: 'normal', textAlign: 'center', boxSizing: 'border-box' }}
                >
                  <GitCompare size={14} />
                  {compareBookIds.includes(parseInt(book.id, 10)) || compareBookIds.includes(book.id) ? 'In Compare' : 'Compare'}
                </button>
              </div>"""

code = code.replace(old_tools_buttons, new_tools_buttons)

# 7. Update copy table borrow button to check borrowingCopyCode
old_copy_borrow = """                              <button
                                type="button"
                                onClick={() => handleSelfCheckout(copy.copy_code)}
                                disabled={borrowing || Boolean(penaltyStatus?.isBlocked)}
                                className="btn btn-primary btn-sm"
                                style={{ fontSize: '0.75rem', padding: '4px 10px' }}
                                title={penaltyStatus?.isBlocked ? 'Account hold active due to unpaid penalty' : 'Check out this physical copy'}
                              >
                                {borrowing ? 'Checking out...' : 'Borrow Copy'}
                              </button>"""

new_copy_borrow = """                              <button
                                type="button"
                                onClick={() => handleSelfCheckout(copy.copy_code)}
                                disabled={borrowing || Boolean(penaltyStatus?.isBlocked)}
                                className="btn btn-primary btn-sm"
                                style={{ fontSize: '0.75rem', padding: '4px 10px', minWidth: '95px' }}
                                title={penaltyStatus?.isBlocked ? 'Account hold active due to unpaid penalty' : 'Check out this physical copy'}
                              >
                                {Boolean(borrowing && borrowingCopyCode === copy.copy_code) ? 'Checking out...' : 'Borrow Copy'}
                              </button>"""

code = code.replace(old_copy_borrow, new_copy_borrow)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(code)

print("Updated BookDetails.jsx successfully")
