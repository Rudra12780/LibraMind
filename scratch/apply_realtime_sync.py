import re

# 1. Update Catalog.jsx
catalog_path = r'c:\Users\ADMIN\Desktop\smartlib\frontend\src\pages\Catalog.jsx'
with open(catalog_path, 'r', encoding='utf-8') as f:
    cat_code = f.read()

old_cat_hook = """  useEffect(() => {
    fetchWishlist();
    fetchUserLoans();
  }, [fetchWishlist, fetchUserLoans]);"""

new_cat_hook = """  useEffect(() => {
    fetchWishlist();
    fetchUserLoans();

    const handleDataUpdate = () => {
      fetchBooks();
      fetchUserLoans();
      fetchWishlist();
    };
    window.addEventListener('libramind:data-updated', handleDataUpdate);
    let bc;
    try {
      bc = new BroadcastChannel('libramind_sync');
      bc.onmessage = () => {
        fetchBooks();
        fetchUserLoans();
        fetchWishlist();
      };
    } catch (e) {}

    return () => {
      window.removeEventListener('libramind:data-updated', handleDataUpdate);
      if (bc) bc.close();
    };
  }, [fetchBooks, fetchWishlist, fetchUserLoans]);"""

cat_code = cat_code.replace(old_cat_hook, new_cat_hook)

with open(catalog_path, 'w', encoding='utf-8') as f:
    f.write(cat_code)
print("Updated Catalog.jsx with realtime sync")

# 2. Update StudentDashboard.jsx
dash_path = r'c:\Users\ADMIN\Desktop\smartlib\frontend\src\pages\StudentDashboard.jsx'
with open(dash_path, 'r', encoding='utf-8') as f:
    dash_code = f.read()

old_dash_hook = """  useEffect(() => {
    fetchData();
  }, [fetchData]);"""

new_dash_hook = """  useEffect(() => {
    fetchData();

    const handleDataUpdate = () => {
      fetchData();
    };
    window.addEventListener('libramind:data-updated', handleDataUpdate);
    let bc;
    try {
      bc = new BroadcastChannel('libramind_sync');
      bc.onmessage = () => fetchData();
    } catch (e) {}

    return () => {
      window.removeEventListener('libramind:data-updated', handleDataUpdate);
      if (bc) bc.close();
    };
  }, [fetchData]);"""

dash_code = dash_code.replace(old_dash_hook, new_dash_hook)

old_return_finish = """      setReturnModalLoan(null);
      showToast({
        title: 'Volume Returned Successfully',
        msg: 'Thank you for returning the physical copy to circulation.',
        isError: false
      });
      fetchData();"""

new_return_finish = """      setReturnModalLoan(null);
      showToast({
        title: 'Volume Returned Successfully',
        msg: 'Thank you for returning the physical copy to circulation.',
        isError: false
      });
      fetchData();
      window.dispatchEvent(new CustomEvent('libramind:data-updated'));
      try { const bc = new BroadcastChannel('libramind_sync'); bc.postMessage({ type: 'UPDATE' }); bc.close(); } catch(e){}"""

dash_code = dash_code.replace(old_return_finish, new_return_finish)

with open(dash_path, 'w', encoding='utf-8') as f:
    f.write(dash_code)
print("Updated StudentDashboard.jsx with realtime sync")
