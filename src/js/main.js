// Trendy Wardrobe - Main JavaScript Entry Point
// Initializes all components and handles global interactions

import './components/header';
import './components/mega-menu';
import './components/mobile-nav';
import './components/search-overlay';
import './components/filter-sidebar';
import './components/sort-dropdown';
import './components/pagination';
import './components/toast';
import './components/loading-skeleton';
import './components/cookie-consent';
import './components/newsletter-popup';
import './components/floating-actions';
import './components/breadcrumb';
import './components/page-header';

// Global State
window.TrendyWardrobe = {
    // Cart state
    cart: {
        items: [],
        count: 0,
        total: 0
    },
    
    // Wishlist state
    wishlist: {
        items: [],
        count: 0
    },
    
    // User state
    user: {
        isLoggedIn: false,
        data: null
    },
    
    // Recently viewed
    recentlyViewed: [],
    
    // Initialize all components
    init() {
        this.initHeader();
        this.initMegaMenu();
        this.initMobileNav();
        this.initSearchOverlay();
        this.initCart();
        this.initWishlist();
        this.initUser();
        this.initScrollEffects();
        this.initKeyboardShortcuts();
        this.loadPersistedState();
        
        console.log('Trendy Wardrobe initialized');
    },
    
    // Header interactions
    initHeader() {
        const header = document.querySelector('.header');
        if (!header) return;
        
        // Scroll effect
        let lastScroll = 0;
        const scrollThreshold = 100;
        
        window.addEventListener('scroll', () => {
            const currentScroll = window.scrollY;
            
            if (currentScroll > scrollThreshold) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
            
            // Hide/show header on scroll
            if (currentScroll > lastScroll && currentScroll > 200) {
                header.classList.add('hidden');
            } else {
                header.classList.remove('hidden');
            }
            
            lastScroll = currentScroll;
        }, { passive: true });
        
        // User menu toggle
        const userMenu = document.querySelector('[data-user-menu]');
        const userTrigger = document.querySelector('[data-user-trigger]');
        const userDropdown = document.querySelector('.user-dropdown');
        
        if (userTrigger && userDropdown) {
            userTrigger.addEventListener('click', (e) => {
                e.stopPropagation();
                userDropdown.classList.toggle('show');
                userTrigger.setAttribute('aria-expanded', 
                    userTrigger.getAttribute('aria-expanded') === 'true' ? 'false' : 'true');
            });
            
            document.addEventListener('click', (e) => {
                if (!userMenu?.contains(e.target)) {
                    userDropdown.classList.remove('show');
                    userTrigger?.setAttribute('aria-expanded', 'false');
                }
            });
        }
        
        // Cart count updates
        this.updateCartCount();
        this.updateWishlistCount();
    },
    
    // Mega Menu
    initMegaMenu() {
        const triggers = document.querySelectorAll('[data-mega-menu-trigger]');
        const megaMenu = document.querySelector('[data-mega-menu]');
        const megaMenuOverlay = document.querySelector('[data-mega-menu-overlay]');
        const megaMenuContents = document.querySelectorAll('[data-mega-menu-content]');
        
        if (!megaMenu) return;
        
        let hideTimeout;
        
        const showMegaMenu = (category) => {
            clearTimeout(hideTimeout);
            
            // Update active trigger
            triggers.forEach(t => {
                const isActive = t.dataset.megaMenuTrigger === category;
                t.setAttribute('aria-expanded', isActive);
                t.parentElement?.classList.toggle('active', isActive);
            });
            
            // Show/hide content panels
            megaMenuContents.forEach(content => {
                const isActive = content.dataset.megaMenuContent === category;
                content.style.display = isActive ? 'block' : 'none';
            });
            
            megaMenu.classList.add('open');
            megaMenuOverlay?.classList.add('visible');
            document.body.style.overflow = 'hidden';
        };
        
        const hideMegaMenu = () => {
            hideTimeout = setTimeout(() => {
                triggers.forEach(t => {
                    t.setAttribute('aria-expanded', 'false');
                    t.parentElement?.classList.remove('active');
                });
                megaMenu.classList.remove('open');
                megaMenuOverlay?.classList.remove('visible');
                document.body.style.overflow = '';
            }, 150);
        };
        
        // Trigger events
        triggers.forEach(trigger => {
            trigger.addEventListener('mouseenter', () => {
                showMegaMenu(trigger.dataset.megaMenuTrigger);
            });
            
            trigger.addEventListener('focus', () => {
                showMegaMenu(trigger.dataset.megaMenuTrigger);
            });
            
            trigger.parentElement?.addEventListener('mouseleave', hideMegaMenu);
        });
        
        megaMenu?.addEventListener('mouseenter', () => clearTimeout(hideTimeout));
        megaMenu?.addEventListener('mouseleave', hideMegaMenu);
        
        megaMenuOverlay?.addEventListener('click', hideMegaMenu);
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && megaMenu.classList.contains('open')) {
                hideMegaMenu();
                const activeTrigger = document.querySelector('[data-mega-menu-trigger][aria-expanded="true"]');
                activeTrigger?.focus();
            }
        });
    },
    
    // Mobile Navigation
    initMobileNav() {
        const hamburger = document.querySelector('[data-hamburger]');
        const drawer = document.querySelector('[data-mobile-nav-drawer]');
        const overlay = document.querySelector('[data-mobile-nav-overlay]');
        const closeBtn = document.querySelector('[data-mobile-nav-close]');
        const submenuTriggers = document.querySelectorAll('[data-mobile-submenu-trigger]');
        const closeLinks = document.querySelectorAll('[data-mobile-nav-close]');
        
        if (!drawer) return;
        
        const openDrawer = () => {
            drawer.classList.add('open');
            document.body.style.overflow = 'hidden';
            hamburger?.setAttribute('aria-expanded', 'true');
            // Focus first focusable element
            setTimeout(() => {
                drawer.querySelector('button, a, [href]')?.focus();
            }, 100);
        };
        
        const closeDrawer = () => {
            drawer.classList.remove('open');
            document.body.style.overflow = '';
            hamburger?.setAttribute('aria-expanded', 'false');
            hamburger?.focus();
        };
        
        hamburger?.addEventListener('click', openDrawer);
        overlay?.addEventListener('click', closeDrawer);
        closeBtn?.addEventListener('click', closeDrawer);
        
        closeLinks.forEach(link => {
            link.addEventListener('click', closeDrawer);
        });
        
        // Submenu toggles
        submenuTriggers.forEach(trigger => {
            trigger.addEventListener('click', () => {
                const targetId = trigger.dataset.mobileSubmenuTrigger;
                const submenu = document.getElementById(`mobile-submenu-${targetId}`);
                const isOpen = trigger.getAttribute('aria-expanded') === 'true';
                
                trigger.setAttribute('aria-expanded', !isOpen);
                submenu?.classList.toggle('open', !isOpen);
            });
        });
        
        // Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && drawer.classList.contains('open')) {
                closeDrawer();
            }
        });
        
        // Trap focus in drawer
        drawer.addEventListener('keydown', (e) => {
            if (e.key === 'Tab' && drawer.classList.contains('open')) {
                const focusable = drawer.querySelectorAll(
                    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                );
                const first = focusable[0];
                const last = focusable[focusable.length - 1];
                
                if (e.shiftKey && document.activeElement === first) {
                    e.preventDefault();
                    last.focus();
                } else if (!e.shiftKey && document.activeElement === last) {
                    e.preventDefault();
                    first.focus();
                }
            }
        });
    },
    
    // Search Overlay
    initSearchOverlay() {
        const triggers = document.querySelectorAll('[data-search-trigger]');
        const overlay = document.querySelector('[data-search-overlay]');
        const closeBtn = document.querySelector('[data-search-close]');
        const input = document.querySelector('[data-search-input]');
        const clearBtn = document.querySelector('[data-search-clear]');
        const suggestions = document.querySelector('[data-search-suggestions]');
        const recentSearches = document.querySelector('[data-recent-searches]');
        const resultsPreview = document.querySelector('[data-search-results-preview]');
        const keyboardHint = document.querySelector('.search-shortcut');
        
        if (!overlay) return;
        
        const openSearch = () => {
            overlay.classList.add('open');
            document.body.style.overflow = 'hidden';
            setTimeout(() => input?.focus(), 100);
        };
        
        const closeSearch = () => {
            overlay.classList.remove('open');
            document.body.style.overflow = '';
            input?.value = '';
            clearBtn?.classList.remove('visible');
            suggestions?.classList.remove('open');
            recentSearches?.classList.remove('open');
            resultsPreview?.classList.remove('open');
            triggers.forEach(t => t.setAttribute('aria-expanded', 'false'));
        };
        
        triggers.forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                openSearch();
                trigger.setAttribute('aria-expanded', 'true');
            });
        });
        
        closeBtn?.addEventListener('click', closeSearch);
        
        // Overlay click
        overlay?.querySelector('[data-search-overlay]')?.addEventListener('click', (e) => {
            if (e.target === e.currentTarget) closeSearch();
        });
        
        // Input handling
        if (input) {
            let debounceTimer;
            
            input.addEventListener('input', () => {
                const value = input.value.trim();
                clearBtn?.classList.toggle('visible', value.length > 0);
                
                clearTimeout(debounceTimer);
                debounceTimer = setTimeout(() => {
                    if (value.length >= 2) {
                        this.showSearchSuggestions(value);
                    } else {
                        suggestions?.classList.remove('open');
                        recentSearches?.classList.remove('open');
                    }
                }, 200);
            });
            
            input.addEventListener('focus', () => {
                const value = input.value.trim();
                if (value.length < 2) {
                    this.showRecentSearches();
                }
            });
        }
        
        clearBtn?.addEventListener('click', () => {
            input.value = '';
            input.focus();
            clearBtn.classList.remove('visible');
            suggestions?.classList.remove('open');
            recentSearches?.classList.remove('open');
        });
        
        // Keyboard shortcut (Cmd/Ctrl + K)
        document.addEventListener('keydown', (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                if (!overlay.classList.contains('open')) {
                    openSearch();
                } else {
                    closeSearch();
                }
            }
            
            if (e.key === 'Escape' && overlay.classList.contains('open')) {
                closeSearch();
            }
        });
    },
    
    showSearchSuggestions(query) {
        // In a real app, this would fetch from an API
        const suggestions = document.querySelector('[data-search-suggestions]');
        const list = suggestions?.querySelector('.suggestions-list');
        if (!list) return;
        
        // Mock suggestions
        const mockSuggestions = [
            { text: 'trench coats', category: 'Women' },
            { text: 'trench coat women', category: 'Women' },
            { text: 'trench coat men', category: 'Men' },
            { text: 'trench coat sale', category: 'Sale' }
        ];
        
        list.innerHTML = mockSuggestions.map(s => `
            <li role="option">
                <button class="suggestion-item w-full text-left px-2 py-3 flex items-center gap-3 text-body-md rounded-lg hover:bg-background-secondary transition-colors" 
                        data-search-suggest="${s.text}">
                    <svg class="suggestion-icon w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                    </svg>
                    <span class="suggestion-text">${s.text}</span>
                    <span class="suggestion-category text-caption">${s.category}</span>
                </button>
            </li>
        `).join('');
        
        suggestions?.classList.add('open');
        
        // Add click handlers
        list.querySelectorAll('[data-search-suggest]').forEach(btn => {
            btn.addEventListener('click', () => {
                const value = btn.dataset.searchSuggest;
                document.querySelector('[data-search-input]')?.value = value;
                document.querySelector('[data-search-form]')?.submit();
            });
        });
    },
    
    showRecentSearches() {
        const recent = document.querySelector('[data-recent-searches]');
        const list = recent?.querySelector('.recent-list');
        if (!list) return;
        
        const recentSearches = JSON.parse(localStorage.getItem('tw_recent_searches') || '[]');
        
        if (recentSearches.length === 0) {
            recent?.classList.remove('open');
            return;
        }
        
        list.innerHTML = recentSearches.map(search => `
            <li role="option">
                <button class="recent-item w-full text-left px-2 py-3 flex items-center justify-between text-body-md rounded-lg hover:bg-background-secondary transition-colors" 
                        data-search-suggest="${search}">
                    <span class="recent-text">${search}</span>
                    <svg class="recent-remove w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                </button>
            </li>
        `).join('');
        
        recent?.classList.add('open');
        
        list.querySelectorAll('[data-search-suggest]').forEach(btn => {
            btn.addEventListener('click', () => {
                const value = btn.dataset.searchSuggest;
                document.querySelector('[data-search-input]')?.value = value;
                document.querySelector('[data-search-form]')?.submit();
            });
        });
        
        list.querySelectorAll('.recent-remove').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const value = btn.closest('[data-search-suggest]')?.dataset.searchSuggest;
                this.removeRecentSearch(value);
            });
        });
    },
    
    removeRecentSearch(value) {
        let searches = JSON.parse(localStorage.getItem('tw_recent_searches') || '[]');
        searches = searches.filter(s => s !== value);
        localStorage.setItem('tw_recent_searches', JSON.stringify(searches));
        this.showRecentSearches();
    },
    
    saveRecentSearch(query) {
        let searches = JSON.parse(localStorage.getItem('tw_recent_searches') || '[]');
        searches = searches.filter(s => s !== query);
        searches.unshift(query);
        searches = searches.slice(0, 10);
        localStorage.setItem('tw_recent_searches', JSON.stringify(searches));
    },
    
    // Cart
    initCart() {
        this.loadCart();
        this.bindCartEvents();
    },
    
    bindCartEvents() {
        const triggers = document.querySelectorAll('[data-cart-trigger]');
        
        triggers.forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                this.openMiniCart();
            });
        });
    },
    
    loadCart() {
        try {
            const cart = JSON.parse(localStorage.getItem('tw_cart') || '{"items":[],"count":0,"total":0}');
            this.cart = cart;
            this.updateCartCount();
        } catch {
            this.cart = { items: [], count: 0, total: 0 };
        }
    },
    
    saveCart() {
        localStorage.setItem('tw_cart', JSON.stringify(this.cart));
        this.updateCartCount();
    },
    
    updateCartCount() {
        const count = this.cart.items.reduce((sum, item) => sum + item.quantity, 0);
        this.cart.count = count;
        this.cart.total = this.cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        
        document.querySelectorAll('.cart-count').forEach(el => {
            el.textContent = count;
            el.classList.toggle('visible', count > 0);
            el.classList.toggle('scale-0', count === 0);
            el.classList.toggle('opacity-0', count === 0);
        });
    },
    
    addToCart(product) {
        const existing = this.cart.items.find(i => i.id === product.id && i.size === product.size && i.color === product.color);
        
        if (existing) {
            existing.quantity += product.quantity || 1;
        } else {
            this.cart.items.push({
                id: product.id,
                name: product.name,
                price: product.price,
                originalPrice: product.originalPrice,
                image: product.image,
                size: product.size,
                color: product.color,
                quantity: product.quantity || 1
            });
        }
        
        this.saveCart();
        this.showToast(`Added ${product.name} to cart`, { type: 'success' });
        this.openMiniCart();
    },
    
    removeFromCart(itemId) {
        this.cart.items = this.cart.items.filter(i => i.id !== itemId);
        this.saveCart();
    },
    
    updateQuantity(itemId, quantity) {
        const item = this.cart.items.find(i => i.id === itemId);
        if (item) {
            item.quantity = Math.max(1, quantity);
            this.saveCart();
        }
    },
    
    openMiniCart() {
        // Dispatch event for mini cart component
        window.dispatchEvent(new CustomEvent('openMiniCart'));
    },
    
    // Wishlist
    initWishlist() {
        try {
            const wishlist = JSON.parse(localStorage.getItem('tw_wishlist') || '{"items":[],"count":0}');
            this.wishlist = wishlist;
            this.updateWishlistCount();
        } catch {
            this.wishlist = { items: [], count: 0 };
        }
    },
    
    updateWishlistCount() {
        const count = this.wishlist.items.length;
        this.wishlist.count = count;
        
        document.querySelectorAll('.wishlist-count').forEach(el => {
            el.textContent = count;
            el.classList.toggle('visible', count > 0);
            el.classList.toggle('scale-0', count === 0);
            el.classList.toggle('opacity-0', count === 0);
        });
    },
    
    toggleWishlist(product) {
        const existing = this.wishlist.items.find(i => i.id === product.id);
        
        if (existing) {
            this.wishlist.items = this.wishlist.items.filter(i => i.id !== product.id);
            this.showToast(`Removed ${product.name} from wishlist`, { type: 'info' });
        } else {
            this.wishlist.items.push(product);
            this.showToast(`Added ${product.name} to wishlist`, { type: 'success' });
        }
        
        this.saveWishlist();
        this.updateWishlistIcons(product.id);
    },
    
    saveWishlist() {
        this.wishlist.count = this.wishlist.items.length;
        localStorage.setItem('tw_wishlist', JSON.stringify(this.wishlist));
    },
    
    updateWishlistIcons(productId) {
        const inWishlist = this.wishlist.items.some(i => i.id === productId);
        document.querySelectorAll(`[data-wishlist-product="${productId}"]`).forEach(el => {
            el.classList.toggle('active', inWishlist);
            el.setAttribute('aria-label', inWishlist ? 'Remove from wishlist' : 'Add to wishlist');
        });
    },
    
    // User
    initUser() {
        const userData = localStorage.getItem('tw_user');
        if (userData) {
            try {
                this.user = { isLoggedIn: true, data: JSON.parse(userData) };
                this.updateUserUI();
            } catch {
                this.user = { isLoggedIn: false, data: null };
            }
        }
    },
    
    updateUserUI() {
        const userName = document.getElementById('user-name');
        const userEmail = document.getElementById('user-email');
        
        if (this.user.isLoggedIn && this.user.data) {
            if (userName) userName.textContent = this.user.data.name || 'Welcome back';
            if (userEmail) userEmail.textContent = this.user.data.email || '';
        }
    },
    
    // Scroll Effects
    initScrollEffects() {
        // Back to top button
        const backToTop = document.querySelector('[data-back-to-top]');
        const backToTopDesktop = document.querySelector('[data-back-to-top-desktop]');
        
        const toggleBackToTop = () => {
            const show = window.scrollY > 300;
            [backToTop, backToTopDesktop].forEach(btn => {
                if (btn) btn.classList.toggle('visible', show);
            });
        };
        
        window.addEventListener('scroll', toggleBackToTop, { passive: true });
        toggleBackToTop();
        
        [backToTop, backToTopDesktop].forEach(btn => {
            btn?.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        });
        
        // Reveal animations
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
        
        document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    },
    
    // Keyboard Shortcuts
    initKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Skip if typing in input
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) return;
            
            // Cmd/Ctrl + K: Search
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                document.querySelector('[data-search-trigger]')?.click();
            }
            
            // Escape: Close modals/drawers
            if (e.key === 'Escape') {
                document.querySelector('[data-search-overlay]')?.classList.remove('open');
                document.querySelector('[data-mobile-nav-drawer]')?.classList.remove('open');
                document.querySelector('[data-mega-menu]')?.classList.remove('open');
                document.querySelector('[data-filter-drawer]')?.classList.add('translate-x-full');
            }
        });
    },
    
    // Toast
    showToast(message, options = {}) {
        if (window.toast) {
            return window.toast.show(message, options);
        }
    },
    
    // Persisted State
    loadPersistedState() {
        // Recently viewed
        try {
            this.recentlyViewed = JSON.parse(localStorage.getItem('tw_recently_viewed') || '[]');
        } catch {
            this.recentlyViewed = [];
        }
    },
    
    addRecentlyViewed(product) {
        this.recentlyViewed = this.recentlyViewed.filter(p => p.id !== product.id);
        this.recentlyViewed.unshift(product);
        this.recentlyViewed = this.recentlyViewed.slice(0, 20);
        localStorage.setItem('tw_recently_viewed', JSON.stringify(this.recentlyViewed));
    }
};

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    window.TrendyWardrobe.init();
});

// Export for modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = window.TrendyWardrobe;
}