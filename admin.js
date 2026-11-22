var db = null;
var allItems = [];
var editedItems = {};
var deletedItems = [];
var newItems = [];
var settings = {};
var currentTab = 'products';

var SUPABASE_URL = 'https://qcxtxuesbvuhraokyzyu.supabase.co';
var SUPABASE_KEY = 'sb_publishable_yCHUbgjbnsMNlZWlimYJQg_LlzkSpyE';

window.addEventListener('load', function() {
    if (typeof window.supabase === 'undefined') {
        document.getElementById('loginError').textContent = 'خطا: کتابخانه Supabase لود نشد.';
        return;
    }
    try {
        db = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
        console.log("✅ اتصال به دیتابیس برقرار شد");
    } catch (e) {
        document.getElementById('loginError').textContent = 'خطا در اتصال: ' + e.message;
    }
});

async function login() {
    if (!db) { document.getElementById('loginError').textContent = 'اتصال به دیتابیس برقرار نیست'; return; }
    var email = document.getElementById('email').value.trim();
    var password = document.getElementById('password').value;
    var errEl = document.getElementById('loginError');
    if (!email || !password) { errEl.textContent = 'ایمیل و رمز را وارد کنید'; return; }
    errEl.textContent = '';
    showStatus('در حال ورود...', 'loading');
    try {
        var result = await db.auth.signInWithPassword({ email: email, password: password });
        if (result.error) { errEl.textContent = 'خطا: ' + result.error.message; hideStatus(); return; }
        hideStatus();
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('adminPanel').style.display = 'block';
        document.getElementById('userEmail').textContent = email;
        loadItems();
        loadSettings();
    } catch(e) {
        hideStatus();
        errEl.textContent = 'خطای غیرمنتظره: ' + e.message;
    }
}

async function logout() {
    if (db) await db.auth.signOut();
    location.reload();
}

function switchTab(tabName, btn) {
    currentTab = tabName;
    document.querySelectorAll('.tabs button').forEach(function(b) { b.classList.remove('active'); });
    btn.classList.add('active');
    document.getElementById('tab-products').style.display = tabName === 'products' ? 'block' : 'none';
    document.getElementById('tab-settings').style.display = tabName === 'settings' ? 'block' : 'none';
}

async function loadItems() {
    showStatus('در حال بارگذاری...', 'loading');
    var result = await db.from('products').select('*').order('created_at', { ascending: false });
    if (result.error) { showStatus('خطا: ' + result.error.message, 'error'); return; }
    allItems = result.data || [];
    hideStatus();
    renderItems();
}

function renderItems() {
    var container = document.getElementById('itemsList');
    var html = '';
    var count = 0;
    for (var n = 0; n < newItems.length; n++) { count++; html += renderItemHtml('new-' + n, newItems[n]); }
    for (var i = 0; i < allItems.length; i++) {
        var item = allItems[i];
        if (deletedItems.indexOf(item.id) !== -1) continue;
        count++;
        var edited = editedItems[item.id] || item;
        html += renderItemHtml(item.id, edited);
    }
    if (count === 0) html = '<p class="empty">هنوز محصولی اضافه نشده</p>';
    container.innerHTML = html;
}

function renderItemHtml(id, item) {
    var imgPreview = '';
    if (item.image && item.image.indexOf('http') === 0) {
        imgPreview = '<img src="' + item.image + '" class="item-img-preview" onerror="this.style.display=\'none\'">';
    }
    var colorsStr = (item.colors || []).join(', ');
    return '<div class="item">' +
        '<div class="row"><div class="field"><label>نام محصول</label><input type="text" value="' + (item.name || '') + '" onchange="updateField(\'' + id + '\', \'name\', this.value)"></div></div>' +
        '<div class="row"><div class="field"><label>قیمت (تومان)</label><input type="number" value="' + (item.price || 0) + '" onchange="updateField(\'' + id + '\', \'price\', parseInt(this.value) || 0)"></div><div class="field"><label>قیمت قدیم</label><input type="number" value="' + (item.old_price || '') + '" onchange="updateField(\'' + id + '\', \'old_price\', this.value ? parseInt(this.value) : null)"></div></div>' +
        '<div class="row"><div class="field"><label>دسته‌بندی</label><select onchange="updateField(\'' + id + '\', \'category\', this.value)">' +
        '<option value="شلوار و دامن" ' + (item.category === 'شلوار و دامن' ? 'selected' : '') + '>شلوار و دامن</option>' +
        '<option value="شال و روسری" ' + (item.category === 'شال و روسری' ? 'selected' : '') + '>شال و روسری</option>' +
        '<option value="اکسسوری" ' + (item.category === 'اکسسوری' ? 'selected' : '') + '>اکسسوری</option>' +
        '<option value="دورس" ' + (item.category === 'دورس' ? 'selected' : '') + '>دورس</option>' +
        '<option value="هودی و کت" ' + (item.category === 'هودی و کت' ? 'selected' : '') + '>هودی و کت</option>' +
        '<option value="بلوز" ' + (item.category === 'بلوز' ? 'selected' : '') + '>بلوز</option>' +
        '</select></div><div class="field"><label>موجودی</label><input type="number" value="' + (item.stock || 0) + '" onchange="updateField(\'' + id + '\', \'stock\', parseInt(this.value) || 0)"></div></div>' +
        '<div class="row"><div class="field"><label>رنگ‌ها</label><input type="text" value="' + colorsStr + '" onchange="updateField(\'' + id + '\', \'colors\', this.value.split(\',\').map(function(c){return c.trim();}).filter(Boolean))"></div></div>' +
        '<div class="row"><div class="field"><label>توضیحات</label><textarea onchange="updateField(\'' + id + '\', \'description\', this.value)">' + (item.description || '') + '</textarea></div></div>' +
        '<div class="row" style="align-items:center;">' + imgPreview +
        '<input type="file" id="file-' + id + '" accept="image/*" style="display:none;" onchange="uploadImage(event, \'' + id + '\')">' +
        '<button class="upload-btn" onclick="document.getElementById(\'file-' + id + '\').click()">📷 آپلود عکس</button></div>' +
        '<div class="actions"><button class="delete-btn" onclick="deleteItem(\'' + id + '\')">🗑️ حذف</button></div>' +
        '</div>';
}

