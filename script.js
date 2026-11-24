/* eslint-disable */
// @ts-nocheck

// ===== SLIDER =====
var currentSlide = 0;
var sliderWrapper = document.getElementById('sliderWrapper');
var slidesCount = sliderWrapper ? sliderWrapper.children.length : 0;
var sliderInterval = null;

function updateDots() {
    var dotsContainer = document.getElementById('sliderDots');
    if (!dotsContainer) return;
    var html = '';
    for (var i = 0; i < slidesCount; i++) {
        html += '<span class="' + (i === currentSlide ? 'active' : '') + '" onclick="goToSlide(' + i + ')"></span>';
    }
    dotsContainer.innerHTML = html;
}
function goToSlide(index) {
    if (!sliderWrapper || !slidesCount) return;
    currentSlide = index;
    sliderWrapper.style.transform = 'translateX(' + (currentSlide * 100) + '%)';
    updateDots();
    resetSliderTimer();
}
function slideNext() {
    if (!sliderWrapper || !slidesCount) return;
    currentSlide = (currentSlide + 1) % slidesCount;
    sliderWrapper.style.transform = 'translateX(' + (currentSlide * 100) + '%)';
    updateDots();
    resetSliderTimer();
}
function slidePrev() {
    if (!sliderWrapper || !slidesCount) return;
    currentSlide = (currentSlide - 1 + slidesCount) % slidesCount;
    sliderWrapper.style.transform = 'translateX(' + (currentSlide * 100) + '%)';
    updateDots();
    resetSliderTimer();
}
function startSliderTimer() {
    if (!slidesCount) return;
    clearInterval(sliderInterval);
    sliderInterval = setInterval(function() {
        currentSlide = (currentSlide + 1) % slidesCount;
        sliderWrapper.style.transform = 'translateX(' + (currentSlide * 100) + '%)';
        updateDots();
    }, 5000);
}
function resetSliderTimer() {
    clearInterval(sliderInterval);
    startSliderTimer();
}

// ===== LANDING =====
function goToShop() {
    var landing = document.getElementById('landing-page');
    if (!landing) return;
    landing.classList.add('hide');
    setTimeout(function() {
        landing.style.display = 'none';
    }, 600);
}

// ===== MENU =====
function toggleMenu() {
    var menu = document.getElementById('sideMenu');
    var overlay = document.getElementById('menuOverlay');
    if (menu) menu.classList.toggle('show');
    if (overlay) overlay.classList.toggle('show');
}

// ===== MODALS =====
function openModal(id) {
    var el = document.getElementById(id);
    if (el) el.classList.add('show');
}
function closeModal(id) {
    var el = document.getElementById(id);
    if (el) el.classList.remove('show');
}
function openCart() {
    openModal('cartModal');
    renderCartItems();
}

// ===== SUB PAGES =====
function openPage(pageId) {
    var menu = document.getElementById('sideMenu');
    if (menu && menu.classList.contains('show')) toggleMenu();

    document.querySelectorAll('.sub-page').forEach(function(p) {
        p.classList.remove('show');
    });

    var page = document.getElementById(pageId);
    if (page) {
        page.classList.add('show');
        document.body.style.overflow = 'hidden';
        page.scrollTop = 0;
    }

    if (pageId === 'userPage') checkUserLogin();
    if (pageId === 'favoritesPage') renderFavoritesPage();
}
function closePage(pageId) {
    var page = document.getElementById(pageId);
    if (page) page.classList.remove('show');
    document.body.style.overflow = '';
}

function openUserAccount() { openPage('userPage'); }
function openOrders() { openPage('ordersPage'); }
function openFavorites() { openPage('favoritesPage'); }
function openContact() { openPage('contactPage'); }
function openAbout() { openPage('aboutPage'); }

