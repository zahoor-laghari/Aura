// Account page functionality

class AccountManager {
    constructor() {
        this.isLoggedIn = AppState.user !== null;
        this.currentUser = AppState.user;
        this.currentSection = 'overview';
        
        this.init();
    }
    
    init() {
        // Show appropriate view based on login status
        this.toggleAuthView();
        
        // Setup authentication forms
        this.setupAuthForms();
        
        // Setup account navigation (if logged in)
        if (this.isLoggedIn) {
            this.setupAccountNavigation();
            this.loadUserData();
        }
    }
    
    toggleAuthView() {
        const authForms = document.getElementById('authForms');
        const accountDashboard = document.getElementById('accountDashboard');
        
        if (this.isLoggedIn) {
            authForms.classList.add('hidden');
            accountDashboard.classList.remove('hidden');
        } else {
            authForms.classList.remove('hidden');
            accountDashboard.classList.add('hidden');
        }
    }
    
    setupAuthForms() {
        // Tab switching
        const authTabs = document.querySelectorAll('.auth-tab');
        const authForms = document.querySelectorAll('.auth-form');
        
        authTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const targetTab = tab.dataset.tab;
                
                // Remove active class from all tabs and forms
                authTabs.forEach(t => {
                    t.classList.remove('active', 'text-aura-rose', 'border-aura-rose');
                    t.classList.add('text-gray-600');
                });
                authForms.forEach(form => form.classList.add('hidden'));
                
                // Add active class to clicked tab
                tab.classList.add('active', 'text-aura-rose', 'border-b-2', 'border-aura-rose');
                tab.classList.remove('text-gray-600');
                
                // Show corresponding form
                if (targetTab === 'login') {
                    document.getElementById('loginForm').classList.remove('hidden');
                } else {
                    document.getElementById('registerForm').classList.remove('hidden');
                }
            });
        });
        
        // Form submissions
        document.getElementById('signInForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin(e.target);
        });
        
        document.getElementById('signUpForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleRegister(e.target);
        });
    }
    
    setupAccountNavigation() {
        const navButtons = document.querySelectorAll('.account-nav-btn');
        const sections = document.querySelectorAll('.account-section');
        
        navButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetSection = btn.dataset.section;
                
                // Remove active class from all buttons and sections
                navButtons.forEach(b => {
                    b.classList.remove('active', 'bg-aura-rose', 'text-white');
                    b.classList.add('text-gray-700', 'hover:bg-gray-100');
                });
                sections.forEach(section => {
                    section.classList.add('hidden');
                    section.classList.remove('active');
                });
                
                // Add active class to clicked button
                btn.classList.add('active', 'bg-aura-rose', 'text-white');
                btn.classList.remove('text-gray-700', 'hover:bg-gray-100');
                
                // Show corresponding section
                const targetElement = document.getElementById(`${targetSection}Section`);
                if (targetElement) {
                    targetElement.classList.remove('hidden');
                    targetElement.classList.add('active');
                }
                
                this.currentSection = targetSection;
                this.loadSectionData(targetSection);
            });
        });
        
        // Logout button
        document.getElementById('logoutBtn')?.addEventListener('click', () => {
            this.handleLogout();
        });
        
        // Profile form submission
        document.getElementById('profileForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.updateProfile(e.target);
        });
    }
    
    async handleLogin(form) {
        const formData = new FormData(form);
        const email = formData.get('email');
        const password = formData.get('password');
        
        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Signing In...';
        submitBtn.disabled = true;
        
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Mock user data
            const userData = {
                id: '12345',
                firstName: 'Jane',
                lastName: 'Doe',
                email: email,
                phone: '',
                avatar: 'JD',
                joinDate: '2024-01-15',
                preferences: {
                    newsletter: true,
                    sms: true,
                    push: false
                }
            };
            
            // Save user data
            AppState.user = userData;
            this.currentUser = userData;
            this.isLoggedIn = true;
            saveState();
            
            // Show success message
            this.showMessage('Successfully signed in!', 'success');
            
            // Switch to dashboard
            this.toggleAuthView();
            this.setupAccountNavigation();
            this.loadUserData();
            
        } catch (error) {
            this.showMessage('Invalid email or password', 'error');
        } finally {
            // Reset button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }
    
    async handleRegister(form) {
        const formData = new FormData(form);
        const firstName = formData.get('firstName');
        const lastName = formData.get('lastName');
        const email = formData.get('email');
        const password = formData.get('password');
        
        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Creating Account...';
        submitBtn.disabled = true;
        
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Mock user data
            const userData = {
                id: '12345',
                firstName: firstName,
                lastName: lastName,
                email: email,
                phone: '',
                avatar: firstName.charAt(0) + lastName.charAt(0),
                joinDate: new Date().toISOString().split('T')[0],
                preferences: {
                    newsletter: formData.get('newsletter') === 'on',
                    sms: true,
                    push: false
                }
            };
            
            // Save user data
            AppState.user = userData;
            this.currentUser = userData;
            this.isLoggedIn = true;
            saveState();
            
            // Show success message
            this.showMessage('Account created successfully! Welcome to Aura!', 'success');
            
            // Switch to dashboard
            this.toggleAuthView();
            this.setupAccountNavigation();
            this.loadUserData();
            
        } catch (error) {
            this.showMessage('Error creating account. Please try again.', 'error');
        } finally {
            // Reset button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }
    
    handleLogout() {
        // Clear user data
        AppState.user = null;
        this.currentUser = null;
        this.isLoggedIn = false;
        saveState();
        
        // Show message
        this.showMessage('Successfully logged out', 'success');
        
        // Switch to auth forms
        this.toggleAuthView();
        
        // Reset forms
        document.getElementById('signInForm').reset();
        document.getElementById('signUpForm').reset();
    }
    
    loadUserData() {
        if (!this.currentUser) return;
        
        // Update user info in sidebar
        document.getElementById('userName').textContent = `${this.currentUser.firstName} ${this.currentUser.lastName}`;
        document.getElementById('userEmail').textContent = this.currentUser.email;
        document.getElementById('userAvatar').textContent = this.currentUser.avatar;
        
        // Load overview data
        this.loadOverviewData();
    }
    
    loadOverviewData() {
        // Mock data for overview
        const mockOrders = [
            {
                id: 'AUR-2025-001',
                date: '2025-01-20',
                items: ['Radiance Foundation', 'Velvet Matte Lipstick'],
                total: 73.00,
                status: 'delivered'
            },
            {
                id: 'AUR-2025-002',
                date: '2025-01-15',
                items: ['Glow Highlighter'],
                total: 35.00,
                status: 'shipped'
            }
        ];
        
        // Update stats
        document.getElementById('totalOrders').textContent = mockOrders.length;
        document.getElementById('totalSpent').textContent = `$${mockOrders.reduce((sum, order) => sum + order.total, 0).toFixed(2)}`;
        document.getElementById('wishlistItems').textContent = AppState.wishlist.length;
        
        // Load recent orders
        this.renderRecentOrders(mockOrders.slice(0, 3));
    }
    
    renderRecentOrders(orders) {
        const container = document.getElementById('recentOrders');
        
        if (orders.length === 0) {
            container.innerHTML = `
                <div class="text-center py-8">
                    <i class="fas fa-shopping-bag text-4xl text-gray-300 mb-4"></i>
                    <p class="text-gray-500 mb-4">No orders yet</p>
                    <a href="products.html" class="btn-primary">
                        Start Shopping
                    </a>
                </div>
            `;
            return;
        }
        
        container.innerHTML = orders.map(order => `
            <div class="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div class="flex items-center justify-between mb-2">
                    <div class="font-semibold text-gray-900">${order.id}</div>
                    <span class="px-3 py-1 rounded-full text-sm font-medium ${this.getStatusClasses(order.status)}">
                        ${order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                </div>
                <div class="text-sm text-gray-600 mb-2">${new Date(order.date).toLocaleDateString()}</div>
                <div class="text-sm text-gray-700 mb-2">${order.items.join(', ')}</div>
                <div class="font-semibold text-aura-rose">$${order.total.toFixed(2)}</div>
            </div>
        `).join('');
    }
    
    loadSectionData(section) {
        switch(section) {
            case 'orders':
                this.loadOrderHistory();
                break;
            case 'wishlist':
                this.loadWishlistData();
                break;
            case 'addresses':
                this.loadAddresses();
                break;
        }
    }
    
    loadOrderHistory() {
        // Mock order history data
        const mockOrders = [
            {
                id: 'AUR-2025-001',
                date: '2025-01-20',
                items: [
                    { name: 'Radiance Foundation', price: 45, quantity: 1, image: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=100' },
                    { name: 'Velvet Matte Lipstick', price: 28, quantity: 1, image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=100' }
                ],
                shipping: 0,
                tax: 5.84,
                total: 78.84,
                status: 'delivered',
                trackingNumber: 'TRK123456789'
            },
            {
                id: 'AUR-2025-002',
                date: '2025-01-15',
                items: [
                    { name: 'Glow Highlighter', price: 35, quantity: 1, image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=100' }
                ],
                shipping: 0,
                tax: 2.80,
                total: 37.80,
                status: 'shipped',
                trackingNumber: 'TRK987654321'
            }
        ];
        
        const container = document.getElementById('orderHistory');
        
        container.innerHTML = mockOrders.map(order => `
            <div class="border border-gray-200 rounded-xl p-6">
                <div class="flex items-center justify-between mb-4">
                    <div>
                        <h3 class="font-semibold text-lg text-gray-900">${order.id}</h3>
                        <p class="text-gray-600">${new Date(order.date).toLocaleDateString()}</p>
                    </div>
                    <span class="px-4 py-2 rounded-full text-sm font-medium ${this.getStatusClasses(order.status)}">
                        ${order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                </div>
                
                <div class="space-y-3 mb-4">
                    ${order.items.map(item => `
                        <div class="flex items-center space-x-4">
                            <img src="${item.image}" alt="${item.name}" class="w-12 h-12 rounded-lg object-cover">
                            <div class="flex-1">
                                <div class="font-medium text-gray-900">${item.name}</div>
                                <div class="text-gray-600 text-sm">Qty: ${item.quantity}</div>
                            </div>
                            <div class="font-semibold text-gray-900">$${(item.price * item.quantity).toFixed(2)}</div>
                        </div>
                    `).join('')}
                </div>
                
                <div class="border-t border-gray-200 pt-4">
                    <div class="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Subtotal:</span>
                        <span>$${order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}</span>
                    </div>
                    <div class="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Shipping:</span>
                        <span>${order.shipping === 0 ? 'Free' : '$' + order.shipping.toFixed(2)}</span>
                    </div>
                    <div class="flex justify-between text-sm text-gray-600 mb-2">
                        <span>Tax:</span>
                        <span>$${order.tax.toFixed(2)}</span>
                    </div>
                    <div class="flex justify-between font-semibold text-lg border-t border-gray-200 pt-2">
                        <span>Total:</span>
                        <span class="text-aura-rose">$${order.total.toFixed(2)}</span>
                    </div>
                </div>
                
                ${order.trackingNumber ? `
                    <div class="mt-4 pt-4 border-t border-gray-200">
                        <div class="flex items-center justify-between">
                            <div>
                                <div class="text-sm text-gray-600">Tracking Number:</div>
                                <div class="font-medium">${order.trackingNumber}</div>
                            </div>
                            <button class="btn-secondary text-sm px-4 py-2">
                                Track Order
                            </button>
                        </div>
                    </div>
                ` : ''}
            </div>
        `).join('');
    }
    
    loadWishlistData() {
        const container = document.getElementById('wishlistGrid');
        const wishlistItems = AppState.wishlist || [];
        
        if (wishlistItems.length === 0) {
            container.innerHTML = `
                <div class="col-span-full text-center py-12">
                    <i class="fas fa-heart text-6xl text-gray-300 mb-4"></i>
                    <h3 class="text-xl font-semibold text-gray-600 mb-2">Your wishlist is empty</h3>
                    <p class="text-gray-500 mb-6">Save your favorite products to buy them later</p>
                    <a href="products.html" class="btn-primary">
                        Browse Products
                    </a>
                </div>
            `;
            return;
        }
        
        container.innerHTML = wishlistItems.map(item => `
            <div class="product-card group">
                <div class="product-image">
                    <div class="product-actions">
                        <button class="quick-action" onclick="wishlist.removeFromWishlist('${item.id}')" title="Remove from Wishlist">
                            <i class="fas fa-times"></i>
                        </button>
                        <button class="quick-action" onclick="window.location.href='product-detail.html?id=${item.id}'" title="View Product">
                            <i class="fas fa-eye"></i>
                        </button>
                    </div>
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="p-6">
                    <h3 class="font-semibold text-lg text-gray-900 mb-2">${item.name}</h3>
                    <div class="flex items-center justify-between">
                        <span class="text-xl font-bold text-aura-rose">$${item.price}</span>
                        <button class="btn-primary text-sm px-4 py-2" onclick="cart.addToCart(${JSON.stringify(item).replace(/"/g, '&quot;')})">
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }
    
    loadAddresses() {
        // Mock addresses data
        const mockAddresses = [
            {
                id: 1,
                type: 'Home',
                firstName: 'Jane',
                lastName: 'Doe',
                address: '123 Main Street',
                city: 'New York',
                state: 'NY',
                zip: '10001',
                isDefault: true
            }
        ];
        
        const container = document.getElementById('addressesGrid');
        
        container.innerHTML = mockAddresses.map(address => `
            <div class="border border-gray-200 rounded-xl p-6 relative">
                ${address.isDefault ? '<div class="absolute top-4 right-4 bg-aura-rose text-white px-2 py-1 rounded-full text-xs font-medium">Default</div>' : ''}
                <div class="mb-4">
                    <h3 class="font-semibold text-lg text-gray-900">${address.type}</h3>
                </div>
                <div class="text-gray-700 space-y-1">
                    <div>${address.firstName} ${address.lastName}</div>
                    <div>${address.address}</div>
                    <div>${address.city}, ${address.state} ${address.zip}</div>
                </div>
                <div class="mt-4 flex space-x-2">
                    <button class="btn-secondary text-sm px-3 py-2">Edit</button>
                    <button class="text-red-600 hover:text-red-700 text-sm px-3 py-2">Delete</button>
                </div>
            </div>
        `).join('');
    }
    
    updateProfile(form) {
        const formData = new FormData(form);
        
        // Update user data
        this.currentUser.firstName = formData.get('firstName');
        this.currentUser.lastName = formData.get('lastName');
        this.currentUser.email = formData.get('email');
        this.currentUser.phone = formData.get('phone');
        
        // Update avatar
        this.currentUser.avatar = this.currentUser.firstName.charAt(0) + this.currentUser.lastName.charAt(0);
        
        // Save to storage
        AppState.user = this.currentUser;
        saveState();
        
        // Update UI
        this.loadUserData();
        
        // Show success message
        this.showMessage('Profile updated successfully!', 'success');
    }
    
    getStatusClasses(status) {
        switch(status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'processing':
                return 'bg-blue-100 text-blue-800';
            case 'shipped':
                return 'bg-purple-100 text-purple-800';
            case 'delivered':
                return 'bg-green-100 text-green-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    }
    
    showMessage(message, type = 'success') {
        const messageDiv = document.createElement('div');
        const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';
        
        messageDiv.className = `fixed top-24 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg z-50 transform translate-x-full transition-transform duration-300`;
        messageDiv.innerHTML = `
            <div class="flex items-center space-x-2">
                <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(messageDiv);
        
        // Animate in
        setTimeout(() => {
            messageDiv.classList.remove('translate-x-full');
        }, 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            messageDiv.classList.add('translate-x-full');
            setTimeout(() => {
                if (document.body.contains(messageDiv)) {
                    document.body.removeChild(messageDiv);
                }
            }, 300);
        }, 3000);
    }
}

// Global function for password toggle
function togglePassword(button) {
    const input = button.parentNode.querySelector('input');
    const icon = button.querySelector('i');
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

// Initialize account manager when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.accountManager = new AccountManager();
});