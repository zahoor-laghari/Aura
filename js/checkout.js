// Checkout page functionality

class CheckoutManager {
    constructor() {
        this.currentStep = 'shipping';
        this.shippingCost = 0;
        this.taxRate = 0.08; // 8% tax rate
        this.orderData = {
            shipping: {},
            payment: {},
            items: []
        };
        
        this.init();
    }
    
    init() {
        // Load cart items
        this.loadCartItems();
        
        // Setup step navigation
        this.setupStepNavigation();
        
        // Setup form validation
        this.setupFormValidation();
        
        // Setup shipping method change
        this.setupShippingMethods();
        
        // Setup payment method toggle
        this.setupPaymentMethods();
        
        // Calculate totals
        this.calculateTotals();
        
        // Format card number input
        this.setupCardFormatting();
    }
    
    loadCartItems() {
        const cartItems = AppState.cart || [];
        const container = document.getElementById('checkoutItems');
        
        if (cartItems.length === 0) {
            container.innerHTML = `
                <div class="text-center py-8">
                    <i class="fas fa-shopping-cart text-4xl text-gray-300 mb-4"></i>
                    <p class="text-gray-500">Your cart is empty</p>
                    <a href="products.html" class="btn-primary mt-4">
                        Shop Now
                    </a>
                </div>
            `;
            return;
        }
        
        container.innerHTML = cartItems.map(item => `
            <div class="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <img src="${item.image}" alt="${item.name}" class="w-12 h-12 object-cover rounded-lg">
                <div class="flex-1 min-w-0">
                    <h4 class="font-medium text-gray-900 text-sm truncate">${item.name}</h4>
                    <p class="text-xs text-gray-500">${item.selectedShade || ''}</p>
                </div>
                <div class="text-right">
                    <div class="font-semibold text-gray-900 text-sm">$${(item.price * item.quantity).toFixed(2)}</div>
                    <div class="text-xs text-gray-500">Qty: ${item.quantity}</div>
                </div>
            </div>
        `).join('');
        
        this.orderData.items = cartItems;
    }
    
    setupStepNavigation() {
        // Continue to Payment
        document.getElementById('continueToPayment')?.addEventListener('click', () => {
            if (this.validateShippingForm()) {
                this.goToStep('payment');
            }
        });
        
        // Back to Shipping
        document.getElementById('backToShipping')?.addEventListener('click', () => {
            this.goToStep('shipping');
        });
        
        // Place Order
        document.getElementById('placeOrder')?.addEventListener('click', () => {
            if (this.validatePaymentForm()) {
                this.processOrder();
            }
        });
    }
    
    goToStep(step) {
        // Update progress indicators
        const steps = document.querySelectorAll('.checkout-step');
        const contents = document.querySelectorAll('.checkout-content');
        
        // Reset all steps
        steps.forEach(stepEl => {
            stepEl.classList.remove('active', 'completed');
            const stepNum = stepEl.querySelector('.step-number');
            stepNum.className = 'step-number';
        });
        
        contents.forEach(content => {
            content.classList.add('hidden');
            content.classList.remove('active');
        });
        
        // Update current step
        this.currentStep = step;
        
        // Show current content
        const currentContent = document.getElementById(`${step}Step`);
        if (currentContent) {
            currentContent.classList.remove('hidden');
            currentContent.classList.add('active');
        }
        
        // Update progress
        const stepOrder = ['shipping', 'payment', 'confirmation'];
        const currentIndex = stepOrder.indexOf(step);
        
        stepOrder.forEach((stepName, index) => {
            const stepEl = document.querySelector(`[data-step="${stepName}"]`);
            const stepNum = stepEl?.querySelector('.step-number');
            
            if (index < currentIndex) {
                // Completed step
                stepEl?.classList.add('completed');
                stepNum?.classList.add('bg-green-500');
            } else if (index === currentIndex) {
                // Active step
                stepEl?.classList.add('active');
                stepNum?.classList.add('bg-aura-rose');
            } else {
                // Upcoming step
                stepNum?.classList.add('bg-gray-400');
            }
        });
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    setupFormValidation() {
        // Real-time validation for required fields
        const requiredFields = document.querySelectorAll('input[required], select[required]');
        
        requiredFields.forEach(field => {
            field.addEventListener('blur', () => {
                this.validateField(field);
            });
            
            field.addEventListener('input', () => {
                // Remove error styling on input
                field.classList.remove('border-red-500');
                const errorMsg = field.parentNode.querySelector('.error-message');
                if (errorMsg) {
                    errorMsg.remove();
                }
            });
        });
    }
    
    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';
        
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'This field is required';
        } else if (field.type === 'email' && value && !this.isValidEmail(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }
        
        if (!isValid) {
            field.classList.add('border-red-500');
            this.showFieldError(field, errorMessage);
        } else {
            field.classList.remove('border-red-500');
            this.removeFieldError(field);
        }
        
        return isValid;
    }
    
