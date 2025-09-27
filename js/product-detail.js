// Product Detail Page functionality

class ProductDetailManager {
    constructor() {
        this.currentProduct = null;
        this.currentQuantity = 1;
        this.selectedShade = null;
        this.currentRating = 0;
        this.gallerySwiper = null;
        this.thumbsSwiper = null;
        
        this.init();
    }
    
    init() {
        // Get product ID from URL
        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('id') || 'p1';
        
        // Load product data
        this.loadProduct(productId);
        
        // Setup functionality
        this.setupQuantityControls();
        this.setupTabs();
        this.setupVirtualTryOn();
        this.setupReviewForm();
        this.setupImageGallery();
    }
    
    loadProduct(productId) {
        // Mock product data (in a real app, this would come from an API)
        const productData = {
            'p1': {
                id: 'p1',
                name: 'Radiance Foundation',
                category: 'face',
                price: 45,
                originalPrice: 52,
                rating: 4.8,
                reviewCount: 127,
                description: 'Full coverage, natural finish foundation that blends seamlessly for a flawless complexion.',
                images: [
                    'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                    'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                    'https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                    'https://images.unsplash.com/photo-1583847317554-dd3f2b37c341?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
                ],
                shades: [
                    { name: 'Fair', color: '#F5C6A0' },
                    { name: 'Light', color: '#E8B882' },
                    { name: 'Medium', color: '#D4A574' },
                    { name: 'Tan', color: '#C19666' },
                    { name: 'Deep', color: '#A67C52' },
                    { name: 'Dark', color: '#8B4513' }
                ],
                details: `
                    <p>Our Radiance Foundation delivers full coverage with a natural, luminous finish that lasts all day. The lightweight formula blends effortlessly and is suitable for all skin types.</p>
                    <h4 class="font-semibold mt-4 mb-2">Key Benefits:</h4>
                    <ul class="list-disc list-inside space-y-1">
                        <li>Full coverage that feels lightweight</li>
                        <li>24-hour wear with transfer-resistant formula</li>
                        <li>SPF 30 protection for daily wear</li>
                        <li>Available in 24 inclusive shades</li>
                        <li>Suitable for all skin types, including sensitive</li>
                    </ul>
                `,
                ingredients: [
                    { name: 'Water (Aqua)', purpose: 'Base ingredient that provides moisture' },
                    { name: 'Cyclopentasiloxane', purpose: 'Silicone that creates smooth application' },
                    { name: 'Titanium Dioxide', purpose: 'Natural SPF protection and coverage' },
                    { name: 'Niacinamide', purpose: 'Vitamin B3 for skin brightening' },
                    { name: 'Hyaluronic Acid', purpose: 'Provides long-lasting hydration' },
                    { name: 'Vitamin E', purpose: 'Antioxidant protection' }
                ],
                howToUse: [
                    '1. Start with clean, moisturized skin',
                    '2. Apply primer if desired for longer wear',
                    '3. Squeeze a small amount onto the back of your hand',
                    '4. Using a makeup sponge or brush, blend outward from the center of your face',
                    '5. Build coverage gradually for desired finish',
                    '6. Set with translucent powder for all-day wear'
                ]
            }
        };
        
        this.currentProduct = productData[productId] || productData['p1'];
        this.renderProduct();
        this.loadRelatedProducts();
        this.loadReviews();
    }
    