function updateField(id, field, value) {
    if (id.indexOf('new-') === 0) {
        var idx = parseInt(id.substring(4));
        newItems[idx][field] = value;
    } else {
        if (!editedItems[id]) {
            editedItems[id] = {};
            for (var i = 0; i < allItems.length; i++) {
                if (allItems[i].id == id) { editedItems[id] = Object.assign({}, allItems[i]); break; }
            }
        }
        editedItems[id][field] = value;
    }
}

function deleteItem(id) {
    if (!confirm('این محصول حذف بشه؟')) return;
    if (id.indexOf('new-') === 0) {
        var idx = parseInt(id.substring(4));
        newItems.splice(idx, 1);
    } else {
        deletedItems.push(id);
        delete editedItems[id];
    }
    renderItems();
}

function addNewItem() {
    newItems.push({ name: 'محصول جدید', price: 0, old_price: null, category: 'شلوار و دامن', stock: 1, colors: [], description: '', image: '', featured: true, active: true });
    renderItems();
}

async function uploadImage(event, itemId) {
    var file = event.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { showStatus('❌ حجم عکس بیشتر از ۵ مگابایته!', 'error'); return; }
    showStatus('⏳ در حال آپلود عکس...', 'loading');
    var ext = file.name.split('.').pop().toLowerCase();
    var fileName = 'img_' + Date.now() + '.' + ext;
    var result = await db.storage.from('hoor-images').upload(fileName, file, { cacheControl: '3600', upsert: false });
    if (result.error) { showStatus('❌ خطا: ' + result.error.message, 'error'); return; }
    var urlResult = db.storage.from('hoor-images').getPublicUrl(fileName);
    updateField(itemId, 'image', urlResult.data.publicUrl);
    showStatus('✅ عکس آپلود شد!', 'success');
    setTimeout(function() { renderItems(); }, 500);
}

async function loadSettings() {
    var result = await db.from('settings').select('*').eq('id', 1).single();
    if (result.error || !result.data) return;
    settings = result.data;
    document.getElementById('set-hero-text').value = settings.hero_text || '';
    document.getElementById('set-hero-subtitle').value = settings.hero_subtitle || '';
    document.getElementById('set-about-text').value = settings.about_text || '';
    document.getElementById('set-phone').value = settings.phone || '';
    document.getElementById('set-instagram').value = settings.instagram || '';
    document.getElementById('set-address').value = settings.address || '';
}

async function saveChanges() {
    document.getElementById('saveBtn').disabled = true;
    showStatus('⏳ در حال ذخیره...', 'loading');
    try {
        if (deletedItems.length > 0) {
            var delResult = await db.from('products').delete().in('id', deletedItems);
            if (delResult.error) throw delResult.error;
        }
        for (var id in editedItems) {
            var u = editedItems[id];
            var updResult = await db.from('products').update({
                name: u.name, price: u.price, old_price: u.old_price, category: u.category,
                stock: u.stock, colors: u.colors, description: u.description, image: u.image
            }).eq('id', id);
            if (updResult.error) throw updResult.error;
        }
        if (newItems.length > 0) {
            var insResult = await db.from('products').insert(newItems);
            if (insResult.error) throw insResult.error;
        }
        var settingsUpdate = {
            hero_text: document.getElementById('set-hero-text').value,
            hero_subtitle: document.getElementById('set-hero-subtitle').value,
            about_text: document.getElementById('set-about-text').value,
            phone: document.getElementById('set-phone').value,
            instagram: document.getElementById('set-instagram').value,
            address: document.getElementById('set-address').value
        };
        var settResult = await db.from('settings').update(settingsUpdate).eq('id', 1);
        if (settResult.error) throw settResult.error;
        editedItems = {};
        deletedItems = [];
        newItems = [];
        showStatus('✅ تغییرات ذخیره شد!', 'success');
        setTimeout(function() { loadItems(); loadSettings(); }, 1000);
    } catch (err) {
        showStatus('❌ خطا: ' + err.message, 'error');
    }
    document.getElementById('saveBtn').disabled = false;
}

function showStatus(text, type) {
    var el = document.getElementById('status');
    el.textContent = text;
    el.className = 'status ' + type;
    if (type !== 'loading') setTimeout(function() { el.className = 'status'; }, 5000);
}
function hideStatus() { document.getElementById('status').className = 'status'; }
