// Main JavaScript for Aura Cosmetics

// Initialize AOS (Animate On Scroll)
document.addEventListener('DOMContentLoaded', function() {
    AOS.init({
        duration: 800,
        once: true,
        offset: 100
    });
});

// Global State Management
const AppState = {
    cart: JSON.parse(localStorage.getItem('aura_cart')) || [],
    wishlist: JSON.parse(localStorage.getItem('aura_wishlist')) || [],
    user: JSON.parse(localStorage.getItem('aura_user')) || null,
    currentPage: 'home',
    filters: {},
    searchQuery: ''
};

// Save state to localStorage
function saveState() {
    localStorage.setItem('aura_cart', JSON.stringify(AppState.cart));
    localStorage.setItem('aura_wishlist', JSON.stringify(AppState.wishlist));
    localStorage.setItem('aura_user', JSON.stringify(AppState.user));
}

// Navigation functionality
class Navigation {
    constructor() {
        this.navbar = document.getElementById('navbar');
        this.mobileMenuBtn = document.getElementById('mobileMenuBtn');
        this.mobileMenu = document.getElementById('mobileMenu');
        this.searchInput = document.getElementById('searchInput');
        this.searchDropdown = document.getElementById('searchDropdown');
        
        this.init();
    }
    
    init() {
        // Navbar scroll effect
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                this.navbar.classList.add('shadow-lg');
                this.navbar.classList.remove('bg-white/95');
                this.navbar.classList.add('bg-white');
            } else {
                this.navbar.classList.remove('shadow-lg');
                this.navbar.classList.remove('bg-white');
                this.navbar.classList.add('bg-white/95');
            }
        });
        
        // Mobile menu toggle
        this.mobileMenuBtn?.addEventListener('click', () => {
            this.toggleMobileMenu();
        });
        
        // Search functionality
        this.setupSearch();
        
        // Update cart and wishlist counters
        this.updateCounters();
    }
    
    toggleMobileMenu() {
        this.mobileMenu.classList.toggle('hidden');
        const icon = this.mobileMenuBtn.querySelector('i');
        if (this.mobileMenu.classList.contains('hidden')) {
            icon.className = 'fas fa-bars text-gray-700';
        } else {
            icon.className = 'fas fa-times text-gray-700';
        }
    }
    
    setupSearch() {
        if (!this.searchInput) return;
        
        this.searchInput.addEventListener('focus', () => {
            this.searchDropdown.classList.remove('hidden');
        });
        
        this.searchInput.addEventListener('blur', (e) => {
            // Delay hiding to allow clicking on dropdown items
            setTimeout(() => {
                this.searchDropdown.classList.add('hidden');
            }, 200);
        });
        
        this.searchInput.addEventListener('input', (e) => {
            this.handleSearch(e.target.value);
        });
    }
    
    handleSearch(query) {
        AppState.searchQuery = query;
        
        if (query.length > 2) {
            // Simulate search results
            const mockResults = [
                'Foundation - Perfect Match',
                'Lipstick - Ruby Red',
                'Eyeshadow Palette - Sunset',
                'Concealer - Natural Coverage',
                'Mascara - Volume Plus'
            ].filter(item => item.toLowerCase().includes(query.toLowerCase()));
            
            this.displaySearchResults(mockResults);
        }
    }
    
    displaySearchResults(results) {
        const dropdown = this.searchDropdown;
        dropdown.innerHTML = `
            <div class="p-4">
                <div class="text-sm text-gray-500 mb-2">Search Results</div>
                <div class="space-y-2">
                    ${results.map(result => `
                        <a href="#" class="block text-gray-700 hover:text-aura-rose transition-colors search-item">
                            ${result}
                        </a>
                    `).join('')}
                </div>
            </div>
        `;
        dropdown.classList.remove('hidden');
    }
    
    updateCounters() {
        const cartCount = document.getElementById('cartCount');
        const wishlistCount = document.getElementById('wishlistCount');
        
        if (cartCount) {
            cartCount.textContent = AppState.cart.length;
            cartCount.classList.toggle('hidden', AppState.cart.length === 0);
        }
        
        if (wishlistCount) {
            wishlistCount.textContent = AppState.wishlist.length;
            wishlistCount.classList.toggle('hidden', AppState.wishlist.length === 0);
        }
    }
}

