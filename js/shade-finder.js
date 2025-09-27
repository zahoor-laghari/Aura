// Shade Finder Quiz functionality

class ShadeFinderQuiz {
    constructor() {
        this.currentQuestion = 0;
        this.totalQuestions = 0;
        this.answers = {};
        this.recommendations = [];
        this.skinProfile = {};
        
        // Quiz questions data
        this.questions = [
            {
                id: 'skin-tone',
                title: 'What\'s your natural skin tone?',
                subtitle: 'Look at the veins on your wrist to help determine your undertone',
                type: 'image-choice',
                options: [
                    {
                        id: 'fair',
                        label: 'Fair',
                        description: 'Light skin that burns easily',
                        image: 'https://images.unsplash.com/photo-1494790108755-2616c669-6266?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'
                    },
                    {
                        id: 'light',
                        label: 'Light',
                        description: 'Light to medium skin',
                        image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'
                    },
                    {
                        id: 'medium',
                        label: 'Medium',
                        description: 'Medium skin that tans well',
                        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'
                    },
                    {
                        id: 'tan',
                        label: 'Tan',
                        description: 'Deeper medium skin',
                        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'
                    },
                    {
                        id: 'deep',
                        label: 'Deep',
                        description: 'Rich, deep skin tone',
                        image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'
                    },
                    {
                        id: 'dark',
                        label: 'Dark',
                        description: 'Very deep skin tone',
                        image: 'https://images.unsplash.com/photo-1544717297-fa95b6ee9643?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'
                    }
                ]
            },
            {
                id: 'undertone',
                title: 'What\'s your skin\'s undertone?',
                subtitle: 'Look at your veins - blue/purple veins indicate cool, green veins indicate warm, both indicate neutral',
                type: 'color-choice',
                options: [
                    {
                        id: 'cool',
                        label: 'Cool',
                        description: 'Pink, red, or blue undertones',
                        color: '#FFB6C1'
                    },
                    {
                        id: 'warm',
                        label: 'Warm',
                        description: 'Yellow, golden, or peach undertones',
                        color: '#F4A460'
                    },
                    {
                        id: 'neutral',
                        label: 'Neutral',
                        description: 'Balanced mix of cool and warm',
                        color: '#DDD'
                    }
                ]
            },
            {
                id: 'coverage',
                title: 'What coverage do you prefer?',
                subtitle: 'Think about your daily makeup routine and preferences',
                type: 'text-choice',
                options: [
                    {
                        id: 'light',
                        label: 'Light Coverage',
                        description: 'Natural, barely-there look that evens skin tone',
                        icon: 'fas fa-feather'
                    },
                    {
                        id: 'medium',
                        label: 'Medium Coverage',
                        description: 'Buildable coverage that hides minor imperfections',
                        icon: 'fas fa-adjust'
                    },
                    {
                        id: 'full',
                        label: 'Full Coverage',
                        description: 'Complete coverage that hides all imperfections',
                        icon: 'fas fa-shield-alt'
                    }
                ]
            },
            {
                id: 'skin-type',
                title: 'What\'s your skin type?',
                subtitle: 'This helps us recommend the right formula for you',
                type: 'text-choice',
                options: [
                    {
                        id: 'dry',
                        label: 'Dry',
                        description: 'Often feels tight, flaky, or rough',
                        icon: 'fas fa-tint-slash'
                    },
                    {
                        id: 'oily',
                        label: 'Oily',
                        description: 'Shiny, especially in T-zone area',
                        icon: 'fas fa-droplet'
                    },
                    {
                        id: 'combination',
                        label: 'Combination',
                        description: 'Oily T-zone with dry cheeks',
                        icon: 'fas fa-balance-scale'
                    },
                    {
                        id: 'sensitive',
                        label: 'Sensitive',
                        description: 'Easily irritated or reactive',
                        icon: 'fas fa-exclamation-triangle'
                    },
                    {
                        id: 'normal',
                        label: 'Normal',
                        description: 'Well-balanced, not too oily or dry',
                        icon: 'fas fa-check-circle'
                    }
                ]
            },
            {
                id: 'concerns',
                title: 'What are your main skin concerns?',
                subtitle: 'Select all that apply - this helps us customize your recommendations',
                type: 'multiple-choice',
                options: [
                    {
                        id: 'acne',
                        label: 'Acne & Blemishes',
                        description: 'Breakouts and acne scarring',
                        icon: 'fas fa-ban'
                    },
                    {
                        id: 'dark-circles',
                        label: 'Dark Circles',
                        description: 'Under-eye darkness',
                        icon: 'fas fa-eye'
                    },
                    {
                        id: 'redness',
                        label: 'Redness',
                        description: 'Rosacea or general redness',
                        icon: 'fas fa-heart'
                    },
                    {
                        id: 'uneven-tone',
                        label: 'Uneven Skin Tone',
                        description: 'Discoloration and patches',
                        icon: 'fas fa-palette'
                    },
                    {
                        id: 'fine-lines',
                        label: 'Fine Lines',
                        description: 'Aging and wrinkles',
                        icon: 'fas fa-calendar-alt'
                    },
                    {
                        id: 'none',
                        label: 'None of the Above',
                        description: 'No major concerns',
                        icon: 'fas fa-smile'
                    }
                ]
            },
            {
                id: 'lifestyle',
                title: 'How would you describe your lifestyle?',
                subtitle: 'This helps us recommend products that fit your daily routine',
                type: 'text-choice',
                options: [
                    {
                        id: 'minimal',
                        label: 'Minimal Makeup',
                        description: 'Quick 5-minute routine, natural look',
                        icon: 'fas fa-clock'
                    },
                    {
                        id: 'everyday',
                        label: 'Everyday Glam',
                        description: 'Polished look for work and daily activities',
                        icon: 'fas fa-briefcase'
                    },
                    {
                        id: 'full-glam',
                        label: 'Full Glam',
                        description: 'Love bold looks and have time for detailed application',
                        icon: 'fas fa-star'
                    },
                    {
                        id: 'special-occasion',
                        label: 'Special Occasions',
                        description: 'Mainly for events, photos, and nights out',
                        icon: 'fas fa-glass-cheers'
                    }
                ]
            }
        ];
        
        this.totalQuestions = this.questions.length;
        this.init();
    }
    
