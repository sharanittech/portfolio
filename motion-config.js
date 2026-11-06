/**
 * MOTION SYSTEM CONFIGURATION
 * Single source of truth for motion tokens, easing, and user motion preferences.
 * 
 * Features:
 * - Unified easing curves (power3.out, power2.inOut, elastic.out)
 * - Safe manual motion override (allows enabling animations even if OS default has animation effects disabled)
 * - Dynamic event broadcasting ('motionchange') for real-time reactivity
 */

(function () {
    const STORAGE_KEY = 'portfolio_motion_mode';
    
    // Check user preference in localStorage; default to 'enabled' for the portfolio showcase
    function getStoredMotionMode() {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored === 'disabled') return false;
            if (stored === 'enabled') return true;
        } catch (e) {
            // Ignore storage errors
        }
        // If not explicitly set, default to enabled for showcasing portfolio work
        return true;
    }

    let isMotionActive = getStoredMotionMode();

    function applyMotionClasses(active) {
        if (!document.body) return;
        if (active) {
            document.body.classList.remove('motion-reduced');
            document.body.classList.add('motion-enabled');
        } else {
            document.body.classList.remove('motion-enabled');
            document.body.classList.add('motion-reduced');
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => applyMotionClasses(isMotionActive));
    } else {
        applyMotionClasses(isMotionActive);
    }

    window.MOTION_CONFIG = {
        ease: {
            out: 'power3.out',
            inOut: 'power2.inOut',
            elastic: 'elastic.out(1, 0.4)',
            smooth: 'power1.out',
            linear: 'none'
        },
        duration: {
            fast: 0.3,
            base: 0.6,
            slow: 1.0,
            ambient: 6.0
        },
        stagger: 0.08,
        
        get reducedMotion() {
            return !isMotionActive;
        },

        set reducedMotion(val) {
            isMotionActive = !val;
            try {
                localStorage.setItem(STORAGE_KEY, isMotionActive ? 'enabled' : 'disabled');
            } catch (e) {}
            applyMotionClasses(isMotionActive);
            window.dispatchEvent(new CustomEvent('motionchange', { detail: { reducedMotion: !isMotionActive } }));
        },

        toggleMotion: function () {
            this.reducedMotion = !this.reducedMotion;
            return !this.reducedMotion;
        },

        isMotionActive: function () {
            return isMotionActive;
        },

        /**
         * Safe animation helper respecting reduced motion
         */
        animate: function (target, vars) {
            if (!window.gsap) return;
            if (this.reducedMotion) {
                const instantVars = Object.assign({}, vars, {
                    duration: 0.01,
                    delay: 0,
                    stagger: 0,
                    ease: 'none'
                });
                return gsap.to(target, instantVars);
            }
            return gsap.to(target, vars);
        }
    };
})();