// Shopping Cart functionality
class ShoppingCart {
    constructor() {
        this.cartBtn = document.getElementById('cartBtn');
        this.cartSidebar = null;
        this.createCartSidebar();
        this.init();
    }
    
    init() {
        this.cartBtn?.addEventListener('click', () => {
            this.toggleCart();
        });
    }
    
    createCartSidebar() {
        this.cartSidebar = document.createElement('div');
        this.cartSidebar.className = 'cart-sidebar';
        this.cartSidebar.innerHTML = `
            <div class="flex flex-col h-full">
                <div class="flex items-center justify-between p-6 border-b border-gray-200">
                    <h3 class="text-xl font-semibold text-gray-900">Shopping Cart</h3>
                    <button class="p-2 hover:bg-gray-100 rounded-full transition-colors" id="closeCart">
                        <i class="fas fa-times text-gray-500"></i>
                    </button>
                </div>
                <div class="flex-1 overflow-y-auto" id="cartItems">
                    <!-- Cart items will be populated here -->
                </div>
                <div class="p-6 border-t border-gray-200 bg-gray-50">
                    <div class="flex items-center justify-between mb-4">
                        <span class="text-lg font-semibold">Total:</span>
                        <span class="text-xl font-bold text-aura-rose" id="cartTotal">$0.00</span>
                    </div>
                    <button class="btn-primary w-full" id="checkoutBtn">
                        Proceed to Checkout
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(this.cartSidebar);
        
        // Close cart event
        this.cartSidebar.querySelector('#closeCart').addEventListener('click', () => {
            this.toggleCart();
        });
        
        // Checkout event
        this.cartSidebar.querySelector('#checkoutBtn').addEventListener('click', () => {
            this.goToCheckout();
        });
    }
    
    toggleCart() {
        this.cartSidebar.classList.toggle('active');
        this.updateCartDisplay();
        
        // Add overlay
        if (this.cartSidebar.classList.contains('active')) {
            this.createOverlay();
        } else {
            this.removeOverlay();
        }
    }
    
    addToCart(product) {
        const existingItem = AppState.cart.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            AppState.cart.push({
                ...product,
                quantity: 1,
                addedAt: Date.now()
            });
        }
        
        saveState();
        this.updateCartDisplay();
        
        // Show success message
        this.showAddToCartMessage(product.name);
        
        // Update counter
        const nav = new Navigation();
        nav.updateCounters();
    }
    
    removeFromCart(productId) {
        AppState.cart = AppState.cart.filter(item => item.id !== productId);
        saveState();
        this.updateCartDisplay();
        
        // Update counter
        const nav = new Navigation();
        nav.updateCounters();
    }
    
    updateQuantity(productId, quantity) {
        const item = AppState.cart.find(item => item.id === productId);
        if (item) {
            item.quantity = Math.max(0, quantity);
            if (item.quantity === 0) {
                this.removeFromCart(productId);
            } else {
                saveState();
                this.updateCartDisplay();
            }
        }
    }
    
    updateCartDisplay() {
        const cartItems = this.cartSidebar.querySelector('#cartItems');
        const cartTotal = this.cartSidebar.querySelector('#cartTotal');
        
        if (AppState.cart.length === 0) {
            cartItems.innerHTML = `
                <div class="flex flex-col items-center justify-center h-full text-center p-6">
                    <i class="fas fa-shopping-bag text-6xl text-gray-300 mb-4"></i>
                    <h3 class="text-lg font-semibold text-gray-500 mb-2">Your cart is empty</h3>
                    <p class="text-gray-400 mb-6">Add some beautiful products to get started</p>
                    <button class="btn-primary" onclick="document.querySelector('.cart-sidebar').classList.remove('active')">
                        Continue Shopping
                    </button>
                </div>
            `;
            cartTotal.textContent = '$0.00';
            return;
        }
        
        const total = AppState.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        cartItems.innerHTML = AppState.cart.map(item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}" class="w-16 h-16 object-cover rounded-lg">
                <div class="flex-1 min-w-0">
                    <h4 class="font-semibold text-gray-900 truncate">${item.name}</h4>
                    <p class="text-aura-rose font-semibold">$${item.price.toFixed(2)}</p>
                </div>
                <div class="quantity-controls">
                    <button class="quantity-btn" onclick="cart.updateQuantity('${item.id}', ${item.quantity - 1})">
                        <i class="fas fa-minus text-xs"></i>
                    </button>
                    <span class="w-8 text-center font-semibold">${item.quantity}</span>
                    <button class="quantity-btn" onclick="cart.updateQuantity('${item.id}', ${item.quantity + 1})">
                        <i class="fas fa-plus text-xs"></i>
                    </button>
                </div>
                <button class="text-gray-400 hover:text-red-500 p-2 transition-colors" onclick="cart.removeFromCart('${item.id}')">
                    <i class="fas fa-trash text-sm"></i>
                </button>
            </div>
        `).join('');
        