    init() {
        // Setup event listeners
        document.getElementById('startQuizBtn')?.addEventListener('click', () => {
            this.startQuiz();
        });
        
        document.getElementById('nextBtn')?.addEventListener('click', () => {
            this.nextQuestion();
        });
        
        document.getElementById('prevBtn')?.addEventListener('click', () => {
            this.prevQuestion();
        });
        
        document.getElementById('retakeQuizBtn')?.addEventListener('click', () => {
            this.retakeQuiz();
        });
        
        document.getElementById('shopRecommendationsBtn')?.addEventListener('click', () => {
            window.location.href = 'products.html';
        });
        
        // Initialize AOS
        AOS.init({
            duration: 800,
            once: true
        });
    }
    
    startQuiz() {
        this.showScreen('questionsScreen');
        this.loadQuestion(0);
        this.updateProgress();
    }
    
    showScreen(screenId) {
        // Hide all screens
        document.querySelectorAll('.quiz-screen').forEach(screen => {
            screen.classList.add('hidden');
            screen.classList.remove('active');
        });
        
        // Show target screen
        const targetScreen = document.getElementById(screenId);
        if (targetScreen) {
            targetScreen.classList.remove('hidden');
            targetScreen.classList.add('active');
        }
    }
    
    loadQuestion(questionIndex) {
        if (questionIndex >= this.totalQuestions) {
            this.showResults();
            return;
        }
        
        this.currentQuestion = questionIndex;
        const question = this.questions[questionIndex];
        const container = document.getElementById('questionContainer');
        
        let optionsHtml = '';
        
        switch (question.type) {
            case 'image-choice':
                optionsHtml = this.renderImageChoiceOptions(question);
                break;
            case 'color-choice':
                optionsHtml = this.renderColorChoiceOptions(question);
                break;
            case 'text-choice':
                optionsHtml = this.renderTextChoiceOptions(question);
                break;
            case 'multiple-choice':
                optionsHtml = this.renderMultipleChoiceOptions(question);
                break;
        }
        
        container.innerHTML = `
            <div class="text-center mb-8">
                <div class="text-sm font-medium text-aura-rose mb-2">
                    Question ${questionIndex + 1} of ${this.totalQuestions}
                </div>
                <h2 class="font-playfair text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                    ${question.title}
                </h2>
                <p class="text-lg text-gray-600 max-w-2xl mx-auto">
                    ${question.subtitle}
                </p>
            </div>
            
            <div class="question-options">
                ${optionsHtml}
            </div>
        `;
        
        this.updateNavigation();
        this.updateProgress();
    }
    
