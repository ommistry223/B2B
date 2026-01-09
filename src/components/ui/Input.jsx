import React from 'react'
import { cn } from '../../util/cn'

const Input = React.forwardRef(
  (
    {
      className,
      type = 'text',
      label,
      description,
      error,
      required = false,
      id,
      ...props
    },
    ref
  ) => {
    // Generate unique ID if not provided
    const inputId = id || `input-${Math.random()?.toString(36)?.substr(2, 9)}`

    // Base input classes with enhanced styling
    const baseInputClasses =
      'flex h-11 w-full rounded-xl border-2 border-input bg-background px-4 py-2.5 text-sm font-medium ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300 hover:border-muted-foreground/30'

    // Checkbox-specific styles
    if (type === 'checkbox') {
      return (
        <input
          type="checkbox"
          className={cn(
            'h-4 w-4 rounded border border-input bg-background text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            className
          )}
          ref={ref}
          id={inputId}
          {...props}
        />
      )
    }

    // Radio button-specific styles
    if (type === 'radio') {
      return (
        <input
          type="radio"
          className={cn(
            'h-4 w-4 rounded-full border border-input bg-background text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            className
          )}
          ref={ref}
          id={inputId}
          {...props}
        />
      )
    }

    // For regular inputs with wrapper structure
    return (
      <div className="space-y-2">
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              'text-sm font-semibold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
              error ? 'text-destructive' : 'text-foreground'
            )}
          >
            {label}
            {required && (
              <span className="text-destructive ml-1 font-bold">*</span>
            )}
          </label>
        )}

        <input
          type={type}
          className={cn(
            baseInputClasses,
            error &&
              'border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20',
            className
          )}
          ref={ref}
          id={inputId}
          {...props}
        />

        {description && !error && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}

        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input