        cartTotal.textContent = `$${total.toFixed(2)}`;
    }
    
    showAddToCartMessage(productName) {
        const message = document.createElement('div');
        message.className = 'fixed top-24 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transform translate-x-full transition-transform duration-300';
        message.innerHTML = `
            <div class="flex items-center space-x-2">
                <i class="fas fa-check-circle"></i>
                <span>${productName} added to cart!</span>
            </div>
        `;
        
        document.body.appendChild(message);
        
        // Animate in
        setTimeout(() => {
            message.classList.remove('translate-x-full');
        }, 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            message.classList.add('translate-x-full');
            setTimeout(() => {
                document.body.removeChild(message);
            }, 300);
        }, 3000);
    }
    
    createOverlay() {
        const overlay = document.createElement('div');
        overlay.className = 'fixed inset-0 bg-black bg-opacity-50 z-40';
        overlay.addEventListener('click', () => {
            this.toggleCart();
        });
        document.body.appendChild(overlay);
    }
    
    removeOverlay() {
        const overlay = document.querySelector('.fixed.inset-0.bg-black.bg-opacity-50.z-40');
        if (overlay) {
            document.body.removeChild(overlay);
        }
    }
    
    goToCheckout() {
        // Implement checkout navigation
        console.log('Navigating to checkout...');
        this.toggleCart();
    }
}

// Wishlist functionality
class Wishlist {
    constructor() {
        this.wishlistBtn = document.getElementById('wishlistBtn');
        this.init();
    }
    
    init() {
        this.wishlistBtn?.addEventListener('click', () => {
            this.toggleWishlist();
        });
    }
    
    addToWishlist(product) {
        const exists = AppState.wishlist.find(item => item.id === product.id);
        
        if (!exists) {
            AppState.wishlist.push({
                ...product,
                addedAt: Date.now()
            });
            
            saveState();
            
            // Show success message
            this.showWishlistMessage(product.name, 'added');
        } else {
            this.removeFromWishlist(product.id);
        }
        
        // Update counter
        const nav = new Navigation();
        nav.updateCounters();
    }
    
    removeFromWishlist(productId) {
        const product = AppState.wishlist.find(item => item.id === productId);
        AppState.wishlist = AppState.wishlist.filter(item => item.id !== productId);
        
        saveState();
        
        if (product) {
            this.showWishlistMessage(product.name, 'removed');
        }
        
        // Update counter
        const nav = new Navigation();
        nav.updateCounters();
    }
    
    isInWishlist(productId) {
        return AppState.wishlist.some(item => item.id === productId);
    }
    