    renderImageChoiceOptions(question) {
        return `
            <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                ${question.options.map(option => `
                    <div class="option-card cursor-pointer border-2 border-gray-200 rounded-xl p-4 hover:border-aura-rose transition-all duration-300 ${this.answers[question.id] === option.id ? 'border-aura-rose bg-rose-50' : ''}"
                         data-question="${question.id}" data-value="${option.id}">
                        <div class="aspect-square rounded-lg overflow-hidden mb-3">
                            <img src="${option.image}" alt="${option.label}" class="w-full h-full object-cover">
                        </div>
                        <h3 class="font-semibold text-gray-900 mb-1">${option.label}</h3>
                        <p class="text-sm text-gray-600">${option.description}</p>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    renderColorChoiceOptions(question) {
        return `
            <div class="grid md:grid-cols-3 gap-6">
                ${question.options.map(option => `
                    <div class="option-card cursor-pointer border-2 border-gray-200 rounded-xl p-6 hover:border-aura-rose transition-all duration-300 text-center ${this.answers[question.id] === option.id ? 'border-aura-rose bg-rose-50' : ''}"
                         data-question="${question.id}" data-value="${option.id}">
                        <div class="w-16 h-16 rounded-full mx-auto mb-4 border-4 border-white shadow-lg" 
                             style="background-color: ${option.color}"></div>
                        <h3 class="font-semibold text-gray-900 mb-2">${option.label}</h3>
                        <p class="text-sm text-gray-600">${option.description}</p>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    renderTextChoiceOptions(question) {
        return `
            <div class="space-y-4">
                ${question.options.map(option => `
                    <div class="option-card cursor-pointer border-2 border-gray-200 rounded-xl p-6 hover:border-aura-rose transition-all duration-300 flex items-center space-x-4 ${this.answers[question.id] === option.id ? 'border-aura-rose bg-rose-50' : ''}"
                         data-question="${question.id}" data-value="${option.id}">
                        <div class="w-12 h-12 bg-aura-rose/10 rounded-full flex items-center justify-center flex-shrink-0">
                            <i class="${option.icon} text-aura-rose"></i>
                        </div>
                        <div class="flex-1">
                            <h3 class="font-semibold text-gray-900 mb-1">${option.label}</h3>
                            <p class="text-gray-600">${option.description}</p>
                        </div>
                        <div class="flex-shrink-0">
                            <div class="w-6 h-6 border-2 border-gray-300 rounded-full ${this.answers[question.id] === option.id ? 'bg-aura-rose border-aura-rose' : ''}">
                                ${this.answers[question.id] === option.id ? '<i class="fas fa-check text-white text-xs"></i>' : ''}
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    renderMultipleChoiceOptions(question) {
        const selectedValues = this.answers[question.id] || [];
        
        return `
            <div class="grid md:grid-cols-2 gap-4">
                ${question.options.map(option => `
                    <div class="option-card cursor-pointer border-2 border-gray-200 rounded-xl p-4 hover:border-aura-rose transition-all duration-300 flex items-center space-x-3 ${selectedValues.includes(option.id) ? 'border-aura-rose bg-rose-50' : ''}"
                         data-question="${question.id}" data-value="${option.id}" data-multiple="true">
                        <div class="w-10 h-10 bg-aura-rose/10 rounded-full flex items-center justify-center flex-shrink-0">
                            <i class="${option.icon} text-aura-rose"></i>
                        </div>
                        <div class="flex-1">
                            <h3 class="font-semibold text-gray-900 mb-1">${option.label}</h3>
                            <p class="text-sm text-gray-600">${option.description}</p>
                        </div>
                        <div class="flex-shrink-0">
                            <div class="w-6 h-6 border-2 border-gray-300 rounded ${selectedValues.includes(option.id) ? 'bg-aura-rose border-aura-rose' : ''}">
                                ${selectedValues.includes(option.id) ? '<i class="fas fa-check text-white text-xs"></i>' : ''}
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    updateNavigation() {
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        
        // Show/hide previous button
        if (this.currentQuestion === 0) {
            prevBtn.classList.add('hidden');
        } else {
            prevBtn.classList.remove('hidden');
        }
        
        // Update next button text
        if (this.currentQuestion === this.totalQuestions - 1) {
            nextBtn.innerHTML = 'Get Results <i class="fas fa-arrow-right ml-2"></i>';
        } else {
            nextBtn.innerHTML = 'Next <i class="fas fa-arrow-right ml-2"></i>';
        }
        
        // Setup option click handlers
        document.querySelectorAll('.option-card').forEach(card => {
            card.addEventListener('click', () => {
                const questionId = card.dataset.question;
                const value = card.dataset.value;
                const isMultiple = card.dataset.multiple === 'true';
                
                if (isMultiple) {
                    // Handle multiple choice
                    if (!this.answers[questionId]) {
                        this.answers[questionId] = [];
                    }
                    
                    const index = this.answers[questionId].indexOf(value);
                    if (index > -1) {
                        this.answers[questionId].splice(index, 1);
                    } else {
                        this.answers[questionId].push(value);
                    }
                } else {
                    // Handle single choice
                    this.answers[questionId] = value;
                    
                    // Remove active class from all options
                    document.querySelectorAll(`[data-question="${questionId}"]`).forEach(opt => {
                        opt.classList.remove('border-aura-rose', 'bg-rose-50');
                        opt.classList.add('border-gray-200');
                    });
                    
                    // Add active class to selected option
                    card.classList.remove('border-gray-200');
                    card.classList.add('border-aura-rose', 'bg-rose-50');
                }
                
                // Re-render the question to update selection states
                this.loadQuestion(this.currentQuestion);
            });
        });
    }
    
    nextQuestion() {
        const currentQ = this.questions[this.currentQuestion];
        
        // Validate answer
        if (!this.isQuestionAnswered(currentQ)) {
            this.showMessage('Please select an answer before continuing', 'error');
            return;
        }
        
        if (this.currentQuestion < this.totalQuestions - 1) {
            this.loadQuestion(this.currentQuestion + 1);
        } else {
            this.showResults();
        }
    }
    
    prevQuestion() {
        if (this.currentQuestion > 0) {
            this.loadQuestion(this.currentQuestion - 1);
        }
    }
    
    isQuestionAnswered(question) {
        const answer = this.answers[question.id];
        
        if (question.type === 'multiple-choice') {
            return answer && answer.length > 0;
        } else {
            return answer !== undefined && answer !== null;
        }
    }
    
    updateProgress() {
        const progress = Math.round(((this.currentQuestion + 1) / this.totalQuestions) * 100);
        document.getElementById('progressFill').style.width = `${progress}%`;
        document.getElementById('progressText').textContent = `${progress}%`;
    }
    
    showResults() {
        // Calculate recommendations based on answers
        this.calculateRecommendations();
        
        // Generate skin profile
        this.generateSkinProfile();
        
        // Show results screen
        this.showScreen('resultsScreen');
        
        // Render recommendations
        this.renderRecommendations();
        
        // Render skin profile
        this.renderSkinProfile();
    }
    
    calculateRecommendations() {
        // Mock recommendation logic based on answers
        const skinTone = this.answers['skin-tone'];
        const undertone = this.answers['undertone'];
        const coverage = this.answers['coverage'];
        const skinType = this.answers['skin-type'];
        
        // Mock product database
        const products = [
            {
                id: 'foundation-1',
                name: 'Radiance Foundation',
                shade: this.getRecommendedShade(skinTone, undertone),
                price: 45,
                image: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=400',
                description: 'Perfect for your skin tone and coverage needs',
                match: 95
            },
            {
                id: 'concealer-1',
                name: 'Perfect Coverage Concealer',
                shade: this.getRecommendedShade(skinTone, undertone),
                price: 28,
                image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400',
                description: 'Ideal for hiding imperfections and brightening',
                match: 92
            }
        ];
        
        this.recommendations = products;
    }
    
    getRecommendedShade(skinTone, undertone) {
        // Mock shade recommendation logic
        const shades = {
            fair: {
                cool: 'Porcelain Cool',
                warm: 'Ivory Warm',
                neutral: 'Fair Neutral'
            },
            light: {
                cool: 'Light Cool',
                warm: 'Light Warm',
                neutral: 'Light Neutral'
            },
            medium: {
                cool: 'Medium Cool',
                warm: 'Medium Warm',
                neutral: 'Medium Neutral'
            },
            tan: {
                cool: 'Tan Cool',
                warm: 'Tan Warm',
                neutral: 'Tan Neutral'
            },
            deep: {
                cool: 'Deep Cool',
                warm: 'Deep Warm',
                neutral: 'Deep Neutral'
            },
            dark: {
                cool: 'Dark Cool',
                warm: 'Dark Warm',
                neutral: 'Dark Neutral'
            }
        };
        
        return shades[skinTone]?.[undertone] || 'Medium Neutral';
    }
    
    generateSkinProfile() {
        this.skinProfile = {
            'Skin Tone': this.answers['skin-tone']?.charAt(0).toUpperCase() + this.answers['skin-tone']?.slice(1),
            'Undertone': this.answers['undertone']?.charAt(0).toUpperCase() + this.answers['undertone']?.slice(1),
            'Skin Type': this.answers['skin-type']?.charAt(0).toUpperCase() + this.answers['skin-type']?.slice(1),
            'Coverage Preference': this.answers['coverage']?.charAt(0).toUpperCase() + this.answers['coverage']?.slice(1),
            'Lifestyle': this.answers['lifestyle']?.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
            'Main Concerns': Array.isArray(this.answers['concerns']) ? 
                this.answers['concerns'].map(c => c.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())).join(', ') :
                'None specified'
        };
    }
    
    renderRecommendations() {
        const container = document.getElementById('recommendedProducts');
        
        container.innerHTML = this.recommendations.map(product => `
            <div class="bg-gray-50 rounded-2xl p-6">
                <div class="relative mb-4">
                    <img src="${product.image}" alt="${product.name}" class="w-full h-48 object-cover rounded-xl">
                    <div class="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        ${product.match}% Match
                    </div>
                </div>
                
                <h3 class="font-semibold text-xl text-gray-900 mb-2">${product.name}</h3>
                <div class="text-aura-rose font-medium mb-2">Shade: ${product.shade}</div>
                <p class="text-gray-600 mb-4">${product.description}</p>
                
                <div class="flex items-center justify-between">
                    <span class="text-2xl font-bold text-aura-rose">$${product.price}</span>
                    <button class="btn-primary" onclick="cart.addToCart({id: '${product.id}', name: '${product.name}', price: ${product.price}, image: '${product.image}', selectedShade: '${product.shade}'})">
                        Add to Cart
                    </button>
                </div>
            </div>
        `).join('');
    }
    
    renderSkinProfile() {
        const container = document.getElementById('skinProfile');
        
        container.innerHTML = Object.entries(this.skinProfile).map(([key, value]) => `
            <div class="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                <span class="font-medium text-gray-900">${key}:</span>
                <span class="text-gray-600">${value}</span>
            </div>
        `).join('');
    }
    
    retakeQuiz() {
        this.currentQuestion = 0;
        this.answers = {};
        this.recommendations = [];
        this.skinProfile = {};
        
        this.showScreen('startScreen');
    }
    
    showMessage(message, type = 'error') {
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

// Initialize shade finder quiz when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.shadeFinderQuiz = new ShadeFinderQuiz();
});