function openInstagram() {
    var menu = document.getElementById('sideMenu');
    if (menu && menu.classList.contains('show')) toggleMenu();

    var msg = '⚠️ برای دیدن پیج اینستاگرام، لطفاً ابتدا وی‌پی‌ان (VPN) خود را روشن کنید.\n\nآیا VPN شما روشن است؟';
    if (confirm(msg)) window.location.href = 'https://instagram.com/Hoor_collectioon';
}
function openPortfolio() {
    if (confirm('برای دیدن نمونه‌کارهای بیشتر به پیج ما مراجعه کنید:\n@mbin.tech\n\nآیا می‌خواهید باز شود؟')) {
        window.location.href = 'https://instagram.com/mbin.tech';
    }
}

// ===== TEMP DATA =====
var tempCategories = [
    { id: 1, name: 'شلوار و دامن', icon: 'cat-shlvar.png' },
    { id: 2, name: 'شال و روسری', icon: 'cat-shal.png' },
    { id: 3, name: 'اکسسوری', icon: 'cat-aksessory.png' },
    { id: 4, name: 'دورس', icon: 'cat-doores.png' },
    { id: 5, name: 'هودی و کت', icon: 'cat-hoody.png' },
    { id: 6, name: 'بلوز', icon: 'cat-bloooz.png' }
];

var tempProducts = [];
var currentFilter = 'all';
var cart = JSON.parse(localStorage.getItem('hoor_cart')) || [];
var favorites = JSON.parse(localStorage.getItem('hoor_favorites')) || [];

// ===== PRODUCTS FROM SUPABASE =====
async function loadProductsFromSupabase() {
    try {
        const { data, error } = await db
            .from('products')
            .select('*')
            .eq('active', true)
            .order('created_at', { ascending: false });

        if (error) throw error;

        tempProducts = (data || []).map(function(p) {
            return {
                id: p.id,
                name: p.name,
                category: p.category || 'سایر',
                price: Number(p.price) || 0,
                old_price: Number(p.old_price) || 0,
                img: p.image,
                stock: Number(p.stock) || 0,
                description: p.description || '',
                images: p.image ? [p.image] : []
            };
        });

        renderCategories();
        renderFeaturedProducts();

        var allPage = document.getElementById('allProductsPage');
        if (allPage && allPage.classList.contains('show')) {
            renderAllProducts(currentFilter);
        }

    } catch (e) {
        console.error('Error loading products:', e);
        showToast('خطا در بارگذاری محصولات');
    }
}

// ===== RENDER CATEGORIES =====
function renderCategories() {
    var grid = document.getElementById('categoriesGrid');
    if (!grid) return;

    var html = '';
    tempCategories.forEach(function(cat) {
        var count = tempProducts.filter(function(p) { return p.category === cat.name; }).length;
        html += '<div class="category-card" onclick="filterByCategory(\'' + cat.name + '\')">';
        html += '<img src="' + cat.icon + '" alt="' + cat.name + '" class="category-icon" onerror="this.style.display=\'none\'">';
        html += '<span class="category-name">' + cat.name + '</span>';
        html += '<span class="category-count">' + count + ' محصول</span>';
        html += '</div>';
    });
    grid.innerHTML = html;
}