    showWishlistMessage(productName, action) {
        const message = document.createElement('div');
        const bgColor = action === 'added' ? 'bg-pink-500' : 'bg-gray-500';
        const icon = action === 'added' ? 'fa-heart' : 'fa-heart-broken';
        
        message.className = `fixed top-24 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg z-50 transform translate-x-full transition-transform duration-300`;
        message.innerHTML = `
            <div class="flex items-center space-x-2">
                <i class="fas ${icon}"></i>
                <span>${productName} ${action} ${action === 'added' ? 'to' : 'from'} wishlist!</span>
            </div>
        `;
        
        document.body.appendChild(message);
        
        // Animate in
        setTimeout(() => {
            message.classList.remove('translate-x-full');
        }, 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            message.classList.add('translate-x-full');
            setTimeout(() => {
                document.body.removeChild(message);
            }, 300);
        }, 3000);
    }
    
    toggleWishlist() {
        // Implement wishlist display
        console.log('Toggle wishlist display');
    }
}

// Initialize components when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize navigation
    window.navigation = new Navigation();
    
    // Initialize shopping cart
    window.cart = new ShoppingCart();
    
    // Initialize wishlist
    window.wishlist = new Wishlist();
    
    // Initialize testimonials slider
    if (document.querySelector('.testimonials-swiper')) {
        new Swiper('.testimonials-swiper', {
            slidesPerView: 1,
            spaceBetween: 30,
            loop: true,
            autoplay: {
                delay: 5000,
                disableOnInteraction: false,
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            breakpoints: {
                768: {
                    slidesPerView: 2,
                },
                1024: {
                    slidesPerView: 3,
                }
            }
        });
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Newsletter form handling
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            
            // Show success message
            const message = document.createElement('div');
            message.className = 'fixed top-24 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transform translate-x-full transition-transform duration-300';
            message.innerHTML = `
                <div class="flex items-center space-x-2">
                    <i class="fas fa-check-circle"></i>
                    <span>Thank you for subscribing!</span>
                </div>
            `;
            
            document.body.appendChild(message);
            
            // Animate in
            setTimeout(() => {
                message.classList.remove('translate-x-full');
            }, 100);
            
            // Remove after 3 seconds
            setTimeout(() => {
                message.classList.add('translate-x-full');
                setTimeout(() => {
                    document.body.removeChild(message);
                }, 300);
            }, 3000);
            
            // Reset form
            this.reset();
        });
    }
    
    // Enhanced micro-interactions
    setupMicroInteractions();
    
    // Setup accessibility features
    setupAccessibility();
    
    // Setup responsive enhancements
    setupResponsiveEnhancements();
    
    // Add loading states to buttons (excluding newsletter and cart buttons)
    document.querySelectorAll('button:not([type="submit"]):not(.quantity-btn)').forEach(button => {
        button.addEventListener('click', function() {
            if (!this.classList.contains('loading') && !this.onclick) {
                const originalText = this.innerHTML;
                this.classList.add('loading');
                this.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Loading...';
                
                // Reset after 1 second (simulate API call)
                setTimeout(() => {
                    this.classList.remove('loading');
                    this.innerHTML = originalText;
                }, 1000);
            }
        });
    });
});

// Utility functions
function formatPrice(price) {
    return `$${price.toFixed(2)}`;
}

