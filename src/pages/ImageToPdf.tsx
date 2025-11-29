import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { FileImage, Download, Loader2, X, Upload, GripVertical, FilePlus, FileStack, CheckCircle } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import jsPDF from 'jspdf';
import { PDFDocument } from 'pdf-lib';

interface ImageFile {
    id: string;
    file: File;
    preview: string;
}

interface PdfFile {
    id: string;
    file: File;
    name: string;
}

type Mode = 'image-to-pdf' | 'merge-pdf';

export const ImageToPdf: React.FC = () => {
    const [mode, setMode] = useState<Mode>('image-to-pdf');
    const [images, setImages] = useState<ImageFile[]>([]);
    const [pdfFiles, setPdfFiles] = useState<PdfFile[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [generatedPdfUrl, setGeneratedPdfUrl] = useState<string | null>(null);

    // Image to PDF handlers
    const onDropImages = useCallback((acceptedFiles: File[]) => {
        const imageFiles = acceptedFiles.filter(file => file.type.startsWith('image/'));

        if (imageFiles.length !== acceptedFiles.length) {
            setError('Some files were not images and were skipped');
            setTimeout(() => setError(null), 3000);
        }

        const newImages: ImageFile[] = imageFiles.map(file => ({
            id: `${file.name}-${Date.now()}-${Math.random()}`,
            file,
            preview: URL.createObjectURL(file)
        }));

        setImages(prev => [...prev, ...newImages]);
    }, []);

    // PDF merge handlers
    const onDropPdfs = useCallback((acceptedFiles: File[]) => {
        const pdfFilesList = acceptedFiles.filter(file => file.type === 'application/pdf');

        if (pdfFilesList.length !== acceptedFiles.length) {
            setError('Some files were not PDFs and were skipped');
            setTimeout(() => setError(null), 3000);
        }

        const newPdfs: PdfFile[] = pdfFilesList.map(file => ({
            id: `${file.name}-${Date.now()}-${Math.random()}`,
            file,
            name: file.name
        }));

        setPdfFiles(prev => [...prev, ...newPdfs]);
    }, []);

    const { getRootProps: getImageRootProps, getInputProps: getImageInputProps, isDragActive: isImageDragActive } = useDropzone({
        onDrop: onDropImages,
        accept: {
            'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.bmp']
        },
        multiple: true
    });

    const { getRootProps: getPdfRootProps, getInputProps: getPdfInputProps, isDragActive: isPdfDragActive } = useDropzone({
        onDrop: onDropPdfs,
        accept: {
            'application/pdf': ['.pdf']
        },
        multiple: true
    });

    const removeImage = (id: string) => {
        setImages(prev => {
            const image = prev.find(img => img.id === id);
            if (image) {
                URL.revokeObjectURL(image.preview);
            }
            return prev.filter(img => img.id !== id);
        });
    };

    const removePdf = (id: string) => {
        setPdfFiles(prev => prev.filter(pdf => pdf.id !== id));
    };

    const generatePDF = async () => {
        if (images.length === 0) return;

        setIsGenerating(true);
        setProgress(0);
        setError(null);

        try {
            let pdf: jsPDF | null = null;

            for (let i = 0; i < images.length; i++) {
                const image = images[i];
                setProgress(((i + 1) / images.length) * 100);

                // Load image
                const img = new Image();
                img.src = image.preview;
                await new Promise((resolve) => {
                    img.onload = resolve;
                });

                // Get image dimensions
                const imgWidth = img.width;
                const imgHeight = img.height;

                // Convert pixels to mm (assuming 96 DPI)
                const maxDimension = 297; // mm (A4 height)
                const scaleFactor = Math.max(imgWidth, imgHeight) / maxDimension;
                const pdfWidth = imgWidth / scaleFactor;
                const pdfHeight = imgHeight / scaleFactor;

                if (i === 0) {
                    pdf = new jsPDF({
                        orientation: pdfWidth > pdfHeight ? 'landscape' : 'portrait',
                        unit: 'mm',
                        format: [pdfWidth, pdfHeight]
                    });
                } else {
                    pdf!.addPage([pdfWidth, pdfHeight], pdfWidth > pdfHeight ? 'landscape' : 'portrait');
                }

                pdf!.addImage(image.preview, 'JPEG', 0, 0, pdfWidth, pdfHeight);
            }

            const pdfOutput = pdf!.output('blob');
            const url = URL.createObjectURL(pdfOutput);
            setGeneratedPdfUrl(url);

            setProgress(100);
            setTimeout(() => {
                setIsGenerating(false);
                setProgress(0);
            }, 500);
        } catch (err) {
            console.error('PDF generation failed:', err);
            setError('Failed to generate PDF. Please try again.');
            setIsGenerating(false);
        }
    };

    const mergePDFs = async () => {
        if (pdfFiles.length === 0) return;

        setIsGenerating(true);
        setProgress(0);
        setError(null);

        try {
            const mergedPdf = await PDFDocument.create();

            for (let i = 0; i < pdfFiles.length; i++) {
                const file = pdfFiles[i];
                setProgress(((i + 1) / pdfFiles.length) * 100);

                const arrayBuffer = await file.file.arrayBuffer();
                const pdf = await PDFDocument.load(arrayBuffer);
                const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
                copiedPages.forEach((page) => {
                    mergedPdf.addPage(page);
                });
            }

            const pdfBytes = await mergedPdf.save();
            const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            setGeneratedPdfUrl(url);

            setProgress(100);
            setTimeout(() => {
                setIsGenerating(false);
                setProgress(0);
            }, 500);
        } catch (err) {
            console.error('PDF merge failed:', err);
            setError('Failed to merge PDFs. Please try again.');
            setIsGenerating(false);
        }
    };

    const handleModeChange = (newMode: Mode) => {
        setMode(newMode);
        setError(null);
    };

    const getRootProps = mode === 'image-to-pdf' ? getImageRootProps : getPdfRootProps;
    const getInputProps = mode === 'image-to-pdf' ? getImageInputProps : getPdfInputProps;
    const isDragActive = mode === 'image-to-pdf' ? isImageDragActive : isPdfDragActive;
    const files = mode === 'image-to-pdf' ? images : pdfFiles;
    const hasFiles = files.length > 0;

    return (
        <>
            {/* Custom Background */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-950 to-black"></div>
            </div>

            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col items-center min-h-[80vh] relative z-10">

                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center space-y-8 max-w-3xl mb-16"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-4 backdrop-blur-sm">
                        <FilePlus className="w-4 h-4" />
                        <span>Multi-Function PDF Tool</span>
                    </div>

                    <h1 className="text-5xl sm:text-7xl font-bold text-white tracking-tight leading-tight font-display drop-shadow-2xl">
                        PDF{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-500 to-teal-500 animate-gradient-x">
                            Toolkit
                        </span>
                    </h1>

                    <p className="text-lg text-slate-400 max-w-2xl mx-auto font-light leading-relaxed">
                        Convert multiple images to PDF or merge multiple PDF files into one document.
                    </p>
                </motion.div>

                {/* Mode Selector */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 }}
                    className="w-full max-w-4xl mb-8"
                >
                    <div className="glass-panel rounded-2xl p-2 flex gap-2">
                        <button
                            onClick={() => handleModeChange('image-to-pdf')}
                            className={`flex-1 px-6 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-3 ${mode === 'image-to-pdf'
                                ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                                : 'text-slate-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <FileImage className="w-5 h-5" />
                            <span>Image to PDF</span>
                        </button>
                        <button
                            onClick={() => handleModeChange('merge-pdf')}
                            className={`flex-1 px-6 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-3 ${mode === 'merge-pdf'
                                ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                                : 'text-slate-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <FileStack className="w-5 h-5" />
                            <span>Merge PDFs</span>
                        </button>
                    </div>
                </motion.div>

                {/* Upload Section */}
                <motion.div
                    key={mode}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="w-full max-w-4xl mb-8"
                >
                    <div
                        {...getRootProps()}
                        className={`relative group cursor-pointer transition-all duration-300 ${isDragActive ? 'scale-[1.02]' : ''}`}
                    >
                        <div className={`absolute -inset-1 bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500 rounded-2xl opacity-30 blur transition duration-500 ${isDragActive ? 'opacity-60' : 'group-hover:opacity-50'
                            }`}></div>
                        <div className="relative glass-panel rounded-2xl p-12 shadow-2xl text-center">
                            <input {...getInputProps()} />
                            <div className="flex flex-col items-center gap-6">
                                <div className="p-6 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl">
                                    {isDragActive ? (
                                        <Upload className="w-12 h-12 text-cyan-400 animate-bounce" />
                                    ) : mode === 'image-to-pdf' ? (
                                        <FileImage className="w-12 h-12 text-blue-400" />
                                    ) : (
                                        <FileStack className="w-12 h-12 text-blue-400" />
                                    )}
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-white mb-2">
                                        {isDragActive
                                            ? `Drop ${mode === 'image-to-pdf' ? 'images' : 'PDFs'} here`
                                            : mode === 'image-to-pdf'
                                                ? 'Upload Images'
                                                : 'Upload PDF Files'}
                                    </h3>
                                    <p className="text-slate-400">
                                        Drag & drop {mode === 'image-to-pdf' ? 'images' : 'PDF files'} here, or click to browse
                                    </p>
                                    <p className="text-sm text-slate-500 mt-2">
                                        {mode === 'image-to-pdf'
                                            ? 'Supports PNG, JPG, JPEG, GIF, WebP, BMP'
                                            : 'Supports PDF files only'}
                                    </p>
                                </div>
                                {hasFiles && (
                                    <div className="text-sm text-cyan-400 font-medium">
                                        {files.length} {mode === 'image-to-pdf' ? 'image' : 'PDF'}
                                        {files.length !== 1 ? 's' : ''} selected
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Error Message */}
                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-200 text-sm text-center backdrop-blur-sm"
                            >
                                {error}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* File Preview Grid */}
                {hasFiles && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="w-full max-w-4xl mb-8"
                    >
                        <div className="glass-panel rounded-2xl p-6 shadow-2xl">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-white">
                                    Selected {mode === 'image-to-pdf' ? 'Images' : 'PDFs'} ({files.length})
                                </h3>
                                <button
                                    onClick={() => {
                                        if (mode === 'image-to-pdf') {
                                            images.forEach(img => URL.revokeObjectURL(img.preview));
                                            setImages([]);
                                        } else {
                                            setPdfFiles([]);
                                        }
                                    }}
                                    className="text-sm text-slate-400 hover:text-red-400 transition-colors"
                                >
                                    Clear All
                                </button>
                            </div>

                            {mode === 'image-to-pdf' ? (
                                <Reorder.Group axis="y" values={images} onReorder={setImages} className="space-y-3">
                                    {images.map((image) => (
                                        <Reorder.Item key={image.id} value={image} className="group">
                                            <div className="flex items-center gap-4 p-4 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 hover:border-white/20 transition-all cursor-move">
                                                <GripVertical className="w-5 h-5 text-slate-500 group-hover:text-slate-300 transition-colors flex-shrink-0" />
                                                <img
                                                    src={image.preview}
                                                    alt={image.file.name}
                                                    className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-white font-medium truncate">{image.file.name}</p>
                                                    <p className="text-sm text-slate-400">
                                                        {(image.file.size / 1024).toFixed(2)} KB
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={() => removeImage(image.id)}
                                                    className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors flex-shrink-0"
                                                >
                                                    <X className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </Reorder.Item>
                                    ))}
                                </Reorder.Group>
                            ) : (
                                <Reorder.Group axis="y" values={pdfFiles} onReorder={setPdfFiles} className="space-y-3">
                                    {pdfFiles.map((pdf) => (
                                        <Reorder.Item key={pdf.id} value={pdf} className="group">
                                            <div className="flex items-center gap-4 p-4 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 hover:border-white/20 transition-all cursor-move">
                                                <GripVertical className="w-5 h-5 text-slate-500 group-hover:text-slate-300 transition-colors flex-shrink-0" />
                                                <div className="w-16 h-16 flex items-center justify-center bg-red-500/10 rounded-lg flex-shrink-0">
                                                    <FileStack className="w-8 h-8 text-red-400" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-white font-medium truncate">{pdf.name}</p>
                                                    <p className="text-sm text-slate-400">
                                                        {(pdf.file.size / 1024).toFixed(2)} KB
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={() => removePdf(pdf.id)}
                                                    className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors flex-shrink-0"
                                                >
                                                    <X className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </Reorder.Item>
                                    ))}
                                </Reorder.Group>
                            )}

                            {/* Generate/Merge Button */}
                            <div className="mt-8 pt-6 border-t border-white/10">
                                <button
                                    onClick={mode === 'image-to-pdf' ? generatePDF : mergePDFs}
                                    disabled={isGenerating || files.length === 0}
                                    className="w-full px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-95"
                                >
                                    {isGenerating ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            <span>
                                                {mode === 'image-to-pdf' ? 'Generating PDF' : 'Merging PDFs'}... {Math.round(progress)}%
                                            </span>
                                        </>
                                    ) : (
                                        <>
                                            <Download className="w-5 h-5" />
                                            <span>{mode === 'image-to-pdf' ? 'Generate PDF' : 'Merge PDFs'}</span>
                                        </>
                                    )}
                                </button>

                                {/* Progress Bar */}
                                {isGenerating && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="mt-4 h-2 bg-slate-800 rounded-full overflow-hidden border border-white/5"
                                    >
                                        <motion.div
                                            className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
                                            initial={{ width: 0 }}
                                            animate={{ width: `${progress}%` }}
                                            transition={{ type: "spring", stiffness: 50 }}
                                        />
                                    </motion.div>
                                )}

                                {/* Download Button (Manual) */}
                                {generatedPdfUrl && !isGenerating && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="mt-6 p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex flex-col items-center gap-4"
                                    >
                                        <div className="flex items-center gap-2 text-emerald-400 font-medium">
                                            <CheckCircle className="w-5 h-5" />
                                            <span>PDF Ready!</span>
                                        </div>
                                        <a
                                            href={generatedPdfUrl}
                                            download={`document-${Date.now()}.pdf`}
                                            className="px-8 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-lg transition-colors flex items-center gap-2 shadow-lg"
                                            onClick={() => {
                                                // Optional: Clear state after download if desired, or keep it
                                            }}
                                        >
                                            <Download className="w-4 h-4" />
                                            Download PDF
                                        </a>
                                    </motion.div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Empty State */}
                {!hasFiles && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-center text-slate-500 mt-12"
                    >
                        <p>
                            No {mode === 'image-to-pdf' ? 'images' : 'PDF files'} selected yet. Upload some{' '}
                            {mode === 'image-to-pdf' ? 'images' : 'PDFs'} to get started!
                        </p>
                    </motion.div>
                )}
            </div>
        </>
    );
};