// ===== CREATE PRODUCT CARD =====
function createProductCard(p) {
    var id = p.id;
    var badge = '';

    if (p.stock <= 0) {
        badge = '<span class="product-badge sold-out">اتمام موجودی</span>';
    } else if (p.old_price) {
        badge = '<span class="product-badge">تخفیف</span>';
    }

    var priceHtml = p.price.toLocaleString() + ' تومان';
    if (p.old_price) {
        priceHtml = p.price.toLocaleString() + ' <span class="old">' + p.old_price.toLocaleString() + '</span>';
    }

    var btnHtml = p.stock > 0
        ? '<button class="add-to-cart-btn" onclick="event.stopPropagation(); addToCart(\'' + id + '\')">افزودن به سبد</button>'
        : '<button class="add-to-cart-btn" disabled>اتمام موجودی</button>';

    var isFav = favorites.indexOf(id) !== -1;

    var html = '<div class="product-card" onclick="openProduct(\'' + id + '\')">';
    html += '<div class="product-img">';
    html += '<button class="fav-btn ' + (isFav ? 'active' : '') + '" onclick="event.stopPropagation(); toggleFavorite(\'' + id + '\')">' + (isFav ? '♥' : '♡') + '</button>';
    if (badge) html += badge;
    if (p.img) { html += '<img src="' + p.img + '" alt="' + p.name + '">'; } else { html += '👗'; }
    html += '</div><div class="product-info">';
    html += '<div class="product-name">' + p.name + '</div>';
    html += '<div class="product-cat">' + p.category + '</div>';
    html += '<div class="product-price">' + priceHtml + '</div>';
    html += btnHtml + '</div></div>';

    return html;
}

// ===== RENDER FEATURED =====
function renderFeaturedProducts() {
    var grid = document.getElementById('featuredGrid');
    if (!grid) return;
    var featured = tempProducts.slice(0, 4);
    var html = '';
    featured.forEach(function(p) { html += createProductCard(p); });
    grid.innerHTML = html;
}

// ===== ALL PRODUCTS PAGE =====
function openAllProducts() {
    document.getElementById('allProductsPage').classList.add('show');
    document.body.style.overflow = 'hidden';
    currentFilter = 'all';
    renderFilterTabs();
    renderAllProducts('all');
}
function closeAllProducts() {
    document.getElementById('allProductsPage').classList.remove('show');
    document.body.style.overflow = '';
}
function renderFilterTabs() {
    var container = document.getElementById('filterTabs');
    if (!container) return;
    var html = '<button class="' + (currentFilter === 'all' ? 'active' : '') + '" onclick="renderAllProducts(\'all\')">همه</button>';
    tempCategories.forEach(function(cat) {
        html += '<button class="' + (currentFilter === cat.name ? 'active' : '') + '" onclick="renderAllProducts(\'' + cat.name + '\')">' + cat.name + '</button>';
    });
    container.innerHTML = html;
}
function renderAllProducts(filter) {
    currentFilter = filter;
    var grid = document.getElementById('allProductsGrid');
    if (!grid) return;

    var products = filter === 'all' ? tempProducts : tempProducts.filter(function(p) { return p.category === filter; });

    if (products.length === 0) {
        grid.innerHTML = '<p style="text-align:center;grid-column:1/-1;padding:40px;color:#A09098;">محصولی در این دسته وجود ندارد</p>';
        renderFilterTabs();
        return;
    }

    var html = '';
    products.forEach(function(p) { html += createProductCard(p); });
    grid.innerHTML = html;
    renderFilterTabs();
}

// ===== TOAST =====
function showToast(msg) {
    var t = document.getElementById('toast');
    if (!t) return;
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(function() { t.classList.remove('show'); }, 2500);
}

// ===== CART =====
function saveCart() { localStorage.setItem('hoor_cart', JSON.stringify(cart)); }

function addToCart(productId) {
    var product = tempProducts.find(function(p) { return String(p.id) === String(productId); });
    if (!product) return;

    if (product.stock <= 0) { showToast('این محصول اتمام موجودی است'); return; }

    var existing = cart.find(function(item) { return String(item.id) === String(productId); });
    var alreadyInCart = existing ? existing.qty : 0;

    if (alreadyInCart >= product.stock) {
        showToast('بیشتر از موجودی نمی‌توانید سفارش دهید');
        return;
    }

    if (existing) { existing.qty++; } 
    else { cart.push({ id: productId, name: product.name, price: product.price, qty: 1 }); }

    showToast('به سبد اضافه شد ✓');
    saveCart();
    updateCartBar();
}