function generateId() {
    return Math.random().toString(36).substr(2, 9);
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Enhanced micro-interactions
function setupMicroInteractions() {
    // Floating elements animation
    const floatingElements = document.querySelectorAll('.float, [data-float]');
    floatingElements.forEach((element, index) => {
        element.style.animationDelay = `${index * 0.5}s`;
        element.classList.add('float');
    });
    
    // Button hover effects with ripple
    document.querySelectorAll('button, .btn-primary, .btn-secondary').forEach(button => {
        button.addEventListener('click', function(e) {
            createRippleEffect(e, this);
        });
        
        // Add subtle scale animation on hover
        button.addEventListener('mouseenter', function() {
            if (!this.classList.contains('no-hover-scale')) {
                this.style.transform = 'scale(1.02)';
            }
        });
        
        button.addEventListener('mouseleave', function() {
            if (!this.classList.contains('no-hover-scale')) {
                this.style.transform = 'scale(1)';
            }
        });
    });
    
    // Enhanced card hover effects
    document.querySelectorAll('.product-card, .card-hover').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
            this.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.15)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '';
        });
    });
    
    // Parallax scrolling effect for hero sections
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.parallax, [data-parallax]');
        
        parallaxElements.forEach(element => {
            const speed = element.dataset.parallaxSpeed || 0.5;
            element.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
    
    // Enhanced loading animations
    setupLoadingAnimations();
    
    // Image lazy loading with fade-in effect
    setupLazyLoading();
    
    // Magnetic cursor effect for interactive elements
    setupMagneticCursor();
}

function createRippleEffect(event, element) {
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    const ripple = document.createElement('span');
    ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple 0.6s linear;
        left: ${x}px;
        top: ${y}px;
        width: ${size}px;
        height: ${size}px;
        pointer-events: none;
    `;
    
    // Add ripple animation keyframes if not exists
    if (!document.getElementById('ripple-styles')) {
        const style = document.createElement('style');
        style.id = 'ripple-styles';
        style.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(2);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

function setupLoadingAnimations() {
    // Skeleton loading for images
    document.querySelectorAll('img[data-src]').forEach(img => {
        const placeholder = document.createElement('div');
        placeholder.className = 'shimmer bg-gray-200 rounded';
        placeholder.style.cssText = `
            width: ${img.offsetWidth || 300}px;
            height: ${img.offsetHeight || 200}px;
            position: absolute;
            top: 0;
            left: 0;
        `;
        
        img.parentNode.style.position = 'relative';
        img.parentNode.appendChild(placeholder);
        
        img.addEventListener('load', () => {
            placeholder.remove();
            img.style.opacity = '0';
            img.style.transition = 'opacity 0.5s ease-in-out';
            setTimeout(() => {
                img.style.opacity = '1';
            }, 50);
        });
    });
}

function setupLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const src = img.getAttribute('data-src');
                    
                    if (src) {
                        img.setAttribute('src', src);
                        img.removeAttribute('data-src');
                        img.classList.add('fade-in');
                        observer.unobserve(img);
                    }
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

function setupMagneticCursor() {
    const magneticElements = document.querySelectorAll('.btn-primary, .btn-secondary, .quick-action');
    
    magneticElements.forEach(element => {
        element.addEventListener('mousemove', (e) => {
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            element.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px) scale(1.05)`;
        });
        
        element.addEventListener('mouseleave', () => {
            element.style.transform = 'translate(0, 0) scale(1)';
        });
    });
}

function setupAccessibility() {
    // Enhanced keyboard navigation
    document.addEventListener('keydown', (e) => {
        // Close modals with Escape key
        if (e.key === 'Escape') {
            const activeModal = document.querySelector('.modal-overlay.active, .cart-sidebar.active, .filter-sidebar.active');
            if (activeModal) {
                activeModal.classList.remove('active');
                e.preventDefault();
            }
        }
        
        // Navigate carousel with arrow keys
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
            const focusedCarousel = document.querySelector('.swiper:focus-within');
            if (focusedCarousel && focusedCarousel.swiper) {
                if (e.key === 'ArrowLeft') {
                    focusedCarousel.swiper.slidePrev();
                } else {
                    focusedCarousel.swiper.slideNext();
                }
                e.preventDefault();
            }
        }
    });
    
    // Announce dynamic content changes to screen readers
    const announcer = document.createElement('div');
    announcer.setAttribute('aria-live', 'polite');
    announcer.setAttribute('aria-atomic', 'true');
    announcer.className = 'sr-only';
    document.body.appendChild(announcer);
    
    window.announceToScreenReader = (message) => {
        announcer.textContent = message;
        setTimeout(() => {
            announcer.textContent = '';
        }, 1000);
    };
    
    // Enhanced focus management
    document.addEventListener('focusin', (e) => {
        if (e.target.matches('button, input, select, textarea, a')) {
            e.target.setAttribute('data-user-focus', 'true');
        }
    });
    
    document.addEventListener('focusout', (e) => {
        if (e.target.hasAttribute('data-user-focus')) {
            e.target.removeAttribute('data-user-focus');
        }
    });
    
    // Skip navigation link
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 bg-aura-rose text-white px-4 py-2 z-50';
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Add main content landmark if not exists
    if (!document.getElementById('main-content')) {
        const main = document.querySelector('main') || document.querySelector('.container').parentElement;
        if (main) {
            main.id = 'main-content';
        }
    }
}

