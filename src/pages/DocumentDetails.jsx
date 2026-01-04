import { useParams, Link } from 'react-router-dom';
import { FiArrowLeft, FiPackage, FiUser, FiMapPin, FiCalendar, FiHash, FiFileText } from 'react-icons/fi';
import Layout from '../components/layout/Layout';
import { useDocument } from '../hooks/useDocuments';
import { parseExtractedData, formatDate, getStatusColor } from '../utils/utils';

export default function DocumentDetails() {
  const { id } = useParams();
  const { data: document, isLoading, error } = useDocument(id);

  const parsedData = document?.rawResponse 
    ? parseExtractedData(document.rawResponse) 
    : null;

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      </Layout>
    );
  }

  if (error || !document) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-foreground mb-2">Document Not Found</h2>
          <p className="text-muted-foreground mb-6">The requested document could not be found.</p>
          <Link to="/dashboard" className="text-primary hover:underline">
            Return to Dashboard
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Back button & Header */}
        <div className="flex items-center gap-4">
          <Link 
            to="/dashboard"
            className="p-2 rounded-lg hover:bg-muted transition-colors"
          >
            <FiArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-foreground">Document Details</h1>
            <p className="text-muted-foreground font-mono">{document.trackingNumber}</p>
          </div>
          <span className={`px-4 py-2 rounded-full text-sm font-medium capitalize ${getStatusColor(document.status)}`}>
            {document.status}
          </span>
        </div>

        {/* Main Content - Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Metadata */}
          <div className="space-y-6">
            {/* Shipment Info Card */}
            <div className="glass rounded-xl p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <FiPackage className="w-5 h-5 text-primary" />
                Shipment Information
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <FiHash className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Tracking Number</p>
                    <p className="text-foreground font-mono">{document.trackingNumber}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center flex-shrink-0">
                    <FiPackage className="w-5 h-5 text-success" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Weight</p>
                    <p className="text-foreground">{document.weight}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-info/10 flex items-center justify-center flex-shrink-0">
                    <FiCalendar className="w-5 h-5 text-info" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Created</p>
                    <p className="text-foreground">{formatDate(document.createdAt)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sender/Receiver Card */}
            <div className="glass rounded-xl p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <FiUser className="w-5 h-5 text-primary" />
                Parties
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Sender</p>
                  <div className="p-4 rounded-lg bg-muted/30">
                    <p className="font-medium text-foreground">{document.sender}</p>
                    <p className="text-sm text-muted-foreground mt-1">{document.origin}</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Receiver</p>
                  <div className="p-4 rounded-lg bg-muted/30">
                    <p className="font-medium text-foreground">{document.receiver}</p>
                    <p className="text-sm text-muted-foreground mt-1">{document.destination}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Route Card */}
            <div className="glass rounded-xl p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <FiMapPin className="w-5 h-5 text-primary" />
                Route
              </h3>
              
              <div className="flex items-center gap-4">
                <div className="flex-1 p-4 rounded-lg bg-muted/30 text-center">
                  <p className="text-sm text-muted-foreground">Origin</p>
                  <p className="font-medium text-foreground">{document.origin}</p>
                </div>
                <div className="text-primary text-2xl">→</div>
                <div className="flex-1 p-4 rounded-lg bg-muted/30 text-center">
                  <p className="text-sm text-muted-foreground">Destination</p>
                  <p className="font-medium text-foreground">{document.destination}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Parsed Data */}
          <div className="glass rounded-xl p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <FiFileText className="w-5 h-5 text-primary" />
              Extracted Data
            </h3>
            
            {parsedData ? (
              parsedData.success ? (
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-success/10 border border-success/20 text-success text-sm">
                    ✓ Data parsed successfully
                  </div>
                  <pre className="p-4 rounded-lg bg-muted/50 overflow-x-auto text-sm text-foreground font-mono whitespace-pre-wrap">
                    {JSON.stringify(parsedData.data, null, 2)}
                  </pre>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-warning/10 border border-warning/20 text-warning text-sm">
                    ⚠ {parsedData.error}
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50 overflow-x-auto">
                    <p className="text-sm text-muted-foreground mb-2">Raw content:</p>
                    <pre className="text-sm text-foreground font-mono whitespace-pre-wrap">
                      {parsedData.data}
                    </pre>
                  </div>
                </div>
              )
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No extracted data available
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
