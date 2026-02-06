/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class', 'class'],
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './public/index.html',
  ],
  // Enable important to reduce CSS specificity issues
  important: false,
  // Optimize for production
  future: {
    hoverOnlyWhenSupported: true,
  },
  theme: {
  	extend: {
  		colors: {
  			border: 'var(--color-border)',
  			input: 'var(--color-input)',
  			ring: 'var(--color-ring)',
  			background: 'var(--color-background)',
  			foreground: 'var(--color-foreground)',
  			primary: {
  				DEFAULT: 'var(--color-primary)',
  				foreground: 'var(--color-primary-foreground)'
  			},
  			secondary: {
  				DEFAULT: 'var(--color-secondary)',
  				foreground: 'var(--color-secondary-foreground)'
  			},
  			accent: {
  				DEFAULT: 'var(--color-accent)',
  				foreground: 'var(--color-accent-foreground)'
  			},
  			destructive: {
  				DEFAULT: 'var(--color-destructive)',
  				foreground: 'var(--color-destructive-foreground)'
  			},
  			success: {
  				DEFAULT: 'var(--color-success)',
  				foreground: 'var(--color-success-foreground)'
  			},
  			warning: {
  				DEFAULT: 'var(--color-warning)',
  				foreground: 'var(--color-warning-foreground)'
  			},
  			error: {
  				DEFAULT: 'var(--color-error)',
  				foreground: 'var(--color-error-foreground)'
  			},
  			muted: {
  				DEFAULT: 'var(--color-muted)',
  				foreground: 'var(--color-muted-foreground)'
  			},
  			card: {
  				DEFAULT: 'var(--color-card)',
  				foreground: 'var(--color-card-foreground)'
  			},
  			popover: {
  				DEFAULT: 'var(--color-popover)',
  				foreground: 'var(--color-popover-foreground)'
  			}
  		},
  		borderRadius: {
  			sm: 'var(--radius-sm)',
  			md: 'var(--radius-md)',
  			lg: 'var(--radius-lg)',
  			xl: 'var(--radius-xl)'
  		},
  		fontFamily: {
  			sans: [
  				'Sora',
  				'sans-serif'
  			],
  			heading: [
  				'Space Grotesk',
  				'sans-serif'
  			],
  			caption: [
  				'Sora',
  				'sans-serif'
  			],
  			mono: [
  				'JetBrains Mono',
  				'monospace'
  			]
  		},
  		fontSize: {
  			h1: [
  				'2.25rem',
  				{
  					lineHeight: '1.2',
  					fontWeight: '700'
  				}
  			],
  			h2: [
  				'1.875rem',
  				{
  					lineHeight: '1.25',
  					fontWeight: '600'
  				}
  			],
  			h3: [
  				'1.5rem',
  				{
  					lineHeight: '1.3',
  					fontWeight: '600'
  				}
  			],
  			h4: [
  				'1.25rem',
  				{
  					lineHeight: '1.4',
  					fontWeight: '500'
  				}
  			],
  			h5: [
  				'1.125rem',
  				{
  					lineHeight: '1.5',
  					fontWeight: '500'
  				}
  			],
  			caption: [
  				'0.875rem',
  				{
  					lineHeight: '1.4',
  					letterSpacing: '-0.01em'
  				}
  			]
  		},
  		spacing: {
  			'18': '4.5rem',
  			'88': '22rem',
  			'128': '32rem'
  		},
  		maxWidth: {
  			'8xl': '88rem',
  			'9xl': '96rem'
  		},
  		zIndex: {
  			'100': '100',
  			'200': '200',
  			'300': '300',
  			'1000': '1000',
  			'1050': '1050',
  			'1100': '1100',
  			'1200': '1200'
  		},
  		transitionTimingFunction: {
  			smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
  			spring: 'cubic-bezier(0.34, 1.26, 0.64, 1)'
  		},
  		transitionDuration: {
  			'250': '250ms'
  		},
  		boxShadow: {
  			'elevation-sm': '0 2px 8px rgba(15, 23, 42, 0.06)',
  			'elevation-md': '0 6px 18px rgba(15, 23, 42, 0.1)',
  			'elevation-lg': '0 12px 30px rgba(15, 23, 42, 0.14)',
  			'elevation-xl': '0 24px 60px rgba(15, 23, 42, 0.18)',
  			'neon-primary': '0 0 20px rgba(59, 130, 246, 0.5)',
  			'neon-secondary': '0 0 20px rgba(124, 58, 237, 0.5)',
  			glass: '0 8px 32px rgba(31, 38, 135, 0.37)'
  		},
  		animation: {
  			'spin-slow': 'spin 3s linear infinite',
  			'bounce-slow': 'bounce 3s infinite',
  			'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
  			'gradient-x': 'gradient-x 15s ease infinite',
  			'gradient-y': 'gradient-y 15s ease infinite',
  			'gradient-xy': 'gradient-xy 15s ease infinite',
  			shimmer: 'shimmer 2s linear infinite',
  			float: 'float 6s ease-in-out infinite',
  			'float-slow': 'float 8s ease-in-out infinite',
  			glow: 'glow 2s ease-in-out infinite',
  			'slide-up': 'slide-up 0.5s ease-out',
  			'slide-down': 'slide-down 0.5s ease-out',
  			'slide-left': 'slide-left 0.5s ease-out',
  			'slide-right': 'slide-right 0.5s ease-out',
  			'fade-in': 'fade-in 0.6s ease-out',
  			'scale-in': 'scale-in 0.4s ease-out',
  			'rotate-in': 'rotate-in 0.6s ease-out',
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		},
  		keyframes: {
  			'gradient-x': {
  				'0%, 100%': {
  					'background-position': '0% 50%'
  				},
  				'50%': {
  					'background-position': '100% 50%'
  				}
  			},
  			'gradient-y': {
  				'0%, 100%': {
  					'background-position': '50% 0%'
  				},
  				'50%': {
  					'background-position': '50% 100%'
  				}
  			},
  			'gradient-xy': {
  				'0%, 100%': {
  					'background-position': '0% 0%'
  				},
  				'25%': {
  					'background-position': '100% 0%'
  				},
  				'50%': {
  					'background-position': '100% 100%'
  				},
  				'75%': {
  					'background-position': '0% 100%'
  				}
  			},
  			shimmer: {
  				'0%': {
  					transform: 'translateX(-100%)'
  				},
  				'100%': {
  					transform: 'translateX(100%)'
  				}
  			},
  			float: {
  				'0%, 100%': {
  					transform: 'translateY(0px)'
  				},
  				'50%': {
  					transform: 'translateY(-20px)'
  				}
  			},
  			glow: {
  				'0%, 100%': {
  					opacity: '1',
  					filter: 'brightness(1)'
  				},
  				'50%': {
  					opacity: '0.8',
  					filter: 'brightness(1.2)'
  				}
  			},
  			'slide-up': {
  				'0%': {
  					transform: 'translateY(100%)',
  					opacity: '0'
  				},
  				'100%': {
  					transform: 'translateY(0)',
  					opacity: '1'
  				}
  			},
  			'slide-down': {
  				'0%': {
  					transform: 'translateY(-100%)',
  					opacity: '0'
  				},
  				'100%': {
  					transform: 'translateY(0)',
  					opacity: '1'
  				}
  			},
  			'slide-left': {
  				'0%': {
  					transform: 'translateX(100%)',
  					opacity: '0'
  				},
  				'100%': {
  					transform: 'translateX(0)',
  					opacity: '1'
  				}
  			},
  			'slide-right': {
  				'0%': {
  					transform: 'translateX(-100%)',
  					opacity: '0'
  				},
  				'100%': {
  					transform: 'translateX(0)',
  					opacity: '1'
  				}
  			},
  			'fade-in': {
  				'0%': {
  					opacity: '0'
  				},
  				'100%': {
  					opacity: '1'
  				}
  			},
  			'scale-in': {
  				'0%': {
  					transform: 'scale(0.9)',
  					opacity: '0'
  				},
  				'100%': {
  					transform: 'scale(1)',
  					opacity: '1'
  				}
  			},
  			'rotate-in': {
  				'0%': {
  					transform: 'rotate(-10deg) scale(0.9)',
  					opacity: '0'
  				},
  				'100%': {
  					transform: 'rotate(0) scale(1)',
  					opacity: '1'
  				}
  			},
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			}
  		},
  		backdropBlur: {
  			xs: '2px'
  		}
  	}
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('tailwindcss-animate'),
  ],
}
