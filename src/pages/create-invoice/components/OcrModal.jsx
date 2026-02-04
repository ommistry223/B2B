import React, { useMemo, useEffect, useState } from 'react'
import Button from '../../../components/ui/Button'
import Icon from '../../../components/AppIcon'

const OcrModal = ({ ocrUrl, onClose, onExtractData }) => {
  const activeUrl = useMemo(() => ocrUrl || 'http://localhost:7860', [ocrUrl])
  const [successMessage, setSuccessMessage] = useState(null)

  // Listen for messages from the OCR iframe
  useEffect(() => {
    const handleMessage = event => {
      // Verify the message is from our OCR server
      if (
        event.origin !== 'http://localhost:7860' &&
        !ocrUrl?.includes(event.origin)
      ) {
        return
      }

      if (event.data?.type === 'OCR_EXTRACT_DATA' && event.data?.data) {
        console.log('📄 Received OCR data:', event.data.data)
        if (onExtractData) {
          onExtractData(event.data.data)
        }
        // Show success message
        setSuccessMessage('✅ Invoice data extracted and populated in form!')
        // Clear success message after 3 seconds
        setTimeout(() => setSuccessMessage(null), 3000)
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [ocrUrl, onExtractData])

  return (
    <div
      className="fixed inset-0 z-[1400] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-card rounded-lg shadow-elevation-xl border border-border w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Icon name="Scan" size={20} color="var(--color-primary)" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">
                Invoice OCR
              </h2>
              <p className="text-sm text-muted-foreground">
                Upload invoice PDF or image to extract data
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            iconName="X"
            iconSize={20}
            onClick={onClose}
          />
        </div>

        {successMessage && (
          <div className="mx-6 mt-4 px-4 py-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
            <Icon name="CheckCircle" size={20} color="#16a34a" />
            <span className="text-sm font-medium text-green-800">
              {successMessage}
            </span>
          </div>
        )}

        <div className="flex-1 bg-muted/30 p-3 md:p-4">
          <div className="w-full h-[70vh] rounded-lg overflow-hidden border border-border bg-background">
            <iframe
              title="Invoice OCR"
              src={activeUrl}
              className="w-full h-full"
              allow="clipboard-read; clipboard-write"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 p-4 md:p-6 border-t border-border">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  )
}

export default OcrModal
