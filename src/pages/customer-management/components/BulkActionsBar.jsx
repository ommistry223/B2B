import React from 'react'

import Button from '../../../components/ui/Button'

const BulkActionsBar = ({
  selectedCount,
  onUpdateCreditLimit,
  onExport,
  onClearSelection,
}) => {
  if (selectedCount === 0) return null

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-[100] bg-card rounded-lg shadow-elevation-xl border border-border p-4 flex items-center gap-4">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
          <span className="text-sm font-semibold text-primary data-text">
            {selectedCount}
          </span>
        </div>
        <span className="text-sm font-medium text-foreground">
          {selectedCount} customer{selectedCount > 1 ? 's' : ''} selected
        </span>
      </div>

      <div className="h-6 w-px bg-border" />

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          iconName="DollarSign"
          iconPosition="left"
          onClick={onUpdateCreditLimit}
        >
          Update Credit Limit
        </Button>

        <Button
          variant="outline"
          size="sm"
          iconName="Download"
          iconPosition="left"
          onClick={onExport}
        >
          Export
        </Button>

        <Button
          variant="ghost"
          size="sm"
          iconName="X"
          iconSize={16}
          onClick={onClearSelection}
        />
      </div>
    </div>
  )
}

export default BulkActionsBar