    showFieldError(field, message) {
        // Remove existing error
        this.removeFieldError(field);
        
        // Add new error
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message text-red-500 text-sm mt-1';
        errorDiv.textContent = message;
        field.parentNode.appendChild(errorDiv);
    }
    
    removeFieldError(field) {
        const errorMsg = field.parentNode.querySelector('.error-message');
        if (errorMsg) {
            errorMsg.remove();
        }
    }
    
    validateShippingForm() {
        const form = document.getElementById('shippingForm');
        const requiredFields = form.querySelectorAll('input[required], select[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });
        
        if (!isValid) {
            // Scroll to first error
            const firstError = form.querySelector('.border-red-500');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                firstError.focus();
            }
        } else {
            // Save shipping data
            const formData = new FormData(form);
            this.orderData.shipping = Object.fromEntries(formData);
        }
        
        return isValid;
    }
    
    validatePaymentForm() {
        const form = document.getElementById('paymentForm');
        const requiredFields = form.querySelectorAll('input[required], select[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });
        
        if (!isValid) {
            // Scroll to first error
            const firstError = form.querySelector('.border-red-500');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                firstError.focus();
            }
        } else {
            // Save payment data (in real app, this would be handled securely)
            const formData = new FormData(form);
            this.orderData.payment = Object.fromEntries(formData);
        }
        
        return isValid;
    }
    
    setupShippingMethods() {
        const shippingOptions = document.querySelectorAll('input[name="shipping"]');
        
        shippingOptions.forEach(option => {
            option.addEventListener('change', () => {
                switch(option.value) {
                    case 'standard':
                        this.shippingCost = 0;
                        break;
                    case 'express':
                        this.shippingCost = 9.99;
                        break;
                    case 'overnight':
                        this.shippingCost = 24.99;
                        break;
                }
                this.calculateTotals();
            });
        });
    }
    
    setupPaymentMethods() {
        const paymentMethods = document.querySelectorAll('input[name="payment-method"]');
        const cardDetails = document.getElementById('cardDetails');
        
        paymentMethods.forEach(method => {
            method.addEventListener('change', () => {
                if (method.value === 'card') {
                    cardDetails.classList.remove('hidden');
                } else {
                    cardDetails.classList.add('hidden');
                }
            });
        });
        
        // Same as shipping address toggle
        const sameAsShippingCheckbox = document.getElementById('sameAsShipping');
        const billingFields = document.getElementById('billingFields');
        
        sameAsShippingCheckbox?.addEventListener('change', () => {
            if (sameAsShippingCheckbox.checked) {
                billingFields.classList.add('hidden');
            } else {
                billingFields.classList.remove('hidden');
            }
        });
    }
    
    setupCardFormatting() {
        const cardNumberInput = document.querySelector('input[placeholder="1234 5678 9012 3456"]');
        
        if (cardNumberInput) {
            cardNumberInput.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
                let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
                
                e.target.value = formattedValue;
            });
        }
    }
    
    calculateTotals() {
        const cartItems = this.orderData.items;
        
        // Calculate subtotal
        const subtotal = cartItems.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);
        
        // Calculate tax
        const tax = subtotal * this.taxRate;
        
        // Calculate total
        const total = subtotal + this.shippingCost + tax;
        
        // Update display
        document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
        document.getElementById('shippingCost').textContent = this.shippingCost === 0 ? 'Free' : `$${this.shippingCost.toFixed(2)}`;
        document.getElementById('tax').textContent = `$${tax.toFixed(2)}`;
        document.getElementById('total').textContent = `$${total.toFixed(2)}`;
    }
    
    async processOrder() {
        // Show loading state
        const placeOrderBtn = document.getElementById('placeOrder');
        const originalText = placeOrderBtn.innerHTML;
        placeOrderBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Processing...';
        placeOrderBtn.disabled = true;
        
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Generate order number
            const orderNumber = `AUR-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;
            document.getElementById('orderNumber').textContent = `#${orderNumber}`;
            
            // Clear cart
            AppState.cart = [];
            saveState();
            
            // Go to confirmation step
            this.goToStep('confirmation');
            
            // Send confirmation (in real app)
            console.log('Order placed:', this.orderData);
            
        } catch (error) {
            console.error('Order processing error:', error);
            alert('There was an error processing your order. Please try again.');
            
            // Reset button
            placeOrderBtn.innerHTML = originalText;
            placeOrderBtn.disabled = false;
        }
    }
    
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
}

// Initialize checkout manager when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.checkoutManager = new CheckoutManager();
});