    renderProduct() {
        const product = this.currentProduct;
        
        // Update page title and breadcrumb
        document.title = `${product.name} - Aura Cosmetics`;
        document.getElementById('productBreadcrumb').textContent = product.name;
        
        // Update product information
        document.getElementById('productName').textContent = product.name;
        document.getElementById('productDescription').textContent = product.description;
        document.getElementById('productPrice').textContent = `$${product.price}`;
        
        // Handle original price and discount
        if (product.originalPrice && product.originalPrice > product.price) {
            const discountPercent = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
            document.getElementById('originalPrice').textContent = `$${product.originalPrice}`;
            document.getElementById('originalPrice').classList.remove('hidden');
            document.getElementById('discountBadge').textContent = `${discountPercent}% OFF`;
            document.getElementById('discountBadge').classList.remove('hidden');
        }
        
        // Update rating and review count
        this.renderStars('productRating', product.rating);
        document.getElementById('reviewCount').textContent = `(${product.reviewCount} reviews)`;
        
        // Render shade selector if product has shades
        if (product.shades && product.shades.length > 0) {
            this.renderShadeSelector();
        }
        
        // Render product details
        document.getElementById('productDetailsContent').innerHTML = product.details;
        
        // Render ingredients
        this.renderIngredients();
        
        // Render how to use
        this.renderHowToUse();
        
        // Update reviews count in tab
        document.getElementById('reviewsCount').textContent = product.reviewCount;
    }
    
    renderShadeSelector() {
        const shadeSelector = document.getElementById('shadeSelector');
        const shadeOptions = document.getElementById('shadeOptions');
        
        if (!this.currentProduct.shades) return;
        
        shadeSelector.classList.remove('hidden');
        
        shadeOptions.innerHTML = this.currentProduct.shades.map((shade, index) => `
            <button class="shade-option w-12 h-12 rounded-full border-2 border-transparent hover:scale-110 transition-all duration-200 ${index === 0 ? 'active border-gray-400' : ''}" 
                    style="background-color: ${shade.color}"
                    data-shade="${shade.name}"
                    title="${shade.name}">
            </button>
        `).join('');
        
        // Set first shade as selected
        this.selectedShade = this.currentProduct.shades[0].name;
        
        // Add click handlers
        shadeOptions.querySelectorAll('.shade-option').forEach(button => {
            button.addEventListener('click', () => {
                // Remove active class from all
                shadeOptions.querySelectorAll('.shade-option').forEach(btn => {
                    btn.classList.remove('active', 'border-gray-400');
                });
                
                // Add active class to clicked
                button.classList.add('active', 'border-gray-400');
                this.selectedShade = button.dataset.shade;
            });
        });
    }
    
