// Products page functionality

// Sample product data
const mockProducts = [
    {
        id: 'p1',
        name: 'Radiance Foundation',
        category: 'face',
        price: 45,
        originalPrice: null,
        rating: 4.8,
        reviewCount: 127,
        image: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        badge: 'Best Seller',
        description: 'Full coverage, natural finish foundation',
        concerns: ['acne', 'sensitive'],
        new: false
    },
    {
        id: 'p2',
        name: 'Velvet Matte Lipstick',
        category: 'lips',
        price: 28,
        originalPrice: 35,
        rating: 4.6,
        reviewCount: 89,
        image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        badge: 'Sale',
        description: 'Long-lasting, comfortable wear',
        concerns: [],
        new: true
    },
    {
        id: 'p3',
        name: 'Glow Highlighter',
        category: 'face',
        price: 35,
        originalPrice: null,
        rating: 4.9,
        reviewCount: 156,
        image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        badge: null,
        description: 'Luminous, buildable glow',
        concerns: ['dryness'],
        new: false
    },
    {
        id: 'p4',
        name: 'Lash Boost Mascara',
        category: 'eyes',
        price: 32,
        originalPrice: null,
        rating: 4.4,
        reviewCount: 203,
        image: 'https://images.unsplash.com/photo-1631214540242-8d1ac3331e89?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        badge: 'Cruelty-Free',
        description: 'Volume and length in one',
        concerns: ['sensitive'],
        new: false
    },
    {
        id: 'p5',
        name: 'Cream Blush Palette',
        category: 'face',
        price: 42,
        originalPrice: null,
        rating: 4.7,
        reviewCount: 78,
        image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        badge: null,
        description: 'Natural, blendable cream formula',
        concerns: ['sensitive', 'dryness'],
        new: true
    },
    {
        id: 'p6',
        name: 'Precision Eyeliner',
        category: 'eyes',
        price: 24,
        originalPrice: null,
        rating: 4.5,
        reviewCount: 94,
        image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        badge: null,
        description: 'Precise, smudge-proof formula',
        concerns: ['sensitive'],
        new: false
    },
    {
        id: 'p7',
        name: 'Hydrating Serum',
        category: 'skincare',
        price: 65,
        originalPrice: null,
        rating: 4.8,
        reviewCount: 201,
        image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        badge: 'Best Seller',
        description: 'Intensive hydration for all skin types',
        concerns: ['dryness', 'aging'],
        new: false
    },
    {
        id: 'p8',
        name: 'Lip Gloss Set',
        category: 'lips',
        price: 38,
        originalPrice: 48,
        rating: 4.3,
        reviewCount: 67,
        image: 'https://images.unsplash.com/photo-1583847317554-dd3f2b37c341?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        badge: 'Sale',
        description: 'High-shine, non-sticky formula',
        concerns: [],
        new: false
    },
    {
        id: 'p9',
        name: 'Eyeshadow Palette',
        category: 'eyes',
        price: 58,
        originalPrice: null,
        rating: 4.9,
        reviewCount: 189,
        image: 'https://images.unsplash.com/photo-1631214540242-8d1ac3331e89?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        badge: 'Limited Edition',
        description: '12 versatile shades for day to night',
        concerns: ['sensitive'],
        new: true
    },
    {
        id: 'p10',
        name: 'Setting Spray',
        category: 'face',
        price: 29,
        originalPrice: null,
        rating: 4.6,
        reviewCount: 145,
        image: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        badge: null,
        description: 'Long-lasting makeup hold',
        concerns: ['oily', 'acne'],
        new: false
    }
];

class ProductsManager {
    constructor() {
        this.products = mockProducts;
        this.filteredProducts = [...this.products];
        this.currentFilters = {
            category: [],
            price: [],
            concern: [],
            rating: []
        };
        this.currentSort = 'featured';
        this.productsPerPage = 9;
        this.currentPage = 1;
        this.viewMode = 'grid';
        
        this.init();
    }
    
    init() {
        this.setupFilterToggle();
        this.setupSorting();
        this.setupViewToggle();
        this.setupFilters();
        this.setupMobileFilters();
        this.renderProducts();
        this.updateResultsCount();
        
        // Load more button
        document.getElementById('loadMoreBtn')?.addEventListener('click', () => {
            this.loadMoreProducts();
        });
    }
    
