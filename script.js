     const courses = [
            {
                id: 1,
                title: "Full-Stack Web Developer",
                description: "Belajar dari nol menjadi Web Developer andal dengan React, Node.js, dan database. Termasuk 10 proyek dunia nyata.",
                price: 3500000,
                image: "https://placehold.co/600x400/a3e635/000?text=Web+Dev"
            },
            {
                id: 2,
                title: "Data Science & Machine Learning",
                description: "Kuasai Python, Pandas, Scikit-learn, dan TensorFlow untuk menganalisis data dan membangun model prediksi AI.",
                price: 4200000,
                image: "https://placehold.co/600x400/4f46e5/white?text=Data+Science"
            },
            {
                id: 3,
                title: "UI/UX Design Fundamental",
                description: "Mulai dari riset pengguna, wireframing, hingga prototyping interaktif menggunakan Figma. Bangun portofolio desain Anda.",
                price: 2800000,
                image: "https://placehold.co/600x400/f59e0b/000?text=UI/UX"
            }
        ];

        let cart = []; 
        let myCourses = []; 
        let progressChartInstance = null; 
        let confirmCallback = null;

        function formatRupiah(angka) {
            return new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0
            }).format(angka);
        }

        function showPage(pageId) {
            document.querySelectorAll('.page-content').forEach(page => {
                page.classList.add('hidden');
            });

            const targetPage = document.getElementById(pageId);
            if (targetPage) {
                targetPage.classList.remove('hidden');
                window.scrollTo(0, 0); 
            } else {
                document.getElementById('page-home').classList.remove('hidden');
            }

            if (pageId === 'page-article') {
                document.querySelectorAll('#page-article .article-fade-in').forEach((el, index) => {
                    el.classList.remove('is-visible');

                    const delay = el.style.animationDelay ? parseFloat(el.style.animationDelay) * 1000 : index * 100;

                    setTimeout(() => {
                        el.classList.add('is-visible');
                    }, delay);
                });
            }

            if (pageId === 'page-cart') {
                renderCart();
            }
            if (pageId === 'page-dashboard') {
                renderDashboard();
            }
            
            const mobileMenu = document.getElementById('mobile-menu');
            if (mobileMenu) {
                mobileMenu.classList.add('hidden');
            }
        }
        
        function renderCourses() {
            const container = document.getElementById('course-list-container');
            if (!container) return;
            container.innerHTML = ''; 

            courses.forEach(course => {
                const courseCard = `
                    <div class="bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-lg flex flex-col">
                        <img src="${course.image}" alt="${course.title}" class="w-full h-48 object-cover">
                        <div class="p-6 flex flex-col flex-grow">
                            <h3 class="text-2xl font-bold mb-3 text-black dark:text-white">${course.title}</h3>
                            <p class="text-gray-700 dark:text-gray-400 mb-4 flex-grow">${course.description}</p>
                            <div class="flex justify-between items-center mt-4">
                                <span class="text-2xl font-bold text-lime-400">${formatRupiah(course.price)}</span>
                                <button class="add-to-cart-btn bg-lime-400 text-black px-6 py-2 rounded-full font-bold hover:bg-gray-800 dark:hover:bg-white hover:text-white dark:hover:text-black transition-all" data-id="${course.id}">
                                    Pilih Kelas
                                </button>
                            </div>
                        </div>
                    </div>
                `;
                container.innerHTML += courseCard;
            });
        }

        function renderCart() {
            const itemsContainer = document.getElementById('cart-items-container');
            const totalContainer = document.getElementById('cart-total-container');
            if (!itemsContainer || !totalContainer) return;

            if (cart.length === 0) {
                itemsContainer.innerHTML = '<p class="text-gray-500 text-center">Keranjang Anda masih kosong.</p>';
                totalContainer.innerHTML = '';
                updateCartCounter();
                return;
            }

            itemsContainer.innerHTML = ''; 
            let totalBiaya = 0;

            cart.forEach(item => {
                const cartItem = `
                    <div class="flex items-center justify-between bg-gray-100 dark:bg-gray-900 p-4 rounded-lg border dark:border-gray-800">
                        <div class="flex items-center gap-4">
                            <img src="${item.image}" alt="${item.title}" class="w-20 h-20 rounded-lg object-cover">
                            <div>
                                <h4 class="text-lg font-bold text-black dark:text-white">${item.title}</h4>
                                <span class="text-gray-500">${formatRupiah(item.price)}</span>
                            </div>
                        </div>
                        <button class="remove-from-cart-btn text-red-500 hover:text-red-700" data-id="${item.id}">Hapus</button> 
                    </div>
                `;
                itemsContainer.innerHTML += cartItem;
                totalBiaya += item.price;
            });

            totalContainer.innerHTML = `
                <div class="text-right">
                    <h3 class="text-2xl font-bold text-black dark:text-white">Total Biaya:</h3>
                    <p class="text-4xl font-extrabold text-lime-400">${formatRupiah(totalBiaya)}</p>
                </div>
            `;
            
            updateCartCounter();
        }

        function showCustomAlert(message) {

            alert(message);
        }

        function addToCart(courseId) {
            const courseToAdd = courses.find(course => course.id === courseId);
            
            const alreadyInCart = cart.some(item => item.id === courseId);
            if (alreadyInCart) {
                showCustomAlert("Kursus ini sudah ada di keranjang Anda.");
                return;
            }
            const alreadyOwned = myCourses.some(item => item.id === courseId);
            if (alreadyOwned) {
                showCustomAlert("Anda sudah memiliki kursus ini di dashboard Anda.");
                return;
            }

            if (courseToAdd) {
                cart.push(courseToAdd);
                updateCartCounter();
                showCustomAlert(`${courseToAdd.title} telah ditambahkan ke keranjang!`);
            }
        }
        
        function removeFromCart(courseId) {
            cart = cart.filter(item => item.id !== courseId);
            renderCart(); 
        }


        function checkout() {
            if (cart.length === 0) {
                showCustomAlert('Keranjang Anda kosong!');
                return;
            }
            cart.forEach(item => {
                if (!myCourses.some(course => course.id === item.id)) {
                    myCourses.push(item);
                }
            });
            
            cart = [];
            renderCart(); 
            showCustomAlert('Pembelian berhasil! Anda akan diarahkan ke dashboard.');
            showPage('page-dashboard');
        }

        function updateCartCounter() {
            const cartCount = cart.length;
            document.getElementById('cart-counter').textContent = cartCount;
            document.getElementById('cart-counter-mobile').textContent = cartCount;
        }

        function renderDashboard() {
            const container = document.getElementById('my-courses-container');
            if (!container) return;
            
            if (myCourses.length === 0) {
                container.innerHTML = '<p class="text-gray-500">Anda belum mendaftar kursus apapun. Lihat <a href="#" class="nav-link text-lime-400" data-page="courses">halaman kursus</a> kami!</p>';
            } else {
                container.innerHTML = '';
                myCourses.forEach(course => {
                    container.innerHTML += `
                        <div class="flex items-center justify-between bg-gray-100 dark:bg-gray-900 p-4 rounded-lg border dark:border-gray-800">
                            <div class="flex items-center gap-4">
                                <img src="${course.image}" alt="${course.title}" class="w-16 h-16 rounded-lg object-cover">
                                <div>
                                    <h4 class="text-lg font-bold text-black dark:text-white">${course.title}</h4>
                                    <div class="w-full bg-gray-300 dark:bg-gray-700 rounded-full h-2.5 mt-2">
                                        <div class="bg-lime-400 h-2.5 rounded-full" style="width: 15%"></div>
                                    </div>
                                    <span class="text-gray-500 text-sm">Progress: 15%</span> 
                                </div>
                            </div>
                            <a href="#" class="bg-lime-400 text-black px-4 py-2 rounded-full font-bold text-sm">Mulai Belajar</a>
                        </div>
                    `;
                });
            }
            renderProgressChart();
        }

        function renderProgressChart() {
            const ctx = document.getElementById('progress-chart');
            if (!ctx) return;

            if (progressChartInstance) {
                progressChartInstance.destroy(); 
            }

            const completed = myCourses.length; 
            const remaining = courses.length - completed;

            progressChartInstance = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: ['Kursus Dimulai', 'Total Kursus Tersisa'],
                    datasets: [{
                        label: 'Progress Kursus',
                        data: [completed, remaining > 0 ? remaining : 0], 
                        backgroundColor: ['#a3e635', '#374151'], 
                        borderColor: document.documentElement.classList.contains('dark') ? '#000' : '#FFF',
                        borderWidth: 4,
                        hoverOffset: 4
                    }]
                },
                options: {
                    responsive: true,
                    cutout: '70%', 
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: { 
                                color: document.documentElement.classList.contains('dark') ? '#FFF' : '#374151'
                            }
                        }
                    }
                }
            });
        }
        
        function showConfirmationModal(message, onConfirm) {
            const modal = document.getElementById('confirm-modal');
            const messageEl = document.getElementById('confirm-modal-message');
            if (modal && messageEl) {
                messageEl.textContent = message;
                confirmCallback = onConfirm; 
                modal.classList.remove('hidden');
                setTimeout(() => modal.classList.add('is-open'), 10);
            }
        }


        function hideConfirmationModal() {
            const modal = document.getElementById('confirm-modal');
            if (modal) {
                modal.classList.remove('is-open');
                setTimeout(() => modal.classList.add('hidden'), 300);
            }
            confirmCallback = null; 
        }


        
        document.addEventListener('DOMContentLoaded', () => {
        
            const menuBtn = document.getElementById('menu-btn');
            const mobileMenu = document.getElementById('mobile-menu');
            const cursorFollower = document.getElementById('cursor-follower');
            const themeToggleButtons = document.querySelectorAll('#theme-toggle, #theme-toggle-mobile');
            const sunIcon = document.getElementById('theme-icon-sun');
            const moonIcon = document.getElementById('theme-icon-moon');
            const modal = document.getElementById('modal');
            const modalCloseBtn = document.getElementById('modal-close-btn');
            const modalTitle = document.getElementById('modal-title');
            const modalDescription = document.getElementById('modal-description');
            const contactForm = document.getElementById('contact-form');
            const emailInput = document.getElementById('email-input');
            const subscriberSection = document.getElementById('subscriber-section');
            const subscriberList = document.getElementById('subscriber-list');
            const successMessage = document.getElementById('form-success-message');
            
            const confirmModalOk = document.getElementById('confirm-modal-ok');
            const confirmModalCancel = document.getElementById('confirm-modal-cancel');
            const confirmModalEl = document.getElementById('confirm-modal');

            if(confirmModalOk) {
                confirmModalOk.addEventListener('click', () => {
                    if (confirmCallback) {
                        confirmCallback(); 
                    }
                    hideConfirmationModal();
                });
            }
            if(confirmModalCancel) {
                confirmModalCancel.addEventListener('click', hideConfirmationModal);
            }
            if(confirmModalEl) {
                confirmModalEl.addEventListener('click', (e) => {
                    if (e.target === confirmModalEl) {
                        hideConfirmationModal(); 
                    }
                });
            }


            if(menuBtn) {
                menuBtn.addEventListener('click', () => {
                    mobileMenu.classList.toggle('hidden');
                });
            }
            document.querySelectorAll('#mobile-menu a').forEach(link => {
                link.addEventListener('click', () => {
                    mobileMenu.classList.add('hidden');
                });
            });

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.1 
            });
            document.querySelectorAll('.animate-on-scroll').forEach((el) => {
                observer.observe(el);
            });

            if (cursorFollower) {
                document.addEventListener('mousemove', (e) => {
                    cursorFollower.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
                });
                const interactiveElements = document.querySelectorAll('a, button, input, .program-card, .add-to-cart-btn, .remove-from-cart-btn, .interactive-title-word');
                interactiveElements.forEach(el => {
                    el.addEventListener('mouseenter', () => cursorFollower.classList.add('is-active'));
                    el.addEventListener('mouseleave', () => cursorFollower.classList.remove('is-active'));
                });
            }

            const updateThemeIcon = (isDark) => {
                if (sunIcon && moonIcon) {
                    if (isDark) {
                        sunIcon.classList.remove('hidden');
                        moonIcon.classList.add('hidden');
                    } else {
                        sunIcon.classList.add('hidden');
                        moonIcon.classList.remove('hidden');
                    }
                }
            };
            const applyTheme = (theme) => {
                if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                    localStorage.setItem('theme', 'dark');
                    updateThemeIcon(true);
                } else {
                    document.documentElement.classList.remove('dark');
                    localStorage.setItem('theme', 'light');
                    updateThemeIcon(false);
                }
                if(progressChartInstance) {
                    progressChartInstance.options.plugins.legend.labels.color = theme === 'dark' ? '#FFF' : '#374151';
                    progressChartInstance.options.borderColor = theme === 'dark' ? '#000' : '#FFF';
                    progressChartInstance.update();
                }
            };
            const savedTheme = localStorage.getItem('theme');
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            if (savedTheme) {
                applyTheme(savedTheme);
            } else if (prefersDark) {
                applyTheme('dark');
            } else {
                applyTheme('light');
            }
            themeToggleButtons.forEach(btn => {
                btn.addEventListener('click', () => {
                    const isDark = document.documentElement.classList.contains('dark');
                    applyTheme(isDark ? 'light' : 'dark');
                    if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                        mobileMenu.classList.add('hidden');
                    }
                });
            });

            document.querySelectorAll('.program-card').forEach(card => {
                card.addEventListener('click', () => {
                    const title = card.getAttribute('data-title');
                    const description = card.getAttribute('data-description');
                    modalTitle.textContent = title;
                    modalDescription.textContent = description;
                    modal.classList.remove('hidden');
                    setTimeout(() => modal.classList.add('is-open'), 10);
                });
            });
            const closeModal = () => {
                modal.classList.remove('is-open');
                setTimeout(() => modal.classList.add('hidden'), 300); 
            };
            if(modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
            if(modal) modal.addEventListener('click', (e) => {
                if (e.target === modal) closeModal();
            });

            if(contactForm) {
                contactForm.addEventListener('submit', (e) => {
                    e.preventDefault(); 
                    const email = emailInput.value.trim();
                    if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                        subscriberSection.classList.remove('hidden');
                        const newItem = document.createElement('div');
                        newItem.textContent = email;
                        newItem.classList.add('p-3', 'rounded-lg', 'text-lime-400', 'font-medium', 'new-subscriber-highlight');
                        subscriberList.prepend(newItem);
                        setTimeout(() => {
                            newItem.classList.remove('new-subscriber-highlight');
                            newItem.classList.add('bg-gray-200', 'dark:bg-gray-800', 'transition-colors', 'duration-300');
                        }, 2000); 
                        emailInput.value = '';
                        successMessage.textContent = 'Terima kasih! Email Anda telah ditambahkan.';
                        setTimeout(() => successMessage.textContent = '', 3000);
                    } else {
                        successMessage.textContent = 'Masukkan alamat email yang valid.';
                        setTimeout(() => successMessage.textContent = '', 3000);
                    }
                });
            }

            document.querySelectorAll('.nav-link').forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    let pageId = link.getAttribute('data-page');
                    const homeSections = ['about', 'program', 'resources', 'contact'];
                    
                    if (homeSections.includes(pageId)) {
                        showPage('page-home');
                        setTimeout(() => {
                            document.getElementById(pageId)?.scrollIntoView({ behavior: 'smooth' });
                        }, 100); 
                    } else if (pageId === 'article') {
                        showPage('page-article');
                    } else {
                        showPage('page-' + pageId);
                    }
                });
            });

            document.addEventListener('click', (e) => {
                const addToCartBtn = e.target.closest('.add-to-cart-btn');
                const removeFromCartBtn = e.target.closest('.remove-from-cart-btn');
                const clearCartBtn = e.target.closest('#clear-cart-btn');
                const checkoutBtn = e.target.closest('#checkout-btn');

                if (addToCartBtn) {
                    const courseId = parseInt(addToCartBtn.getAttribute('data-id'));
                    addToCart(courseId);
                }
                if (removeFromCartBtn) {
                    const courseId = parseInt(removeFromCartBtn.getAttribute('data-id'));
                    removeFromCart(courseId);
                }
                if (clearCartBtn) {
                    showConfirmationModal('Apakah Anda yakin ingin mengosongkan keranjang?', () => {
                        cart = [];
                        renderCart();
                    });
                }
                if (checkoutBtn) {
                    checkout();
                }
            });

            renderCourses();
            showPage('page-home');
        
        });