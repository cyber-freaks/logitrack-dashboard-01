/**
 * Safely parses the rawResponse from OCR/extraction APIs
 * Handles malformed JSON gracefully
 */
export function parseExtractedData(rawResponse) {
  if (!rawResponse) {
    return { success: false, data: null, error: 'No data provided' };
  }

  // If already an object, return it
  if (typeof rawResponse === 'object') {
    return { success: true, data: rawResponse, error: null };
  }

  try {
    // Try direct JSON parse
    const parsed = JSON.parse(rawResponse);
    return { success: true, data: parsed, error: null };
  } catch {
    // Try to extract JSON from messy string
    try {
      // Look for JSON object pattern
      const jsonMatch = rawResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return { success: true, data: parsed, error: null };
      }
      
      // Look for JSON array pattern
      const arrayMatch = rawResponse.match(/\[[\s\S]*\]/);
      if (arrayMatch) {
        const parsed = JSON.parse(arrayMatch[0]);
        return { success: true, data: parsed, error: null };
      }
    } catch {
      // Return raw string as fallback
      return { 
        success: false, 
        data: rawResponse, 
        error: 'Could not parse JSON. Displaying raw content.' 
      };
    }
  }

  return { success: false, data: rawResponse, error: 'Unknown parsing error' };
}

/**
 * Debounce function for search inputs
 */
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Format date to readable string
 */
export function formatDate(date) {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Get status color class based on shipment status
 */
export function getStatusColor(status) {
  const statusColors = {
    delivered: 'bg-success text-success-foreground',
    transit: 'bg-warning text-warning-foreground',
    processing: 'bg-info text-info-foreground',
    pending: 'bg-muted text-muted-foreground',
    cancelled: 'bg-destructive text-destructive-foreground',
  };
  return statusColors[status?.toLowerCase()] || statusColors.pending;
}

/**
 * Truncate text with ellipsis
 */
export function truncateText(text, maxLength = 50) {
  if (!text || text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
}

/**
 * Generate random ID for demo purposes
 */
export function generateId() {
  return `LT-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
}
