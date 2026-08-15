/**
 * AWS Lab Maker AI Prompt Builder - Main Application Logic
 */

(function () {
    'use strict';

    // --- Data ---
    const AWS_SERVICES = [
        'Amazon API Gateway',
        'Amazon Bedrock',
        'Amazon CloudWatch',
        'Amazon Cognito',
        'Amazon DynamoDB',
        'Amazon EBS',
        'Amazon EC2',
        'Amazon ELB',
        'Amazon EventBridge',
        'Amazon RDS',
        'Amazon S3',
        'Amazon SNS',
        'Amazon SQS',
        'Amazon VPC',
        'AWS AppSync',
        'AWS IAM',
        'AWS Lambda',
        'AWS Step Functions'
    ];

    const EXPERIENCE_LEVELS = [
        {
            name: 'Beginner',
            icon: '🌱',
            description: 'Fundamentals, simple architectures, guided Console configuration, basic testing'
        },
        {
            name: 'Intermediate',
            icon: '🔧',
            description: 'Multi-step implementations, service integration, networking/security basics, troubleshooting'
        },
        {
            name: 'Advanced',
            icon: '🚀',
            description: 'Production-oriented architecture, high availability, scalability, resilience, observability'
        },
        {
            name: 'Experienced Builder',
            icon: '🏗️',
            description: 'Enterprise-grade architecture, advanced patterns, failure scenarios, governance, automation'
        }
    ];

    // --- State ---
    let state = {
        currentStep: 1,
        selectedServices: [],
        selectedLevel: null,
        generatedProjects: [],
        selectedProject: null
    };

    // --- DOM References ---
    const elements = {
        servicesGrid: document.getElementById('servicesGrid'),
        levelsGrid: document.getElementById('levelsGrid'),
        projectsList: document.getElementById('projectsList'),
        promptMeta: document.getElementById('promptMeta'),
        promptOutput: document.getElementById('promptOutput'),
        selectedCount: document.getElementById('countText'),
        btnToStep2: document.getElementById('btnToStep2'),
        btnToStep3: document.getElementById('btnToStep3'),
        btnToStep4: document.getElementById('btnToStep4'),
        btnBackToStep1: document.getElementById('btnBackToStep1'),
        btnBackToStep2: document.getElementById('btnBackToStep2'),
        btnBackToStep3: document.getElementById('btnBackToStep3'),
        btnStartOver: document.getElementById('btnStartOver'),
        btnCopy: document.getElementById('btnCopy'),
        copyFeedback: document.getElementById('copyFeedback')
    };

    // --- Initialization ---
    function init() {
        renderServices();
        renderLevels();
        bindEvents();
    }

    // --- Render Functions ---
    function renderServices() {
        elements.servicesGrid.innerHTML = AWS_SERVICES.map((service, index) => `
            <div class="service-card" data-service="${service}" tabindex="0" role="checkbox" aria-checked="false" aria-label="${service}">
                <div class="checkbox">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="white" stroke-width="3">
                        <polyline points="20 6 9 17 4 12"/>
                    </svg>
                </div>
                <span class="service-name">${service}</span>
            </div>
        `).join('');
    }

    function renderLevels() {
        elements.levelsGrid.innerHTML = EXPERIENCE_LEVELS.map(level => `
            <div class="level-card" data-level="${level.name}" tabindex="0" role="radio" aria-checked="false" aria-label="${level.name}">
                <div class="level-icon">${level.icon}</div>
                <div class="level-name">${level.name}</div>
                <div class="level-desc">${level.description}</div>
            </div>
        `).join('');
    }

    function renderProjects() {
        elements.projectsList.innerHTML = state.generatedProjects.map((project, index) => `
            <div class="project-card" data-index="${index}" tabindex="0" role="radio" aria-checked="false" aria-label="Project ${index + 1}: ${project.title}">
                <div class="project-header">
                    <div class="project-number">${index + 1}</div>
                    <div class="project-title">${project.title}</div>
                </div>
                <div class="project-prompt">${project.prompt}</div>
                <div class="char-count">${project.charCount} / 950 characters</div>
            </div>
        `).join('');

        // Bind project card click events
        document.querySelectorAll('.project-card').forEach(card => {
            card.addEventListener('click', () => selectProject(parseInt(card.dataset.index)));
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    selectProject(parseInt(card.dataset.index));
                }
            });
        });
    }

    function renderFinalPrompt() {
        const project = state.generatedProjects[state.selectedProject];

        elements.promptMeta.innerHTML = `
            <div class="meta-item">
                <span class="meta-label">Services:</span>
                <span class="meta-value">${state.selectedServices.join(', ')}</span>
            </div>
            <div class="meta-item">
                <span class="meta-label">Level:</span>
                <span class="meta-value">${state.selectedLevel}</span>
            </div>
            <div class="meta-item">
                <span class="meta-label">Project:</span>
                <span class="meta-value">${project.title}</span>
            </div>
        `;

        elements.promptOutput.textContent = project.prompt;
    }

    // --- Event Binding ---
    function bindEvents() {
        // Service cards
        elements.servicesGrid.addEventListener('click', (e) => {
            const card = e.target.closest('.service-card');
            if (card) toggleService(card);
        });

        elements.servicesGrid.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const card = e.target.closest('.service-card');
                if (card) toggleService(card);
            }
        });

        // Level cards
        elements.levelsGrid.addEventListener('click', (e) => {
            const card = e.target.closest('.level-card');
            if (card) selectLevel(card);
        });

        elements.levelsGrid.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const card = e.target.closest('.level-card');
                if (card) selectLevel(card);
            }
        });

        // Navigation buttons
        elements.btnToStep2.addEventListener('click', () => goToStep(2));
        elements.btnToStep3.addEventListener('click', () => {
            generateProjects();
            goToStep(3);
        });
        elements.btnToStep4.addEventListener('click', () => {
            renderFinalPrompt();
            goToStep(4);
        });

        elements.btnBackToStep1.addEventListener('click', () => goToStep(1));
        elements.btnBackToStep2.addEventListener('click', () => goToStep(2));
        elements.btnBackToStep3.addEventListener('click', () => goToStep(3));
        elements.btnStartOver.addEventListener('click', resetWizard);

        // Copy button
        elements.btnCopy.addEventListener('click', copyPrompt);
    }

    // --- Interaction Handlers ---
    function toggleService(card) {
        const service = card.dataset.service;
        const index = state.selectedServices.indexOf(service);

        if (index > -1) {
            state.selectedServices.splice(index, 1);
            card.classList.remove('selected');
            card.setAttribute('aria-checked', 'false');
        } else {
            state.selectedServices.push(service);
            card.classList.add('selected');
            card.setAttribute('aria-checked', 'true');
        }

        updateServiceCount();
    }

    function updateServiceCount() {
        const count = state.selectedServices.length;
        elements.selectedCount.textContent = `${count} service${count !== 1 ? 's' : ''} selected`;
        elements.btnToStep2.disabled = count === 0;
    }

    function selectLevel(card) {
        // Deselect all
        document.querySelectorAll('.level-card').forEach(c => {
            c.classList.remove('selected');
            c.setAttribute('aria-checked', 'false');
        });

        // Select this one
        card.classList.add('selected');
        card.setAttribute('aria-checked', 'true');
        state.selectedLevel = card.dataset.level;
        elements.btnToStep3.disabled = false;
    }

    function selectProject(index) {
        // Deselect all
        document.querySelectorAll('.project-card').forEach(c => {
            c.classList.remove('selected');
            c.setAttribute('aria-checked', 'false');
        });

        // Select this one
        const card = document.querySelector(`.project-card[data-index="${index}"]`);
        card.classList.add('selected');
        card.setAttribute('aria-checked', 'true');
        state.selectedProject = index;
        elements.btnToStep4.disabled = false;
    }

    function generateProjects() {
        state.generatedProjects = PromptEngine.generateProjects(
            state.selectedServices,
            state.selectedLevel
        );
        state.selectedProject = null;
        elements.btnToStep4.disabled = true;
        renderProjects();
    }

    // --- Navigation ---
    function goToStep(step) {
        state.currentStep = step;

        // Update wizard step visibility
        document.querySelectorAll('.wizard-step').forEach(s => s.classList.remove('active'));
        document.getElementById(`step${step}`).classList.add('active');

        // Update progress indicator
        updateProgress(step);
    }

    function updateProgress(step) {
        const steps = document.querySelectorAll('.progress-step');
        const lines = document.querySelectorAll('.progress-line');

        steps.forEach((s, i) => {
            const stepNum = i + 1;
            s.classList.remove('active', 'completed');
            if (stepNum === step) {
                s.classList.add('active');
            } else if (stepNum < step) {
                s.classList.add('completed');
            }
        });

        lines.forEach((line, i) => {
            if (i < step - 1) {
                line.classList.add('active');
            } else {
                line.classList.remove('active');
            }
        });
    }

    function resetWizard() {
        // Reset state
        state = {
            currentStep: 1,
            selectedServices: [],
            selectedLevel: null,
            generatedProjects: [],
            selectedProject: null
        };

        // Reset UI
        document.querySelectorAll('.service-card').forEach(c => {
            c.classList.remove('selected');
            c.setAttribute('aria-checked', 'false');
        });
        document.querySelectorAll('.level-card').forEach(c => {
            c.classList.remove('selected');
            c.setAttribute('aria-checked', 'false');
        });

        elements.btnToStep2.disabled = true;
        elements.btnToStep3.disabled = true;
        elements.btnToStep4.disabled = true;
        updateServiceCount();

        goToStep(1);
    }

    // --- Utilities ---
    function copyPrompt() {
        const project = state.generatedProjects[state.selectedProject];
        if (!project) return;

        navigator.clipboard.writeText(project.prompt).then(() => {
            elements.copyFeedback.classList.add('show');
            setTimeout(() => {
                elements.copyFeedback.classList.remove('show');
            }, 2000);
        }).catch(() => {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = project.prompt;
            textArea.style.position = 'fixed';
            textArea.style.opacity = '0';
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            elements.copyFeedback.classList.add('show');
            setTimeout(() => {
                elements.copyFeedback.classList.remove('show');
            }, 2000);
        });
    }

    // --- Start ---
    init();
})();
