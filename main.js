const passwordInput = document.getElementById('password');
const progressFill = document.getElementById('progressFill');
const scoreValue = document.getElementById('scoreValue');
const strengthLabel = document.getElementById('strengthLabel');
const suggestions = document.getElementById('suggestions');
const suggestionList = document.getElementById('suggestionList');

const criteriaIcons = {
    length: document.getElementById('lengthIcon'),
    uppercase: document.getElementById('uppercaseIcon'),
    lowercase: document.getElementById('lowercaseIcon'),
    number: document.getElementById('numberIcon'),
    special: document.getElementById('specialIcon')
};

function evaluatePassword(password) {
    const criteria = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /[0-9]/.test(password),
        special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
    };

    let score = 0;
    const metCriteria = Object.values(criteria).filter(Boolean).length;
    
    score = (metCriteria / 5) * 100;

    if (password.length >= 12) score = Math.min(score + 10, 100);
    if (password.length >= 16) score = Math.min(score + 10, 100);
    if (password.length >= 20) score = Math.min(score + 10, 100);

    return { score, criteria };
}

function updateUI(score, criteria) {
    progressFill.style.width = score + '%';
    scoreValue.textContent = Math.round(score);

    let labelClass = '';
    let labelText = '';

    if (score < 30) {
        labelClass = 'weak';
        labelText = 'Very Weak';
        progressFill.style.backgroundColor = '#f44336';
    } else if (score < 50) {
        labelClass = 'weak';
        labelText = 'Weak';
        progressFill.style.backgroundColor = '#f44336';
    } else if (score < 70) {
        labelClass = 'medium';
        labelText = 'Medium';
        progressFill.style.backgroundColor = '#ff9800';
    } else if (score < 85) {
        labelClass = 'strong';
        labelText = 'Strong';
        progressFill.style.backgroundColor = '#4caf50';
    } else {
        labelClass = 'strong';
        labelText = 'Very Strong';
        progressFill.style.backgroundColor = '#4caf50';
    }

    strengthLabel.textContent = labelText;
    strengthLabel.className = 'strength-label ' + labelClass;

    Object.keys(criteria).forEach(key => {
        const icon = criteriaIcons[key];
        if (criteria[key]) {
            icon.innerHTML = '<i data-lucide="check"></i>';
            icon.classList.add('met');
        } else {
            icon.innerHTML = '<i data-lucide="x"></i>';
            icon.classList.remove('met');
        }
    });
    
    lucide.createIcons();
}

function generateSuggestions(password) {
    const suggestions = [];
    const baseWords = ['Secure', 'Strong', 'Safe', 'Protected', 'Guarded'];
    const numbers = ['2024', '123', '789', '456', '321'];
    const specialChars = ['!', '@', '#', '$', '%'];
    
    if (password.length > 0) {
        const base = password.substring(0, Math.min(4, password.length));
        
        suggestions.push(base + 'Secure' + numbers[0] + specialChars[0]);
        suggestions.push(base.charAt(0).toUpperCase() + base.substring(1) + numbers[1] + specialChars[1]);
        suggestions.push(base + numbers[2] + specialChars[2] + '!');
        suggestions.push(baseWords[Math.floor(Math.random() * baseWords.length)] + base + numbers[3] + specialChars[3]);
        suggestions.push(base.toUpperCase() + numbers[4] + specialChars[4] + base.toLowerCase());
    } else {
        suggestions.push('SecurePass123!');
        suggestions.push('StrongPassword@2024');
        suggestions.push('SafeGuard#789');
        suggestions.push('Protected2024$');
        suggestions.push('GuardedPass456%');
    }

    return suggestions;
}

function displaySuggestions(password) {
    if (password.length > 0) {
        const suggestions = generateSuggestions(password);
        suggestionList.innerHTML = '';
        
        suggestions.forEach(suggestion => {
            const item = document.createElement('div');
            item.className = 'suggestion-item';
            item.textContent = suggestion;
            
            item.addEventListener('click', function() {
                navigator.clipboard.writeText(suggestion).then(() => {
                    const indicator = document.createElement('span');
                    indicator.className = 'copy-indicator show';
                    indicator.textContent = 'Copied!';
                    item.appendChild(indicator);
                    
                    setTimeout(() => {
                        indicator.remove();
                    }, 2000);
                });
            });
            
            suggestionList.appendChild(item);
        });
        
        suggestions.style.display = 'block';
    } else {
        suggestions.style.display = 'none';
    }
}

passwordInput.addEventListener('input', function() {
    const password = this.value;
    
    if (password.length === 0) {
        progressFill.style.width = '0%';
        scoreValue.textContent = '0';
        strengthLabel.textContent = 'Very Weak';
        strengthLabel.className = 'strength-label';
        suggestions.style.display = 'none';
        
        Object.values(criteriaIcons).forEach(icon => {
            icon.innerHTML = '<i data-lucide="x"></i>';
            icon.classList.remove('met');
        });
        
        lucide.createIcons();
        return;
    }

    const { score, criteria } = evaluatePassword(password);
    updateUI(score, criteria);
    displaySuggestions(password);
});

passwordInput.addEventListener('focus', function() {
    if (this.value.length > 0) {
        const { score, criteria } = evaluatePassword(this.value);
        updateUI(score, criteria);
        displaySuggestions(this.value);
    }
});

document.addEventListener('DOMContentLoaded', function() {
    lucide.createIcons();
});