function updateCartBar() {
    var count = cart.reduce(function(sum, i) { return sum + i.qty; }, 0);
    var total = cart.reduce(function(sum, i) { return sum + (i.price * i.qty); }, 0);

    var bar = document.getElementById('cartBar');
    var badge = document.getElementById('cartBadge');
    var badge2 = document.getElementById('cartBadge2');

    if (bar) {
        if (count > 0) {
            bar.style.display = 'flex';
            if (badge) { badge.style.display = 'flex'; badge.textContent = count; }
            if (badge2) { badge2.style.display = 'flex'; badge2.textContent = count; }
            document.getElementById('cartCount').textContent = count + ' آیتم';
            document.getElementById('cartTotal').textContent = total.toLocaleString() + ' تومان';
        } else {
            bar.style.display = 'none';
            if (badge) badge.style.display = 'none';
            if (badge2) badge2.style.display = 'none';
        }
    }
    saveCart();
}

function renderCartItems() {
    var container = document.getElementById('cartItems');
    if (!container) return;

    if (cart.length === 0) {
        container.innerHTML = '<p style="text-align:center;color:#A09098;padding:30px;">سبد خرید خالی است</p>';
        document.getElementById('cartModalTotal').textContent = '۰ تومان';
        return;
    }

    var html = '';
    var total = 0;

    cart.forEach(function(item) {
        total += item.price * item.qty;
        html += '<div class="cart-item">';
        html += '<div class="cart-item-info"><div class="cart-item-name">' + item.name + '</div>';
        html += '<div class="cart-item-price">' + item.price.toLocaleString() + ' تومان</div></div>';
        html += '<div class="cart-item-qty">';
        html += '<button onclick="changeQty(\'' + item.id + '\', -1)">−</button>';
        html += '<span>' + item.qty + '</span>';
        html += '<button onclick="changeQty(\'' + item.id + '\', 1)">+</button>';
        html += '</div></div>';
    });

    container.innerHTML = html;
    document.getElementById('cartModalTotal').textContent = total.toLocaleString() + ' تومان';
}

function changeQty(id, delta) {
    var item = cart.find(function(i) { return String(i.id) === String(id); });
    if (!item) return;

    if (delta > 0) {
        var product = tempProducts.find(function(p) { return String(p.id) === String(id); });
        if (product && item.qty >= product.stock) {
            showToast('بیشتر از موجودی نمی‌توانید سفارش دهید');
            return;
        }
    }

    item.qty += delta;
    if (item.qty <= 0) { cart = cart.filter(function(i) { return String(i.id) !== String(id); }); }
    saveCart(); renderCartItems(); updateCartBar();
}

// ===== FAVORITES =====
function saveFavorites() { localStorage.setItem('hoor_favorites', JSON.stringify(favorites)); }

function toggleFavorite(id) {
    var idx = favorites.indexOf(String(id));
    if (idx === -1) { favorites.push(String(id)); showToast('به علاقه‌مندی‌ها اضافه شد ♥'); } 
    else { favorites.splice(idx, 1); showToast('از علاقه‌مندی‌ها حذف شد'); }
    saveFavorites(); renderFeaturedProducts();
    if (document.getElementById('allProductsPage').classList.contains('show')) renderAllProducts(currentFilter);
    if (document.getElementById('favoritesPage').classList.contains('show')) renderFavoritesPage();
}

function renderFavoritesPage() {
    var container = document.getElementById('favoritesPageList');
    if (!container) return;

    if (favorites.length === 0) {
        container.innerHTML = '<div class="empty-state"><span class="empty-icon">💔</span><p>لیست علاقه‌مندی خالی است</p></div>';
        return;
    }

    var html = '<div style="text-align:right;margin-bottom:15px;color:#A09098;font-size:12px;">' + favorites.length + ' محصول ذخیره شده</div>';
    html += '<div class="products-grid" style="grid-template-columns:repeat(2,1fr);">';
    favorites.forEach(function(id) {
        var p = tempProducts.find(function(x) { return String(x.id) === String(id); });
        if (p) html += createProductCard(p);
    });
    html += '</div>';
    container.innerHTML = html;
}

