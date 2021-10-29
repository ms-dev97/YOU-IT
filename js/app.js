const mainHeader = document.querySelector('.main-header'),
      mainNav = mainHeader.querySelector('.main-nav'),
      menuBtn = mainNav.querySelector('.menu-btn'),
      navItems = mainNav.querySelector('ul'),
      navLinks = navItems.querySelectorAll('a'),
      headerHeight = mainHeader.offsetHeight;

document.body.style.paddingTop = `${headerHeight}px`

// Toggle visibility of nav menu
menuBtn.addEventListener('pointerdown', () => {
    navItems.classList.toggle('toggle');

    if (navItems.classList.contains('toggle')) {
        navItems.style.transform = 'translateX(0)';
        navItems.style.visibility = 'visible';
    } else {
        navItems.style.transform = 'translateX(-100%)';
    }
});

navItems.addEventListener('transitionend', function (e) {
    if (e.propertyName !== 'transform') return;
    if (!navItems.classList.contains('toggle')) {
        this.style.visibility = 'hidden';
        setTimeout(() => {
            this.style.transform = '';
            this.style.visibility = '';
        }, 0)
    }
});

// Toggle active class
navLinks.forEach(link => {
    link.addEventListener('click', e => e.preventDefault());

    link.addEventListener('pointerdown', function(e) {
        if (this.classList.contains('active')) return;

        navLinks.forEach(link => link.classList.remove('active'));
        this.classList.add('active');

        const target = this.dataset.target;

        if (this.textContent === 'home') {
            window.scrollTo(0, 0);
            mainHeader.style.backgroundColor = '';
            mainHeader.style.color = '';
        };

        if (target != undefined) {
            const y = document.querySelector('#' + target).offsetTop;
            window.scrollTo(0, y - headerHeight);
            headerBg(y, headerHeight);
        }
    });
});

const sections = document.querySelectorAll('.section');

// Hide and show the header
let windowY = 0;
window.addEventListener('scroll', () => {
    windowY = window.scrollY;
    // headerBg(window.scrollY, headerHeight);
});

function highlight() {
    sections.forEach(sec => {
        if (windowY + window.innerHeight/2 >= sec.offsetTop) {
            navLinks.forEach(link => link.classList.remove('active'));
            navItems.querySelector(`a[data-target="${sec.getAttribute('id')}"]`).classList.add('active');
        } else if (windowY <= headerHeight) {
            navLinks.forEach(link => link.classList.remove('active'));
            navLinks[0].classList.add('active');
        }
    })

    headerBg(windowY, headerHeight);
    requestAnimationFrame(highlight);
}

requestAnimationFrame(highlight);

function headerBg(h, y) {
    if (h >= y) {
        mainHeader.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    } else {
        mainHeader.style.backgroundColor = '';
    }
}

const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const target = entry.target;

            if (target.classList.contains('left')) {
                target.classList.remove('left')
            } else if (target.classList.contains('right')) {
                target.classList.remove('right')
            }  else if (target.classList.contains('bottom')) {
                target.classList.remove('bottom')
            }  else if (target.classList.contains('top')) {
                target.classList.remove('top')
            }  else if (target.classList.contains('scale-up')) {
                target.classList.remove('scale-up')
            }
        }
    });
}, {
    rootMargin: '0px 0px -40% 0px'
});

document.querySelectorAll('.anim').forEach(sec => {
    observer.observe(sec);
})

// Latest work filter
const portfolio = document.querySelector('.work-gallery'),
      portfolioItems = portfolio.querySelectorAll('.grid-item'),
      portfolioCats = document.querySelectorAll('.cats > li');

function translateGallery(elWrapper, elChildren, filter = '*') {
    const portfolio = elWrapper,
          parentWidth = portfolio.offsetWidth,
          children = elChildren,
          childCount = children.length,
          childHeight = children[0].offsetHeight,
          windowWidth = window.innerWidth;

    let x = 0,
        y = 0,
        rowItems;

    if (windowWidth <= 768) {
        rowItems = 1;
    } else if (windowWidth <= 992) {
        rowItems = 2;
    } else {
        rowItems = 3;
    }

    const itemWidth = parentWidth/rowItems;

    portfolio.style.height = `${Math.ceil(portfolio.childElementCount/rowItems)*childHeight}px`;
    if (filter === '*') {
        children.forEach(child => {
            child.style.cssText = `transform: translate3d(${x*itemWidth}px, ${y*childHeight + 20*y}px, 0); opacity: 1;`;
            x++;
            portfolio.style.height = `${(y+1)*childHeight+20}px`;
            if (x%rowItems === 0) {
                x = 0;
                y++;
            }
        });
        return;
    }

    children.forEach((child, i) => {
        if (child.dataset.filter.includes(filter)) {
            child.style.cssText = `transform: translate3d(${x*itemWidth}px, ${y*childHeight + 20*y}px, 0); opacity: 1;`;
            x++;
            portfolio.style.height = `${(y+1)*childHeight+20}px`;
            if (x%rowItems === 0) {
                x = 0;
                y++;
            }
        } else {
            child.style.cssText = 'transform: scale(0.1); opacity: 0;';
        }
    });
}

portfolioCats.forEach(cat => {
    cat.addEventListener('pointerdown', function() {
        const dataFilter = this.dataset.filter;
        translateGallery(portfolio, portfolioItems, dataFilter);

        portfolioCats.forEach(cat => cat.classList.remove('active'));
        this.classList.add('active');
    });
});

window.addEventListener('load', () => {
    translateGallery(portfolio, portfolioItems);
});

window.addEventListener('resize', () => {
    translateGallery(portfolio, portfolioItems);
});