    setupFilterToggle() {
        // Desktop filter toggles
        document.querySelectorAll('[data-filter]').forEach(button => {
            button.addEventListener('click', () => {
                const content = button.nextElementSibling;
                const icon = button.querySelector('i');
                
                content.classList.toggle('hidden');
                icon.classList.toggle('rotate-180');
            });
        });
        
        // Mobile filter sidebar
        const mobileFilterBtn = document.getElementById('mobileFilterBtn');
        const mobileFilterSidebar = document.getElementById('mobileFilterSidebar');
        const closeMobileFilter = document.getElementById('closeMobileFilter');
        
        mobileFilterBtn?.addEventListener('click', () => {
            mobileFilterSidebar.classList.add('active');
            this.createOverlay();
        });
        
        closeMobileFilter?.addEventListener('click', () => {
            mobileFilterSidebar.classList.remove('active');
            this.removeOverlay();
        });
    }
    
    setupSorting() {
        const sortSelect = document.getElementById('sortSelect');
        sortSelect?.addEventListener('change', (e) => {
            this.currentSort = e.target.value;
            this.applySort();
            this.renderProducts();
        });
    }
    
    setupViewToggle() {
        const gridView = document.getElementById('gridView');
        const listView = document.getElementById('listView');
        
        gridView?.addEventListener('click', () => {
            this.viewMode = 'grid';
            gridView.classList.add('active', 'bg-gray-100');
            listView.classList.remove('active', 'bg-gray-100');
            this.renderProducts();
        });
        
        listView?.addEventListener('click', () => {
            this.viewMode = 'list';
            listView.classList.add('active', 'bg-gray-100');
            gridView.classList.remove('active', 'bg-gray-100');
            this.renderProducts();
        });
    }
    