// ===== SEARCH =====
function searchProducts() {
    var input = document.getElementById('searchInput');
    var results = document.getElementById('searchResults');
    if (!input || !results) return;

    var query = input.value.trim().toLowerCase();
    if (query.length === 0) { results.classList.remove('show'); return; }

    var found = tempProducts.filter(function(p) {
        return p.name.toLowerCase().includes(query) || p.category.toLowerCase().includes(query);
    });

    if (found.length === 0) {
        results.innerHTML = '<div style="padding:20px;text-align:center;color:#A09098;font-size:13px;">موردی یافت نشد</div>';
    } else {
        var html = '';
        found.forEach(function(p) {
            html += '<div style="padding:14px 18px;border-bottom:1px solid #F0E4EA;cursor:pointer;display:flex;justify-content:space-between;align-items:center;" onclick="openProduct(\'' + p.id + '\');document.getElementById(\'searchResults\').classList.remove(\'show\');">';
            html += '<span style="font-size:13px;">' + p.name + '</span>';
            html += '<span style="color:#A85D73;font-weight:700;font-size:12px;">' + p.price.toLocaleString() + ' ت</span></div>';
        });
        results.innerHTML = html;
    }
    results.classList.add('show');
}

// ===== CATEGORY =====
function filterByCategory(catName) { openAllProducts(); setTimeout(function() { renderAllProducts(catName); }, 100); }

// ===== PRODUCT DETAILS =====
function openProduct(id) {
    var p = tempProducts.find(function(x) { return String(x.id) === String(id); });
    if (!p) { showToast('محصول یافت نشد'); return; }

    var imgs = (p.images && p.images.length) ? p.images : (p.img ? [p.img] : []);
    var html = '';

    if (imgs.length > 0) {
        html += '<div class="pd-gallery"><div class="pd-main-img"><img id="pdMainImg" src="' + imgs[0] + '" alt="' + p.name + '" onerror="this.parentElement.innerHTML=\'👗\'"></div>';
        if (imgs.length > 1) {
            html += '<div class="pd-thumbs">';
            imgs.forEach(function(src, i) {
                html += '<img src="' + src + '" class="' + (i === 0 ? 'active' : '') + '" onclick="pdSwitchImg(this, \'' + src + '\')" onerror="this.style.display=\'none\'">';
            });
            html += '</div>';
        }
        html += '</div>';
    } else {
        html += '<div class="pd-main-img" style="font-size:90px;">👗</div>';
    }

    html += '<div class="pd-info"><h1 class="pd-name">' + p.name + '</h1><div class="pd-cat">' + p.category + '</div>';
    var priceHtml = '<span class="pd-price-now">' + p.price.toLocaleString() + ' تومان</span>';
    if (p.old_price) {
        var off = Math.round((1 - p.price / p.old_price) * 100);
        priceHtml = '<span class="pd-price-old">' + p.old_price.toLocaleString() + '</span>' + priceHtml + '<span class="pd-off">٪' + off + ' تخفیف</span>';
    }
    html += '<div class="pd-price-row">' + priceHtml + '</div>';

    if (p.description) { html += '<div class="pd-desc">' + p.description + '</div>'; }
    if (p.stock <= 0) { html += '<div class="pd-stock">اتمام موجودی</div>'; }
    html += '</div>';
    html += '<div class="pd-bottom-bar">';
    if (p.stock > 0) { html += '<button class="pd-buy-btn" onclick="pdAddAndBack(\'' + p.id + '\')">افزودن به سبد خرید</button>'; } 
    else { html += '<button class="pd-buy-btn" disabled>اتمام موجودی</button>'; }
    html += '</div>';

    document.getElementById('productPageTitle').textContent = p.name;
    document.getElementById('productPageBody').innerHTML = html;
    openPage('productPage');
}