    renderIngredients() {
        const container = document.getElementById('ingredientsContent');
        
        container.innerHTML = `
            <div class="space-y-4">
                ${this.currentProduct.ingredients.map(ingredient => `
                    <div class="border-l-4 border-aura-rose pl-4">
                        <h5 class="font-semibold text-gray-900">${ingredient.name}</h5>
                        <p class="text-gray-600 text-sm">${ingredient.purpose}</p>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    renderHowToUse() {
        const container = document.getElementById('howToUseContent');
        
        container.innerHTML = `
            <div class="space-y-4">
                ${this.currentProduct.howToUse.map(step => `
                    <div class="flex items-start space-x-3">
                        <div class="w-8 h-8 bg-aura-rose text-white rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
                            ${step.charAt(0)}
                        </div>
                        <p class="text-gray-700 pt-1">${step.substring(2)}</p>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    setupImageGallery() {
        // Populate galleries
        const mainGallery = document.getElementById('mainGallery');
        const thumbnailGallery = document.getElementById('thumbnailGallery');
        
        if (this.currentProduct.images) {
            mainGallery.innerHTML = this.currentProduct.images.map(image => `
                <div class="swiper-slide">
                    <img src="${image}" alt="${this.currentProduct.name}" class="w-full h-full object-cover">
                </div>
            `).join('');
            
            thumbnailGallery.innerHTML = this.currentProduct.images.map(image => `
                <div class="swiper-slide cursor-pointer">
                    <img src="${image}" alt="${this.currentProduct.name}" class="w-full h-20 object-cover rounded-lg">
                </div>
            `).join('');
        }
        
        // Initialize Swiper for thumbnails
        this.thumbsSwiper = new Swiper('.product-gallery-thumbs', {
            spaceBetween: 10,
            slidesPerView: 4,
            freeMode: true,
            watchSlidesProgress: true,
        });
        
        // Initialize Swiper for main gallery
        this.gallerySwiper = new Swiper('.product-gallery-main', {
            spaceBetween: 10,
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            thumbs: {
                swiper: this.thumbsSwiper,
            },
        });
    }
    
    setupQuantityControls() {
        const decreaseBtn = document.getElementById('decreaseQty');
        const increaseBtn = document.getElementById('increaseQty');
        const quantitySpan = document.getElementById('quantity');
        
        decreaseBtn?.addEventListener('click', () => {
            if (this.currentQuantity > 1) {
                this.currentQuantity--;
                quantitySpan.textContent = this.currentQuantity;
            }
        });
        
        increaseBtn?.addEventListener('click', () => {
            this.currentQuantity++;
            quantitySpan.textContent = this.currentQuantity;
        });
        
        // Add to cart button
        document.getElementById('addToCartBtn')?.addEventListener('click', () => {
            const productToAdd = {
                ...this.currentProduct,
                quantity: this.currentQuantity,
                selectedShade: this.selectedShade
            };
            
            // Add multiple quantities
            for (let i = 0; i < this.currentQuantity; i++) {
                window.cart?.addToCart(productToAdd);
            }
        });
        
        // Add to wishlist button
        document.getElementById('addToWishlistBtn')?.addEventListener('click', () => {
            window.wishlist?.addToWishlist(this.currentProduct);
        });
    }
    
    setupTabs() {
        const tabBtns = document.querySelectorAll('.tab-btn');
        const tabPanes = document.querySelectorAll('.tab-pane');
        
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const tabId = btn.dataset.tab;
                
                // Remove active class from all tabs and panes
                tabBtns.forEach(b => {
                    b.classList.remove('active', 'text-aura-rose', 'border-aura-rose');
                    b.classList.add('text-gray-600');
                });
                tabPanes.forEach(pane => pane.classList.add('hidden'));
                
                // Add active class to clicked tab
                btn.classList.add('active', 'text-aura-rose', 'border-b-2', 'border-aura-rose');
                btn.classList.remove('text-gray-600');
                
                // Show corresponding pane
                document.getElementById(tabId)?.classList.remove('hidden');
            });
        });
    }
    
    setupVirtualTryOn() {
        const tryOnBtn = document.getElementById('virtualTryOnBtn');
        const modal = document.getElementById('virtualTryOnModal');
        const closeBtn = document.getElementById('closeTryOnModal');
        
        tryOnBtn?.addEventListener('click', () => {
            this.openVirtualTryOn();
        });
        
        closeBtn?.addEventListener('click', () => {
            this.closeVirtualTryOn();
        });
        
        // Close modal when clicking overlay
        modal?.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeVirtualTryOn();
            }
        });
    }
    
    async openVirtualTryOn() {
        const modal = document.getElementById('virtualTryOnModal');
        const video = document.getElementById('tryOnVideo');
        
        modal.classList.add('active');
        
        try {
            // Request camera access
            const stream = await navigator.mediaDevices.getUserMedia({ 
                video: { 
                    facingMode: 'user',
                    width: { ideal: 640 },
                    height: { ideal: 480 }
                } 
            });
            
            video.srcObject = stream;
            
            // Setup virtual shade selector
            this.setupVirtualShadeSelector();
            
        } catch (error) {
            console.error('Camera access denied:', error);
            alert('Camera access is required for virtual try-on. Please allow camera access and try again.');
            this.closeVirtualTryOn();
        }
    }
    
    closeVirtualTryOn() {
        const modal = document.getElementById('virtualTryOnModal');
        const video = document.getElementById('tryOnVideo');
        
        modal.classList.remove('active');
        
        // Stop camera stream
        if (video.srcObject) {
            video.srcObject.getTracks().forEach(track => track.stop());
            video.srcObject = null;
        }
    }
    
    setupVirtualShadeSelector() {
        const container = document.getElementById('virtualShadeSelector');
        
        if (this.currentProduct.shades) {
            container.innerHTML = this.currentProduct.shades.map(shade => `
                <div class="shade-option" 
                     style="background-color: ${shade.color}"
                     data-shade="${shade.name}"
                     title="${shade.name}">
                </div>
            `).join('');
            
            // Add click handlers for virtual try-on shades
            container.querySelectorAll('.shade-option').forEach(option => {
                option.addEventListener('click', () => {
                    // Remove active from all
                    container.querySelectorAll('.shade-option').forEach(opt => opt.classList.remove('active'));
                    // Add active to clicked
                    option.classList.add('active');
                    
                    // In a real implementation, this would apply AR filter
                    console.log('Applying virtual shade:', option.dataset.shade);
                });
            });
        }
    }
    
    setupReviewForm() {
        const stars = document.querySelectorAll('#reviewStars .star');
        const form = document.getElementById('reviewForm');
        
        // Star rating interaction
        stars.forEach((star, index) => {
            star.addEventListener('click', () => {
                this.currentRating = index + 1;
                this.updateStarRating();
            });
            
            star.addEventListener('mouseover', () => {
                this.highlightStars(index + 1);
            });
        });
        
        // Reset stars on mouse leave
        document.getElementById('reviewStars')?.addEventListener('mouseleave', () => {
            this.updateStarRating();
        });
        
        // Form submission
        form?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.submitReview();
        });
    }
    
    highlightStars(rating) {
        const stars = document.querySelectorAll('#reviewStars .star');
        stars.forEach((star, index) => {
            if (index < rating) {
                star.classList.add('active', 'text-yellow-400');
                star.classList.remove('text-gray-300');
            } else {
                star.classList.remove('active', 'text-yellow-400');
                star.classList.add('text-gray-300');
            }
        });
    }
    
    updateStarRating() {
        this.highlightStars(this.currentRating);
    }
    
    submitReview() {
        if (this.currentRating === 0) {
            alert('Please select a rating');
            return;
        }
        
        // In a real app, this would submit to an API
        const formData = new FormData(document.getElementById('reviewForm'));
        
        // Show success message
        const message = document.createElement('div');
        message.className = 'fixed top-24 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transform translate-x-full transition-transform duration-300';
        message.innerHTML = `
            <div class="flex items-center space-x-2">
                <i class="fas fa-check-circle"></i>
                <span>Thank you for your review!</span>
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
                if (document.body.contains(message)) {
                    document.body.removeChild(message);
                }
            }, 300);
        }, 3000);
        
        // Reset form
        document.getElementById('reviewForm').reset();
        this.currentRating = 0;
        this.updateStarRating();
    }
    
    loadReviews() {
        // Mock reviews data
        const reviews = [
            {
                id: 1,
                name: 'Sarah Johnson',
                rating: 5,
                title: 'Perfect match for my skin tone!',
                review: 'I\'ve been searching for the perfect foundation for years, and this is it! The coverage is amazing and it feels so lightweight. The virtual try-on feature helped me find my exact shade.',
                date: '2025-01-15',
                verified: true
            },
            {
                id: 2,
                name: 'Emily Chen',
                rating: 4,
                title: 'Great foundation, long-lasting',
                review: 'Really happy with this purchase. The foundation stays put all day and doesn\'t oxidize. Only wish there were more undertone options.',
                date: '2025-01-10',
                verified: true
            },
            {
                id: 3,
                name: 'Maria Rodriguez',
                rating: 5,
                title: 'Love the natural finish',
                review: 'This foundation gives me the most natural-looking coverage. Perfect for everyday wear and special occasions. Highly recommend!',
                date: '2025-01-05',
                verified: false
            }
        ];
        
        this.renderReviewsSummary(reviews);
        this.renderReviewsList(reviews);
    }
    
    renderReviewsSummary(reviews) {
        const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
        
        document.getElementById('averageRating').textContent = averageRating.toFixed(1);
        document.getElementById('totalReviews').textContent = `${reviews.length} reviews`;
        
        this.renderStars('averageStars', averageRating);
        
        // Render rating breakdown
        const breakdown = document.getElementById('ratingBreakdown');
        const ratingCounts = [0, 0, 0, 0, 0]; // Index 0 = 1 star, Index 4 = 5 stars
        
        reviews.forEach(review => {
            ratingCounts[review.rating - 1]++;
        });
        
        breakdown.innerHTML = ratingCounts.reverse().map((count, index) => {
            const stars = 5 - index;
            const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
            
            return `
                <div class="flex items-center space-x-3">
                    <span class="text-sm font-medium w-8">${stars} star</span>
                    <div class="flex-1 bg-gray-200 rounded-full h-2">
                        <div class="bg-yellow-400 h-2 rounded-full" style="width: ${percentage}%"></div>
                    </div>
                    <span class="text-sm text-gray-500 w-8">${count}</span>
                </div>
            `;
        }).join('');
    }
    
    renderReviewsList(reviews) {
        const container = document.getElementById('reviewsList');
        
        container.innerHTML = reviews.map(review => `
            <div class="bg-white rounded-2xl shadow-lg p-6">
                <div class="flex items-start justify-between mb-4">
                    <div>
                        <div class="flex items-center space-x-3 mb-2">
                            <h5 class="font-semibold text-gray-900">${review.name}</h5>
                            ${review.verified ? '<span class="bg-green-100 text-green-600 px-2 py-1 rounded-full text-xs font-medium">Verified Purchase</span>' : ''}
                        </div>
                        <div class="star-rating mb-2">
                            ${this.generateStarsHTML(review.rating)}
                        </div>
                        <h6 class="font-medium text-gray-900">${review.title}</h6>
                    </div>
                    <span class="text-sm text-gray-500">${new Date(review.date).toLocaleDateString()}</span>
                </div>
                <p class="text-gray-700">${review.review}</p>
            </div>
        `).join('');
    }
    
    loadRelatedProducts() {
        // Mock related products
        const relatedProducts = [
            {
                id: 'p2',
                name: 'Velvet Matte Lipstick',
                price: 28,
                originalPrice: 35,
                image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
                rating: 4.6,
                reviewCount: 89
            },
            {
                id: 'p3',
                name: 'Glow Highlighter',
                price: 35,
                image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
                rating: 4.9,
                reviewCount: 156
            },
            {
                id: 'p4',
                name: 'Lash Boost Mascara',
                price: 32,
                image: 'https://images.unsplash.com/photo-1631214540242-8d1ac3331e89?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
                rating: 4.4,
                reviewCount: 203
            },
            {
                id: 'p5',
                name: 'Cream Blush Palette',
                price: 42,
                image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
                rating: 4.7,
                reviewCount: 78
            }
        ];
        
        const container = document.getElementById('relatedProducts');
        
        container.innerHTML = relatedProducts.map(product => `
            <div class="product-card" data-aos="fade-up">
                <div class="product-image">
                    <div class="product-actions">
                        <button class="quick-action" onclick="wishlist.addToWishlist(${JSON.stringify(product).replace(/"/g, '&quot;')})">
                            <i class="fas fa-heart"></i>
                        </button>
                        <button class="quick-action" onclick="window.location.href='product-detail.html?id=${product.id}'">
                            <i class="fas fa-eye"></i>
                        </button>
                    </div>
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="p-6">
                    <div class="star-rating mb-2">
                        ${this.generateStarsHTML(product.rating)}
                        <span class="text-sm text-gray-500 ml-2">(${product.reviewCount})</span>
                    </div>
                    <h3 class="font-semibold text-lg text-gray-900 mb-2">${product.name}</h3>
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
        `).join('');
    }
    
    renderStars(containerId, rating) {
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = this.generateStarsHTML(rating);
        }
    }
    
    generateStarsHTML(rating) {
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
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.productDetail = new ProductDetailManager();
});