function setupResponsiveEnhancements() {
    // Responsive font sizing
    function updateFontSizes() {
        const screenWidth = window.innerWidth;
        const root = document.documentElement;
        
        if (screenWidth < 640) {
            root.style.fontSize = '14px';
        } else if (screenWidth < 768) {
            root.style.fontSize = '15px';
        } else {
            root.style.fontSize = '16px';
        }
    }
    
    updateFontSizes();
    window.addEventListener('resize', debounce(updateFontSizes, 250));
    
    // Touch gesture enhancements for mobile
    if ('ontouchstart' in window) {
        document.body.classList.add('touch-device');
        
        // Enhanced touch feedback
        document.addEventListener('touchstart', (e) => {
            if (e.target.matches('button, .btn-primary, .btn-secondary, .product-card')) {
                e.target.style.transform = 'scale(0.98)';
            }
        });
        
        document.addEventListener('touchend', (e) => {
            if (e.target.matches('button, .btn-primary, .btn-secondary, .product-card')) {
                setTimeout(() => {
                    e.target.style.transform = '';
                }, 150);
            }
        });
        
        // Swipe gestures for product galleries
        setupSwipeGestures();
    }
    
    // Viewport height fix for mobile browsers
    function setVH() {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
    
    setVH();
    window.addEventListener('resize', debounce(setVH, 250));
    
    // Responsive image optimization
    if ('IntersectionObserver' in window) {
        const imageOptimizer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const screenWidth = window.innerWidth;
                    
                    // Adjust image quality based on screen size and pixel density
                    const pixelRatio = window.devicePixelRatio || 1;
                    const optimalWidth = Math.ceil(entry.boundingClientRect.width * pixelRatio);
                    
                    if (img.src.includes('unsplash.com')) {
                        const baseUrl = img.src.split('?')[0];
                        const newUrl = `${baseUrl}?w=${optimalWidth}&q=${screenWidth > 768 ? '80' : '60'}`;
                        
                        if (img.src !== newUrl) {
                            img.src = newUrl;
                        }
                    }
                }
            });
        });
        
        document.querySelectorAll('img').forEach(img => {
            imageOptimizer.observe(img);
        });
    }
}

function setupSwipeGestures() {
    let touchStartX = 0;
    let touchStartY = 0;
    
    document.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    });
    
    document.addEventListener('touchmove', (e) => {
        if (!touchStartX || !touchStartY) return;
        
        const touchEndX = e.touches[0].clientX;
        const touchEndY = e.touches[0].clientY;
        
        const diffX = touchStartX - touchEndX;
        const diffY = touchStartY - touchEndY;
        
        // Only handle horizontal swipes that are more significant than vertical
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
            const swipeTarget = e.target.closest('.swiper');
            
            if (swipeTarget && swipeTarget.swiper) {
                if (diffX > 0) {
                    swipeTarget.swiper.slideNext();
                } else {
                    swipeTarget.swiper.slidePrev();
                }
                e.preventDefault();
            }
        }
        
        touchStartX = 0;
        touchStartY = 0;
    });
}

// Performance monitoring
function setupPerformanceMonitoring() {
    if ('performance' in window) {
        window.addEventListener('load', () => {
            const perfData = performance.getEntriesByType('navigation')[0];
            const loadTime = perfData.loadEventEnd - perfData.loadEventStart;
            
            // Log performance metrics (in a real app, send to analytics)
            console.log('Page load time:', loadTime + 'ms');
            
            // Show performance warning if load time is too high
            if (loadTime > 3000) {
                console.warn('Page load time is high. Consider optimizations.');
            }
        });
    }
}

// Initialize performance monitoring
setupPerformanceMonitoring();

// Export for global access
window.AppState = AppState;
window.saveState = saveState;