function pdSwitchImg(el, src) {
    document.getElementById('pdMainImg').src = src;
    document.querySelectorAll('.pd-thumbs img').forEach(function(i) { i.classList.remove('active'); });
    el.classList.add('active');
}
function pdSelectChip(el) {
    el.parentElement.querySelectorAll('.pd-chip').forEach(function(c) { c.classList.remove('active'); });
    el.classList.add('active');
}
function pdAddAndBack(id) { addToCart(id); }

// ===== LOGIN =====
function checkUserLogin() {
    var user = JSON.parse(localStorage.getItem('hoor_user')) || null;
    var loggedOut = document.getElementById('userLoggedOut');
    var loggedIn = document.getElementById('userLoggedIn');
    if (!loggedOut || !loggedIn) return;

    if (user) {
        loggedOut.style.display = 'none';
        loggedIn.style.display = 'block';
        document.getElementById('welcomeName').textContent = 'سلام ' + user.name + ' 👋';
        document.getElementById('welcomePhone').textContent = user.phone;
    } else {
        loggedOut.style.display = 'block';
        loggedIn.style.display = 'none';
    }
}

function loginUserSub() {
    var phone = document.getElementById('userPhoneSub').value.trim();
    var name = document.getElementById('userNameSub').value.trim();
    var pass = document.getElementById('userPasswordSub').value.trim();

    if (!phone || !name || !pass) { showToast('لطفاً همه فیلدها را پر کنید'); return; }
    if (phone.length < 11) { showToast('شماره موبایل معتبر نیست'); return; }

    localStorage.setItem('hoor_user', JSON.stringify({ phone: phone, name: name }));
    showToast('خوش آمدید ' + name + ' 🌸');
    checkUserLogin();
}
function logoutUser() {
    if (!confirm('از حساب کاربری خارج می‌شوید؟')) return;
    localStorage.removeItem('hoor_user');
    showToast('خارج شدید');
    checkUserLogin();
}

// ===== CHECKOUT =====
function checkout() {
    if (cart.length === 0) { showToast('سبد خرید خالی است'); return; }
    var user = JSON.parse(localStorage.getItem('hoor_user')) || null;
    if (!user) { showToast('اول وارد حساب کاربری شوید'); closeModal('cartModal'); openPage('userPage'); return; }

    closeModal('cartModal');

    var nameInput = document.getElementById('checkoutName');
    var phoneInput = document.getElementById('checkoutPhone');
    var addressInput = document.getElementById('checkoutAddress');

    if (nameInput) nameInput.value = user.name || '';
    if (phoneInput) phoneInput.value = user.phone || '';
    if (addressInput) addressInput.value = '';

    openPage('checkoutPage');
}

