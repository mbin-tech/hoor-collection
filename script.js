
/* eslint-disable */
// @ts-nocheck

// ==========================================
// حور کالکشن | JavaScript
// ==========================================

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
        html += '<span class="' +
            (i === currentSlide ? 'active' : '') +
            '" onclick="goToSlide(' + i + ')"></span>';
    }
    dotsContainer.innerHTML = html;
}

function goToSlide(index) {
    if (!sliderWrapper || !slidesCount) return;

    currentSlide = (index + slidesCount) % slidesCount;
    sliderWrapper.style.transform =
        'translateX(' + (currentSlide * 100) + '%)';

    updateDots();
    resetSliderTimer();
}

function slideNext() {
    if (!sliderWrapper || !slidesCount) return;

    currentSlide = (currentSlide + 1) % slidesCount;
    sliderWrapper.style.transform =
        'translateX(' + (currentSlide * 100) + '%)';

    updateDots();
    resetSliderTimer();
}

function slidePrev() {
    if (!sliderWrapper || !slidesCount) return;

    currentSlide = (currentSlide - 1 + slidesCount) % slidesCount;
    sliderWrapper.style.transform =
        'translateX(' + (currentSlide * 100) + '%)';

    updateDots();
    resetSliderTimer();
}

function startSliderTimer() {
    if (!sliderWrapper || !slidesCount) return;

    clearInterval(sliderInterval);

    sliderInterval = setInterval(function() {
        currentSlide = (currentSlide + 1) % slidesCount;

        sliderWrapper.style.transform =
            'translateX(' + (currentSlide * 100) + '%)';

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

function closeMenu() {
    var menu = document.getElementById('sideMenu');
    var overlay = document.getElementById('menuOverlay');

    if (menu) menu.classList.remove('show');
    if (overlay) overlay.classList.remove('show');
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


// ==========================================
// SUB PAGES
// ==========================================

function openPage(pageId) {
    if (!pageId) return;

    // بستن منو
    closeMenu();

    // بستن زیرصفحه‌های قبلی
    document.querySelectorAll('.sub-page').forEach(function(page) {
        page.classList.remove('show');
    });

    // پیدا کردن صفحه موردنظر
    var page = document.getElementById(pageId);

    if (!page) {
        console.error('صفحه پیدا نشد:', pageId);
        showToast('صفحه موردنظر پیدا نشد');
        return;
    }

    // نمایش صفحه
    page.classList.add('show');

    document.body.style.overflow = 'hidden';

    // برگشت اسکرول به ابتدای صفحه
    page.scrollTop = 0;

    // اجرای توابع اختصاصی
    if (pageId === 'userPage') {
        checkUserLogin();
    }

    if (pageId === 'favoritesPage') {
        renderFavoritesPage();
    }
}


// بستن زیرصفحه
function closePage(pageId) {
    var page = document.getElementById(pageId);

    if (page) {
        page.classList.remove('show');
    }

    // اگر صفحه دیگری باز است، اسکرول قفل بماند
    var anotherPage = document.querySelector('.sub-page.show');

    if (!anotherPage) {
        document.body.style.overflow = '';
    }
}


// باز کردن صفحه قوانین و مقررات
function openRules() {
    openPage('rulesPage');
}


// بستن صفحه قوانین
function closeRules() {
    closePage('rulesPage');
}


// میانبرهای صفحات
function openUserAccount() {
    openPage('userPage');
}

function openOrders() {
    openPage('ordersPage');
}

function openFavorites() {
    openPage('favoritesPage');
}

function openContact() {
    openPage('contactPage');
}

function openAbout() {
    openPage('aboutPage');
}


// ===== INSTAGRAM =====
function openInstagram() {
    closeMenu();

    var msg =
        '⚠️ برای دیدن پیج اینستاگرام، لطفاً ابتدا وی‌پی‌ان (VPN) خود را روشن کنید.\n\nآیا VPN شما روشن است؟';

    if (confirm(msg)) {
        window.location.href =
            'https://instagram.com/Hoor_collectioon';
    }
}

function openPortfolio() {
    closeMenu();

    if (confirm(
        'برای دیدن نمونه‌کارهای بیشتر به پیج ما مراجعه کنید:\n@mbin.tech\n\nآیا می‌خواهید باز شود؟'
    )) {
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

var cart = [];
var favorites = [];

try {
    cart = JSON.parse(localStorage.getItem('hoor_cart')) || [];
    favorites = JSON.parse(localStorage.getItem('hoor_favorites')) || [];
} catch (e) {
    cart = [];
    favorites = [];
}


// ===== PRODUCTS FROM SUPABASE =====
async function loadProductsFromSupabase() {
    try {
        if (typeof db === 'undefined' || !db) {
            console.error('Supabase database is not available');
            return;
        }

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

        if (document.getElementById('favoritesPage') &&
            document.getElementById('favoritesPage').classList.contains('show')) {
            renderFavoritesPage();
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
        var count = tempProducts.filter(function(p) {
            return p.category === cat.name;
        }).length;

        html += '<div class="category-card" onclick="filterByCategory(\'' +
            cat.name + '\')">';

        html += '<img src="' + cat.icon +
            '" alt="' + cat.name +
            '" class="category-icon" onerror="this.style.display=\'none\'">';

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
        priceHtml = p.price.toLocaleString() +
            ' <span class="old">' +
            p.old_price.toLocaleString() +
            '</span>';
    }

    var btnHtml = p.stock > 0
        ? '<button class="add-to-cart-btn" onclick="event.stopPropagation(); addToCart(\'' +
          id + '\')">افزودن به سبد</button>'
        : '<button class="add-to-cart-btn" disabled>اتمام موجودی</button>';

    var isFav = favorites.indexOf(String(id)) !== -1;

    var html = '<div class="product-card" onclick="openProduct(\'' + id + '\')">';

    html += '<div class="product-img">';

    html += '<button class="fav-btn ' +
        (isFav ? 'active' : '') +
        '" onclick="event.stopPropagation(); toggleFavorite(\'' +
        id + '\')">' + (isFav ? '♥' : '♡') + '</button>';

    if (badge) html += badge;

    if (p.img) {
        html += '<img src="' + p.img + '" alt="' + p.name + '">';
    } else {
        html += '👗';
    }

    html += '</div><div class="product-info">';
    html += '<div class="product-name">' + p.name + '</div>';
    html += '<div class="product-cat">' + p.category + '</div>';
    html += '<div class="product-price">' + priceHtml + '</div>';
    html += btnHtml;
    html += '</div></div>';

    return html;
}


// ===== RENDER FEATURED =====
function renderFeaturedProducts() {
    var grid = document.getElementById('featuredGrid');
    if (!grid) return;

    var featured = tempProducts.slice(0, 4);
    var html = '';

    featured.forEach(function(p) {
        html += createProductCard(p);
    });

    grid.innerHTML = html;
}


// ===== ALL PRODUCTS PAGE =====
function openAllProducts() {
    var page = document.getElementById('allProductsPage');
    if (!page) return;

    closeMenu();

    document.querySelectorAll('.sub-page').forEach(function(p) {
        p.classList.remove('show');
    });

    page.classList.add('show');
    page.scrollTop = 0;
    document.body.style.overflow = 'hidden';

    currentFilter = 'all';
    renderFilterTabs();
    renderAllProducts('all');
}

function closeAllProducts() {
    closePage('allProductsPage');
}

function renderFilterTabs() {
    var container = document.getElementById('filterTabs');
    if (!container) return;

    var html =
        '<button class="' +
        (currentFilter === 'all' ? 'active' : '') +
        '" onclick="renderAllProducts(\'all\')">همه</button>';

    tempCategories.forEach(function(cat) {
        html += '<button class="' +
            (currentFilter === cat.name ? 'active' : '') +
            '" onclick="renderAllProducts(\'' +
            cat.name + '\')">' + cat.name + '</button>';
    });

    container.innerHTML = html;
}

function renderAllProducts(filter) {
    currentFilter = filter;

    var grid = document.getElementById('allProductsGrid');
    if (!grid) return;

    var products = filter === 'all'
        ? tempProducts
        : tempProducts.filter(function(p) {
            return p.category === filter;
        });

    if (products.length === 0) {
        grid.innerHTML =
            '<p style="text-align:center;grid-column:1/-1;padding:40px;color:#A09098;">محصولی در این دسته وجود ندارد</p>';

        renderFilterTabs();
        return;
    }

    var html = '';

    products.forEach(function(p) {
        html += createProductCard(p);
    });

    grid.innerHTML = html;
    renderFilterTabs();
}


// ===== TOAST =====
function showToast(msg) {
    var t = document.getElementById('toast');
    if (!t) return;

    t.textContent = msg;
    t.classList.add('show');

    setTimeout(function() {
        t.classList.remove('show');
    }, 2500);
}


// ==========================================
// CART
// ==========================================

function saveCart() {
    localStorage.setItem('hoor_cart', JSON.stringify(cart));
}

function addToCart(productId) {
    var product = tempProducts.find(function(p) {
        return String(p.id) === String(productId);
    });

    if (!product) return;

    if (product.stock <= 0) {
        showToast('این محصول اتمام موجودی است');
        return;
    }

    var existing = cart.find(function(item) {
        return String(item.id) === String(productId);
    });

    var alreadyInCart = existing ? existing.qty : 0;

    if (alreadyInCart >= product.stock) {
        showToast('بیشتر از موجودی نمی‌توانید سفارش دهید');
        return;
    }

    if (existing) {
        existing.qty++;
    } else {
        cart.push({
            id: productId,
            name: product.name,
            price: product.price,
            qty: 1
        });
    }

    showToast('به سبد اضافه شد ✓');

    saveCart();
    updateCartBar();
}

function updateCartBar() {
    var count = cart.reduce(function(sum, i) {
        return sum + Number(i.qty || 0);
    }, 0);

    var total = cart.reduce(function(sum, i) {
        return sum + (Number(i.price) * Number(i.qty));
    }, 0);

    var bar = document.getElementById('cartBar');
    var badge = document.getElementById('cartBadge');
    var badge2 = document.getElementById('cartBadge2');

    if (bar) {
        if (count > 0) {
            bar.style.display = 'flex';

            if (badge) {
                badge.style.display = 'flex';
                badge.textContent = count;
            }

            if (badge2) {
                badge2.style.display = 'flex';
                badge2.textContent = count;
            }

            var cartCount = document.getElementById('cartCount');
            var cartTotal = document.getElementById('cartTotal');

            if (cartCount) cartCount.textContent = count + ' آیتم';

            if (cartTotal) {
                cartTotal.textContent = total.toLocaleString() + ' تومان';
            }

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

    var totalElement = document.getElementById('cartModalTotal');

    if (cart.length === 0) {
        container.innerHTML =
            '<p style="text-align:center;color:#A09098;padding:30px;">سبد خرید خالی است</p>';

        if (totalElement) totalElement.textContent = '۰ تومان';
        return;
    }

    var html = '';
    var total = 0;

    cart.forEach(function(item) {
        total += item.price * item.qty;

        html += '<div class="cart-item">';
        html += '<div class="cart-item-info">';
        html += '<div class="cart-item-name">' + item.name + '</div>';
        html += '<div class="cart-item-price">' +
            item.price.toLocaleString() + ' تومان</div>';
        html += '</div>';

        html += '<div class="cart-item-qty">';
        html += '<button onclick="changeQty(\'' + item.id + '\', -1)">−</button>';
        html += '<span>' + item.qty + '</span>';
        html += '<button onclick="changeQty(\'' + item.id + '\', 1)">+</button>';
        html += '</div></div>';
    });

    container.innerHTML = html;

    if (totalElement) {
        totalElement.textContent = total.toLocaleString() + ' تومان';
    }
}

function changeQty(id, delta) {
    var item = cart.find(function(i) {
        return String(i.id) === String(id);
    });

    if (!item) return;

    if (delta > 0) {
        var product = tempProducts.find(function(p) {
            return String(p.id) === String(id);
        });

        if (product && item.qty >= product.stock) {
            showToast('بیشتر از موجودی نمی‌توانید سفارش دهید');
            return;
        }
    }

    item.qty += delta;

    if (item.qty <= 0) {
        cart = cart.filter(function(i) {
            return String(i.id) !== String(id);
        });
    }

    saveCart();
    renderCartItems();
    updateCartBar();
}


// ==========================================
// FAVORITES
// ==========================================

function saveFavorites() {
    localStorage.setItem('hoor_favorites', JSON.stringify(favorites));
}

function toggleFavorite(id) {
    id = String(id);

    var idx = favorites.indexOf(id);

    if (idx === -1) {
        favorites.push(id);
        showToast('به علاقه‌مندی‌ها اضافه شد ♥');
    } else {
        favorites.splice(idx, 1);
        showToast('از علاقه‌مندی‌ها حذف شد');
    }

    saveFavorites();
    renderFeaturedProducts();

    var allPage = document.getElementById('allProductsPage');

    if (allPage && allPage.classList.contains('show')) {
        renderAllProducts(currentFilter);
    }

    var favPage = document.getElementById('favoritesPage');

    if (favPage && favPage.classList.contains('show')) {
        renderFavoritesPage();
    }
}

function renderFavoritesPage() {
    var container = document.getElementById('favoritesPageList');
    if (!container) return;

    if (favorites.length === 0) {
        container.innerHTML =
            '<div class="empty-state"><span class="empty-icon">💔</span><p>لیست علاقه‌مندی خالی است</p></div>';
        return;
    }

    var html =
        '<div style="text-align:right;margin-bottom:15px;color:#A09098;font-size:12px;">' +
        favorites.length + ' محصول ذخیره شده</div>';

    html += '<div class="products-grid" style="grid-template-columns:repeat(2,1fr);">';

    favorites.forEach(function(id) {
        var p = tempProducts.find(function(x) {
            return String(x.id) === String(id);
        });

        if (p) html += createProductCard(p);
    });

    html += '</div>';

    container.innerHTML = html;
}


// ==========================================
// SEARCH
// ==========================================

function searchProducts() {
    var input = document.getElementById('searchInput');
    var results = document.getElementById('searchResults');

    if (!input || !results) return;

    var query = input.value.trim().toLowerCase();

    if (query.length === 0) {
        results.classList.remove('show');
        return;
    }

    var found = tempProducts.filter(function(p) {
        return p.name.toLowerCase().includes(query) ||
            p.category.toLowerCase().includes(query);
    });

    if (found.length === 0) {
        results.innerHTML =
            '<div style="padding:20px;text-align:center;color:#A09098;font-size:13px;">موردی یافت نشد</div>';
    } else {
        var html = '';

        found.forEach(function(p) {
            html += '<div style="padding:14px 18px;border-bottom:1px solid #F0E4EA;cursor:pointer;display:flex;justify-content:space-between;align-items:center;" onclick="openProduct(\'' +
                p.id +
                '\');document.getElementById(\'searchResults\').classList.remove(\'show\');">';

            html += '<span style="font-size:13px;">' + p.name + '</span>';
            html += '<span style="color:#A85D73;font-weight:700;font-size:12px;">' +
                p.price.toLocaleString() + ' ت</span>';

            html += '</div>';
        });

        results.innerHTML = html;
    }

    results.classList.add('show');
}


// ===== CATEGORY =====
function filterByCategory(catName) {
    openAllProducts();
    renderAllProducts(catName);
}


// ==========================================
// PRODUCT DETAILS
// ==========================================

function openProduct(id) {
    var p = tempProducts.find(function(x) {
        return String(x.id) === String(id);
    });

    if (!p) {
        showToast('محصول یافت نشد');
        return;
    }

    var imgs = (p.images && p.images.length)
        ? p.images
        : (p.img ? [p.img] : []);

    var html = '';

    if (imgs.length > 0) {
        html += '<div class="pd-gallery">';
        html += '<div class="pd-main-img">';
        html += '<img id="pdMainImg" src="' +
            imgs[0] + '" alt="' + p.name +
            '" onerror="this.parentElement.innerHTML=\'👗\'">';
        html += '</div>';

        if (imgs.length > 1) {
            html += '<div class="pd-thumbs">';

            imgs.forEach(function(src, i) {
                html += '<img src="' + src +
                    '" class="' + (i === 0 ? 'active' : '') +
                    '" onclick="pdSwitchImg(this, \'' + src +
                    '\')" onerror="this.style.display=\'none\'">';
            });

            html += '</div>';
        }

        html += '</div>';

    } else {
        html += '<div class="pd-main-img" style="font-size:90px;">👗</div>';
    }

    html += '<div class="pd-info">';
    html += '<h1 class="pd-name">' + p.name + '</h1>';
    html += '<div class="pd-cat">' + p.category + '</div>';

    var priceHtml =
        '<span class="pd-price-now">' +
        p.price.toLocaleString() + ' تومان</span>';

    if (p.old_price) {
        var off = Math.round((1 - p.price / p.old_price) * 100);

        priceHtml =
            '<span class="pd-price-old">' +
            p.old_price.toLocaleString() +
            '</span>' +
            priceHtml +
            '<span class="pd-off">٪' + off + ' تخفیف</span>';
    }

    html += '<div class="pd-price-row">' + priceHtml + '</div>';

    if (p.description) {
        html += '<div class="pd-desc">' + p.description + '</div>';
    }

    if (p.stock <= 0) {
        html += '<div class="pd-stock">اتمام موجودی</div>';
    }

    html += '</div>';
    html += '<div class="pd-bottom-bar">';

    if (p.stock > 0) {
        html += '<button class="pd-buy-btn" onclick="pdAddAndBack(\'' +
            p.id + '\')">افزودن به سبد خرید</button>';
    } else {
        html += '<button class="pd-buy-btn" disabled>اتمام موجودی</button>';
    }

    html += '</div>';

    var title = document.getElementById('productPageTitle');
    var body = document.getElementById('productPageBody');

    if (!title || !body) {
        showToast('صفحه جزئیات محصول پیدا نشد');
        return;
    }

    title.textContent = p.name;
    body.innerHTML = html;

    openPage('productPage');
}

function pdSwitchImg(el, src) {
    var mainImg = document.getElementById('pdMainImg');
    if (mainImg) mainImg.src = src;

    document.querySelectorAll('.pd-thumbs img').forEach(function(i) {
        i.classList.remove('active');
    });

    if (el) el.classList.add('active');
}

function pdSelectChip(el) {
    if (!el || !el.parentElement) return;

    el.parentElement.querySelectorAll('.pd-chip').forEach(function(c) {
        c.classList.remove('active');
    });

    el.classList.add('active');
}

function pdAddAndBack(id) {
    addToCart(id);
}


// ==========================================
// LOGIN
// ==========================================

function checkUserLogin() {
    var user = null;

    try {
        user = JSON.parse(localStorage.getItem('hoor_user')) || null;
    } catch (e) {
        user = null;
    }

    var loggedOut = document.getElementById('userLoggedOut');
    var loggedIn = document.getElementById('userLoggedIn');

    if (!loggedOut || !loggedIn) return;

    if (user) {
        loggedOut.style.display = 'none';
        loggedIn.style.display = 'block';

        var welcomeName = document.getElementById('welcomeName');
        var welcomePhone = document.getElementById('welcomePhone');

        if (welcomeName) {
            welcomeName.textContent = 'سلام ' + user.name + ' 👋';
        }

        if (welcomePhone) {
            welcomePhone.textContent = user.phone;
        }

    } else {
        loggedOut.style.display = 'block';
        loggedIn.style.display = 'none';
    }
}

function loginUserSub() {
    var phoneEl = document.getElementById('userPhoneSub');
    var nameEl = document.getElementById('userNameSub');
    var passEl = document.getElementById('userPasswordSub');

    if (!phoneEl || !nameEl || !passEl) return;

    var phone = phoneEl.value.trim();
    var name = nameEl.value.trim();
    var pass = passEl.value.trim();

    if (!phone || !name || !pass) {
        showToast('لطفاً همه فیلدها را پر کنید');
        return;
    }

    if (!/^09\d{9}$/.test(phone)) {
        showToast('شماره موبایل معتبر نیست');
        return;
    }

    // توجه: این ورود ساده محلی است و احراز هویت واقعی نیست.
    localStorage.setItem('hoor_user', JSON.stringify({
        phone: phone,
        name: name
    }));

    showToast('خوش آمدید ' + name + ' 🌸');
    checkUserLogin();
}

function logoutUser() {
    if (!confirm('از حساب کاربری خارج می‌شوید؟')) return;

    localStorage.removeItem('hoor_user');

    showToast('خارج شدید');
    checkUserLogin();
}


// ==========================================
// CHECKOUT
// ==========================================

function checkout() {
    if (cart.length === 0) {
        showToast('سبد خرید خالی است');
        return;
    }

    var user = null;

    try {
        user = JSON.parse(localStorage.getItem('hoor_user')) || null;
    } catch (e) {
        user = null;
    }

    if (!user) {
        showToast('اول وارد حساب کاربری شوید');
        closeModal('cartModal');
        openPage('userPage');
        return;
    }

    closeModal('cartModal');

    var nameInput = document.getElementById('checkoutName');
    var phoneInput = document.getElementById('checkoutPhone');
    var addressInput = document.getElementById('checkoutAddress');

    if (nameInput) nameInput.value = user.name || '';
    if (phoneInput) phoneInput.value = user.phone || '';
    if (addressInput) addressInput.value = '';

    openPage('checkoutPage');
}


// ==========================================
// PAYMENT
// ==========================================

async function payWithTorobPay() {
    var nameEl = document.getElementById('checkoutName');
    var phoneEl = document.getElementById('checkoutPhone');
    var addressEl = document.getElementById('checkoutAddress');

    if (!nameEl || !phoneEl || !addressEl) {
        showToast('اطلاعات سفارش پیدا نشد');
        return;
    }

    var name = nameEl.value.trim();
    var phone = phoneEl.value.trim();
    var address = addressEl.value.trim();

    if (!name || !phone || !address) {
        showToast('لطفاً همه اطلاعات را کامل کنید');
        return;
    }

    if (!/^09\d{9}$/.test(phone)) {
        showToast('شماره موبایل معتبر نیست');
        return;
    }

    if (cart.length === 0) {
        showToast('سبد خرید خالی است');
        return;
    }

    var total = cart.reduce(function(s, i) {
        return s + (i.price * i.qty);
    }, 0);

    try {
        showToast('در حال ثبت سفارش...');

        if (typeof db === 'undefined' || !db) {
            showToast('اتصال به پایگاه داده برقرار نیست');
            return;
        }

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

        // ارسال پیام تلگرام باید از طریق سرور انجام شود.
        // توکن ربات را داخل فایل عمومی سایت قرار ندهید.

        // خالی کردن سبد پس از ثبت سفارش
        cart = [];

        saveCart();
        updateCartBar();

        if (confirm(
            'سفارش ثبت شد. برای ادامه به صفحه پرداخت ترب‌پی بروید؟'
        )) {
            window.location.href = 'https://torobpay.com/pay/00287566';
        } else {
            showToast('سفارش ثبت شد');
            closePage('checkoutPage');
        }

    } catch (error) {
        console.error('Checkout Error:', error);
        showToast('خطا در ثبت سفارش');
    }
}

function payWithZarinpal() {
    showToast('درگاه زرین‌پال در حال راه‌اندازی است...');
}


// ==========================================
// LOAD SITE SETTINGS
// ==========================================

async function loadSettings() {
    try {
        if (typeof db === 'undefined' || !db) return;

        const { data, error } = await db
            .from('settings')
            .select('*')
            .eq('id', 1)
            .single();

        if (error) throw error;
        if (!data) return;

        var subLines = document.querySelectorAll('.landing-sub .sub-line');

        if (subLines.length >= 2) {
            subLines[0].textContent =
                data.hero_text || 'پروانه‌ای برای بال‌های تو';

            subLines[1].textContent =
                data.hero_subtitle || 'پوشاک زنانه اسپرت با طعم لطافت';
        }

        var aboutTexts = document.querySelectorAll('#aboutPage .about-text');

        if (aboutTexts.length > 0 && data.about_text) {
            aboutTexts[0].textContent = data.about_text;
        }

        var contactValues = document.querySelectorAll('.contact-value');

        if (contactValues.length > 0 && data.phone) {
            contactValues[0].textContent = data.phone;
        }

        if (contactValues.length >= 4 && data.address) {
            contactValues[3].textContent = data.address;
        }

        if (contactValues.length >= 3 && data.instagram) {
            contactValues[2].textContent = '@' + data.instagram;
        }

        var footerItems = document.querySelectorAll('.footer-item');

        if (footerItems.length > 0 && data.address) {
            footerItems[0].innerHTML =
                '<span class="icon">📍</span> ' + data.address;
        }

        if (footerItems.length > 3 && data.phone) {
            footerItems[3].innerHTML =
                '<span class="icon">📞</span> ' + data.phone;
        }

    } catch (e) {
        console.error('Error loading settings:', e);
    }
}


// ==========================================
// INITIALIZE
// ==========================================

function initializeStore() {
    // بررسی مجدد اسلایدر پس از بارگذاری صفحه
    sliderWrapper = document.getElementById('sliderWrapper');
    slidesCount = sliderWrapper ? sliderWrapper.children.length : 0;

    if (slidesCount > 0) {
        updateDots();
        startSliderTimer();
    }

    loadProductsFromSupabase();
    loadSettings();

    updateCartBar();
    checkUserLogin();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeStore);
} else {
    initializeStore();
}


// ==========================================
// GLOBAL FUNCTIONS
// ==========================================

// توابع مورد استفاده در onclick های HTML
window.goToShop = goToShop;

window.toggleMenu = toggleMenu;
window.closeMenu = closeMenu;

window.openModal = openModal;
window.closeModal = closeModal;
window.openCart = openCart;

window.openPage = openPage;
window.closePage = closePage;
window.openRules = openRules;
window.closeRules = closeRules;

window.openUserAccount = openUserAccount;
window.openOrders = openOrders;
window.openFavorites = openFavorites;
window.openContact = openContact;
window.openAbout = openAbout;

window.openInstagram = openInstagram;
window.openPortfolio = openPortfolio;

window.goToSlide = goToSlide;
window.slideNext = slideNext;
window.slidePrev = slidePrev;

window.openProduct = openProduct;
window.pdSwitchImg = pdSwitchImg;
window.pdSelectChip = pdSelectChip;
window.pdAddAndBack = pdAddAndBack;

window.addToCart = addToCart;
window.changeQty = changeQty;
window.toggleFavorite = toggleFavorite;

window.openAllProducts = openAllProducts;
window.closeAllProducts = closeAllProducts;
window.renderAllProducts = renderAllProducts;
window.filterByCategory = filterByCategory;

window.searchProducts = searchProducts;

window.checkout = checkout;
window.payWithTorobPay = payWithTorobPay;
window.payWithZarinpal = payWithZarinpal;

window.loginUserSub = loginUserSub;
window.logoutUser = logoutUser;
window.checkUserLogin = checkUserLogin;

window.showToast = showToast;

window.renderCartItems = renderCartItems;
window.updateCartBar = updateCartBar;
window.renderFavoritesPage = renderFavoritesPage;
window.renderCategories = renderCategories;
window.renderFeaturedProducts = renderFeaturedProducts;
window.loadProductsFromSupabase = loadProductsFromSupabase;
window.loadSettings = loadSettings;
