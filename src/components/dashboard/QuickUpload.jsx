import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FiUploadCloud, FiFile, FiCheck, FiX, FiLoader } from 'react-icons/fi';
import { useUploadDocument } from '../../hooks/useDocuments';

export default function QuickUpload() {
  const [uploadedFile, setUploadedFile] = useState(null);
  const { mutate: uploadDocument, isPending, isSuccess, isError, reset } = useUploadDocument();

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setUploadedFile(file);
      uploadDocument(file);
    }
  }, [uploadDocument]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.png', '.jpg', '.jpeg'],
    },
    maxFiles: 1,
    disabled: isPending,
  });

  const handleReset = () => {
    setUploadedFile(null);
    reset();
  };

  return (
    <div className="glass rounded-xl p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">Quick Upload</h3>
      <p className="text-sm text-muted-foreground mb-6">
        Drop a shipping document or invoice to automatically extract data using OCR.
      </p>

      {!uploadedFile ? (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all ${
            isDragActive 
              ? 'border-primary bg-primary/5' 
              : 'border-border hover:border-primary/50 hover:bg-muted/30'
          }`}
        >
          <input {...getInputProps()} />
          <FiUploadCloud className={`w-12 h-12 mx-auto mb-4 ${isDragActive ? 'text-primary' : 'text-muted-foreground'}`} />
          {isDragActive ? (
            <p className="text-primary font-medium">Drop the file here...</p>
          ) : (
            <>
              <p className="text-foreground font-medium mb-1">
                Drag & drop a file here
              </p>
              <p className="text-sm text-muted-foreground">
                or click to browse (PDF, PNG, JPG)
              </p>
            </>
          )}
        </div>
      ) : (
        <div className="border border-border rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              isError ? 'bg-destructive/10' : isSuccess ? 'bg-success/10' : 'bg-primary/10'
            }`}>
              {isPending ? (
                <FiLoader className="w-6 h-6 text-primary animate-spin" />
              ) : isSuccess ? (
                <FiCheck className="w-6 h-6 text-success" />
              ) : isError ? (
                <FiX className="w-6 h-6 text-destructive" />
              ) : (
                <FiFile className="w-6 h-6 text-primary" />
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="text-foreground font-medium truncate">{uploadedFile.name}</p>
              <p className="text-sm text-muted-foreground">
                {(uploadedFile.size / 1024).toFixed(1)} KB
              </p>
              
              {isPending && (
                <div className="mt-3">
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full animate-pulse" style={{ width: '60%' }} />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">Processing document...</p>
                </div>
              )}
              
              {isSuccess && (
                <p className="text-sm text-success mt-2">Document uploaded successfully!</p>
              )}
              
              {isError && (
                <p className="text-sm text-destructive mt-2">Upload failed. Please try again.</p>
              )}
            </div>

            <button
              onClick={handleReset}
              className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>
          
          {(isSuccess || isError) && (
            <button
              onClick={handleReset}
              className="mt-4 w-full py-2 rounded-lg border border-border hover:bg-muted transition-colors text-sm font-medium"
            >
              Upload Another Document
            </button>
          )}
        </div>
      )}
    </div>
  );
}