// ===== PAYMENT & TELEGRAM =====
async function payWithTorobPay() {
    var name = document.getElementById('checkoutName').value.trim();
    var phone = document.getElementById('checkoutPhone').value.trim();
    var address = document.getElementById('checkoutAddress').value.trim();

    if (!name || !phone || !address) { showToast('لطفاً همه اطلاعات را کامل کنید'); return; }

    var total = cart.reduce(function(s, i) { return s + (i.price * i.qty); }, 0);

    try {
        showToast('در حال ثبت سفارش...');

        // ۱. ذخیره سفارش تو دیتابیس
        const { error } = await db.from('orders').insert([{
            customer_name: name, 
            phone: phone, 
            address: address, 
            items: cart, 
            total: total, 
            status: 'pending', 
            payment_method: 'torobpay'
        }]);

        if (error) {
            console.error('DB Error:', error);
            showToast('خطا در ثبت سفارش');
            return;
        }

        // ۲. ارسال پیام به تلگرام
        var TELEGRAM_TOKEN = '9268175476:AAHRxwEdj_hhWqe8o80bb5grSbYa5dH4HeU';
        var TELEGRAM_CHAT_ID = '6671398575'; 
        
        var message = '🛍 سفارش جدید حور کالکشن\n\n' +
                      '👤 نام: ' + name + '\n' +
                      '📞 موبایل: ' + phone + '\n' +
                      '📍 آدرس: ' + address + '\n' +
                      '💰 مبلغ: ' + total.toLocaleString() + ' تومان\n' +
                      '📦 محصولات: ' + cart.map(function(i){return i.name + ' (' + i.qty + ')';}).join(', ');

        fetch('https://api.telegram.org/bot' + TELEGRAM_TOKEN + '/sendMessage?chat_id=' + TELEGRAM_CHAT_ID + '&text=' + encodeURIComponent(message))
            .catch(function(e){ console.log('Telegram error', e); });

        // ۳. خالی کردن سبد خرید
        cart = [];
        saveCart();
        updateCartBar();

        // ۴. انتقال به ترب پی یا تست
        if (confirm('سفارش ثبت شد. برای تست، می‌خواهی به ترب پی بروی؟ (برای پرداخت واقعی، بله را بزن)')) {
            window.location.href = 'https://torobpay.com/pay/00287566';
        } else {
            showToast('سفارش تستی ثبت شد. سبد خرید خالی شد.');
            closePage('checkoutPage');
        }

    } catch (error) {
        console.error('Catch Error:', error); 
        showToast('خطا در ثبت سفارش');
    }
}

function payWithZarinpal() { showToast('درگاه زرین‌پال در حال راه‌اندازی است...'); }

// ===== LOAD SITE SETTINGS =====
async function loadSettings() {
    try {
        const { data, error } = await db.from('settings').select('*').eq('id', 1).single();
        if (error) throw error;
        if (!data) return;

        var subLines = document.querySelectorAll('.landing-sub .sub-line');
        if (subLines.length >= 2) {
            subLines[0].textContent = data.hero_text || 'پروانه‌ای برای بال‌های تو';
            subLines[1].textContent = data.hero_subtitle || 'پوشاک زنانه اسپرت با طعم لطافت';
        }

        var aboutTexts = document.querySelectorAll('#aboutPage .about-text');
        if (aboutTexts.length > 0 && data.about_text) {
            aboutTexts[0].textContent = data.about_text;
        }

        var contactValues = document.querySelectorAll('#contactPage .contact-value');
        if (contactValues.length > 0) {
            if (data.phone) contactValues[0].textContent = data.phone;
        }
        if (contactValues.length >= 4 && data.address) {
            contactValues[3].textContent = data.address;
        }
        if (contactValues.length >= 3 && data.instagram) {
            contactValues[2].textContent = '@' + data.instagram;
        }

        var footerItems = document.querySelectorAll('.footer-item');
        if (footerItems.length > 0 && data.address) {
            footerItems[0].innerHTML = '<span class="icon">📍</span> ' + data.address;
        }
        if (footerItems.length > 3 && data.phone) {
            footerItems[3].innerHTML = '<span class="icon">📞</span> ' + data.phone;
        }

    } catch (e) {
        console.error('Error loading settings:', e);
    }
}

// ===== INIT =====
function initializeStore() {
    if (slidesCount > 0) { updateDots(); startSliderTimer(); }
    loadProductsFromSupabase();
    loadSettings();
    updateCartBar();
    checkUserLogin();
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initializeStore);
else initializeStore();

// ===== GLOBAL =====
window.goToShop = goToShop;
window.openProduct = openProduct;
window.addToCart = addToCart;
window.toggleFavorite = toggleFavorite;
window.payWithTorobPay = payWithTorobPay;
window.payWithZarinpal = payWithZarinpal;
window.openAllProducts = openAllProducts;
window.renderAllProducts = renderAllProducts;
window.filterByCategory = filterByCategory;
window.checkout = checkout;
window.openCart = openCart;
window.changeQty = changeQty;
window.showToast = showToast;
