import React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva } from 'class-variance-authority'
import { cn } from '../../util/cn'
import Icon from '../AppIcon'

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-semibold ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] relative overflow-hidden',
  {
    variants: {
      variant: {
        default:
          'bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-elevation-md hover:shadow-elevation-lg hover:-translate-y-0.5',
        destructive:
          'bg-gradient-to-r from-destructive to-red-600 text-destructive-foreground shadow-elevation-md hover:shadow-elevation-lg hover:-translate-y-0.5',
        outline:
          'border border-input bg-card text-foreground hover:bg-muted hover:border-primary/60 hover:-translate-y-0.5',
        secondary:
          'bg-gradient-to-r from-secondary to-primary text-secondary-foreground shadow-elevation-md hover:shadow-elevation-lg hover:-translate-y-0.5',
        ghost:
          'text-foreground hover:bg-muted hover:-translate-y-0.5',
        link: 'text-primary underline-offset-4 hover:underline hover:text-primary/80',
        success:
          'bg-gradient-to-r from-success to-emerald-600 text-success-foreground shadow-elevation-md hover:shadow-elevation-lg hover:-translate-y-0.5',
        warning:
          'bg-gradient-to-r from-warning to-amber-600 text-warning-foreground shadow-elevation-md hover:shadow-elevation-lg hover:-translate-y-0.5',
        danger:
          'bg-gradient-to-r from-error to-red-600 text-error-foreground shadow-elevation-md hover:shadow-elevation-lg hover:-translate-y-0.5',
      },
      size: {
        default: 'h-10 px-5 py-2',
        sm: 'h-9 rounded-lg px-4 text-sm',
        lg: 'h-12 rounded-xl px-8 text-base',
        icon: 'h-10 w-10',
        xs: 'h-8 rounded-lg px-3 text-xs',
        xl: 'h-14 rounded-xl px-12 text-lg font-bold',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

const Button = React.forwardRef(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      children,
      loading = false,
      iconName = null,
      iconPosition = 'left',
      iconSize = null,
      fullWidth = false,
      disabled = false,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button'

    // Icon size mapping based on button size
    const iconSizeMap = {
      xs: 12,
      sm: 14,
      default: 16,
      lg: 18,
      xl: 20,
      icon: 16,
    }

    const calculatedIconSize = iconSize || iconSizeMap?.[size] || 16

    // Loading spinner
    const LoadingSpinner = () => (
      <svg
        className="animate-spin -ml-1 mr-2 h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 714 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    )

    const renderIcon = () => {
      if (!iconName) return null
      try {
        return (
          <Icon
            name={iconName}
            size={calculatedIconSize}
            className={cn(
              children && iconPosition === 'left' && 'mr-2',
              children && iconPosition === 'right' && 'ml-2'
            )}
          />
        )
      } catch {
        return null
      }
    }

    const renderFallbackButton = () => (
      <button
        className={cn(
          buttonVariants({ variant, size, className }),
          fullWidth && 'w-full'
        )}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <LoadingSpinner />}
        {iconName && iconPosition === 'left' && renderIcon()}
        {children}
        {iconName && iconPosition === 'right' && renderIcon()}
      </button>
    )

    // When asChild is true, merge icons into the child element
    if (asChild) {
      try {
        if (!children || React.Children?.count(children) !== 1) {
          return renderFallbackButton()
        }

        const child = React.Children?.only(children)

        if (!React.isValidElement(child)) {
          return renderFallbackButton()
        }
        const content = (
          <>
            {loading && <LoadingSpinner />}
            {iconName && iconPosition === 'left' && renderIcon()}
            {child?.props?.children}
            {iconName && iconPosition === 'right' && renderIcon()}
          </>
        )

        const clonedChild = React.cloneElement(child, {
          className: cn(
            buttonVariants({ variant, size, className }),
            fullWidth && 'w-full',
            child?.props?.className
          ),
          disabled: disabled || loading || child?.props?.disabled,
          children: content,
        })

        return (
          <Comp ref={ref} {...props}>
            {clonedChild}
          </Comp>
        )
      } catch {
        return renderFallbackButton()
      }
    }

    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size, className }),
          fullWidth && 'w-full'
        )}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <LoadingSpinner />}
        {iconName && iconPosition === 'left' && renderIcon()}
        {children}
        {iconName && iconPosition === 'right' && renderIcon()}
      </Comp>
    )
  }
)

Button.displayName = 'Button'
export default Button