    setupFilters() {
        // Category filters
        document.querySelectorAll('input[name="category"]').forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                this.updateFilter('category', checkbox.value, checkbox.checked);
            });
        });
        
        // Price filters
        document.querySelectorAll('input[name="price"]').forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                this.updateFilter('price', checkbox.value, checkbox.checked);
            });
        });
        
        // Concern filters
        document.querySelectorAll('input[name="concern"]').forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                this.updateFilter('concern', checkbox.value, checkbox.checked);
            });
        });
        
        // Rating filters
        document.querySelectorAll('input[name="rating"]').forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                this.updateFilter('rating', checkbox.value, checkbox.checked);
            });
        });
        
        // Clear all filters
        document.getElementById('clearFilters')?.addEventListener('click', () => {
            this.clearAllFilters();
        });
    }
    
    setupMobileFilters() {
        const applyBtn = document.getElementById('applyMobileFilters');
        applyBtn?.addEventListener('click', () => {
            // Apply mobile filters (for demo, just close sidebar)
            document.getElementById('mobileFilterSidebar').classList.remove('active');
            this.removeOverlay();
        });
    }
    
    updateFilter(type, value, isChecked) {
        if (isChecked) {
            if (!this.currentFilters[type].includes(value)) {
                this.currentFilters[type].push(value);
            }
        } else {
            this.currentFilters[type] = this.currentFilters[type].filter(item => item !== value);
        }
        
        this.applyFilters();
        this.renderProducts();
        this.updateResultsCount();
    }
    
    applyFilters() {
        this.filteredProducts = this.products.filter(product => {
            // Category filter
            if (this.currentFilters.category.length > 0) {
                if (!this.currentFilters.category.includes(product.category)) {
                    return false;
                }
            }
            
            // Price filter
            if (this.currentFilters.price.length > 0) {
                const priceMatch = this.currentFilters.price.some(range => {
                    switch(range) {
                        case '0-25': return product.price < 25;
                        case '25-50': return product.price >= 25 && product.price < 50;
                        case '50-75': return product.price >= 50 && product.price < 75;
                        case '75+': return product.price >= 75;
                        default: return true;
                    }
                });
                if (!priceMatch) return false;
            }
            
            // Concern filter
            if (this.currentFilters.concern.length > 0) {
                const concernMatch = this.currentFilters.concern.some(concern => 
                    product.concerns.includes(concern)
                );
                if (!concernMatch) return false;
            }
            
            // Rating filter
            if (this.currentFilters.rating.length > 0) {
                const ratingMatch = this.currentFilters.rating.some(rating => {
                    const minRating = parseInt(rating);
                    return product.rating >= minRating;
                });
                if (!ratingMatch) return false;
            }
            
            return true;
        });
        
        this.applySort();
        this.currentPage = 1;
    }
    
    applySort() {
        switch(this.currentSort) {
            case 'newest':
                this.filteredProducts.sort((a, b) => b.new - a.new);
                break;
            case 'price-low':
                this.filteredProducts.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                this.filteredProducts.sort((a, b) => b.price - a.price);
                break;
            case 'rating':
                this.filteredProducts.sort((a, b) => b.rating - a.rating);
                break;
            case 'popular':
                this.filteredProducts.sort((a, b) => b.reviewCount - a.reviewCount);
                break;
            default: // featured
                // Keep original order
                break;
        }
    }
    
    clearAllFilters() {
        this.currentFilters = {
            category: [],
            price: [],
            concern: [],
            rating: []
        };
        
        // Uncheck all checkboxes
        document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            checkbox.checked = false;
        });
        
        this.applyFilters();
        this.renderProducts();
        this.updateResultsCount();
    }
    
    renderProducts() {
        const grid = document.getElementById('productsGrid');
        if (!grid) return;
        
        const startIndex = (this.currentPage - 1) * this.productsPerPage;
        const endIndex = startIndex + this.productsPerPage;
        const productsToShow = this.filteredProducts.slice(0, endIndex);
        
        if (this.viewMode === 'grid') {
            grid.className = 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6';
            grid.innerHTML = productsToShow.map(product => this.renderProductCard(product)).join('');
        } else {
            grid.className = 'space-y-6';
            grid.innerHTML = productsToShow.map(product => this.renderProductList(product)).join('');
        }
        
        // Update load more button
        const loadMoreBtn = document.getElementById('loadMoreBtn');
        if (loadMoreBtn) {
            if (endIndex >= this.filteredProducts.length) {
                loadMoreBtn.style.display = 'none';
            } else {
                loadMoreBtn.style.display = 'block';
            }
        }
        
        // Add AOS animation to new products
        setTimeout(() => {
            AOS.refreshHard();
        }, 100);
    }
    
    renderProductCard(product) {
        const discountPercent = product.originalPrice ? 
            Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;
            
        return `
            <div class="product-card" data-aos="fade-up">
                <div class="product-image">
                    ${this.renderBadge(product, discountPercent)}
                    <div class="product-actions">
                        <button class="quick-action" onclick="wishlist.addToWishlist(${JSON.stringify(product).replace(/"/g, '&quot;')})" title="Add to Wishlist">
                            <i class="fas fa-heart"></i>
                        </button>
                        <button class="quick-action" onclick="viewProduct('${product.id}')" title="Quick View">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="quick-action" onclick="openVirtualTryOn('${product.id}')" title="Virtual Try-On">
                            <i class="fas fa-camera"></i>
                        </button>
                    </div>
                    <img src="${product.image}" alt="${product.name}" loading="lazy">
                </div>
                <div class="p-6">
                    <div class="star-rating mb-2">
                        ${this.renderStars(product.rating)}
                        <span class="text-sm text-gray-500 ml-2">(${product.reviewCount} reviews)</span>
                    </div>
                    <h3 class="font-semibold text-lg text-gray-900 mb-2">${product.name}</h3>
                    <p class="text-gray-600 text-sm mb-4">${product.description}</p>
                    <div class="flex items-center justify-between">
                        <div class="flex items-center space-x-2">
                            <span class="text-xl font-bold text-aura-rose">$${product.price}</span>
                            ${product.originalPrice ? `<span class="text-sm text-gray-400 line-through">$${product.originalPrice}</span>` : ''}
                        </div>
                        <button class="btn-primary text-sm px-4 py-2" onclick="cart.addToCart(${JSON.stringify(product).replace(/"/g, '&quot;')})">
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
    
    renderProductList(product) {
        const discountPercent = product.originalPrice ? 
            Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;
            
        return `
            <div class="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300" data-aos="fade-up">
                <div class="flex flex-col md:flex-row">
                    <div class="md:w-64 relative">
                        ${this.renderBadge(product, discountPercent)}
                        <img src="${product.image}" alt="${product.name}" class="w-full h-64 md:h-full object-cover" loading="lazy">
                    </div>
                    <div class="flex-1 p-6 flex flex-col justify-between">
                        <div>
                            <div class="star-rating mb-2">
                                ${this.renderStars(product.rating)}
                                <span class="text-sm text-gray-500 ml-2">(${product.reviewCount} reviews)</span>
                            </div>
                            <h3 class="font-semibold text-xl text-gray-900 mb-2">${product.name}</h3>
                            <p class="text-gray-600 mb-4">${product.description}</p>
                            <div class="flex items-center space-x-2 mb-4">
                                <span class="text-2xl font-bold text-aura-rose">$${product.price}</span>
                                ${product.originalPrice ? `<span class="text-lg text-gray-400 line-through">$${product.originalPrice}</span>` : ''}
                                ${discountPercent > 0 ? `<span class="bg-red-100 text-red-600 px-2 py-1 rounded-full text-sm font-semibold">${discountPercent}% OFF</span>` : ''}
                            </div>
                        </div>
                        <div class="flex items-center space-x-4">
                            <button class="btn-primary flex-1" onclick="cart.addToCart(${JSON.stringify(product).replace(/"/g, '&quot;')})">
                                Add to Cart
                            </button>
                            <button class="btn-secondary px-4 py-2" onclick="viewProduct('${product.id}')">
                                View Details
                            </button>
                            <button class="p-2 rounded-full hover:bg-gray-100 transition-colors" onclick="wishlist.addToWishlist(${JSON.stringify(product).replace(/"/g, '&quot;')})">
                                <i class="fas fa-heart text-gray-600"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    renderBadge(product, discountPercent) {
        if (discountPercent > 0) {
            return `<span class="product-badge bg-red-500">${discountPercent}% OFF</span>`;
        } else if (product.badge === 'Best Seller') {
            return `<span class="product-badge">Best Seller</span>`;
        } else if (product.badge === 'New') {
            return `<span class="product-badge bg-purple-500">New</span>`;
        } else if (product.badge === 'Limited Edition') {
            return `<span class="product-badge bg-gold-500">Limited Edition</span>`;
        } else if (product.badge === 'Cruelty-Free') {
            return `<span class="product-badge bg-green-500">Cruelty-Free</span>`;
        } else if (product.new) {
            return `<span class="product-badge bg-purple-500">New</span>`;
        }
        return '';
    }
    
    renderStars(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        let starsHtml = '';
        
        for (let i = 0; i < fullStars; i++) {
            starsHtml += '<i class="fas fa-star active text-yellow-400"></i>';
        }
        
        if (hasHalfStar) {
            starsHtml += '<i class="fas fa-star-half-alt active text-yellow-400"></i>';
        }
        
        const emptyStars = 5 - Math.ceil(rating);
        for (let i = 0; i < emptyStars; i++) {
            starsHtml += '<i class="fas fa-star text-gray-300"></i>';
        }
        
        return starsHtml;
    }
    
    loadMoreProducts() {
        this.currentPage++;
        this.renderProducts();
    }
    
    updateResultsCount() {
        const resultsCount = document.getElementById('resultsCount');
        if (resultsCount) {
            resultsCount.textContent = this.filteredProducts.length;
        }
    }
    
    createOverlay() {
        const overlay = document.createElement('div');
        overlay.className = 'fixed inset-0 bg-black bg-opacity-50 z-40';
        overlay.addEventListener('click', () => {
            document.getElementById('mobileFilterSidebar').classList.remove('active');
            this.removeOverlay();
        });
        document.body.appendChild(overlay);
    }
    
    removeOverlay() {
        const overlay = document.querySelector('.fixed.inset-0.bg-black.bg-opacity-50.z-40');
        if (overlay) {
            document.body.removeChild(overlay);
        }
    }
}

// Global functions for product interactions
function viewProduct(productId) {
    // Navigate to product detail page
    window.location.href = `product-detail.html?id=${productId}`;
}

function openVirtualTryOn(productId) {
    // Open virtual try-on modal (for demo, show alert)
    alert('Opening Virtual Try-On for product: ' + productId);
}

// Initialize products manager when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.productsManager = new ProductsManager();
});