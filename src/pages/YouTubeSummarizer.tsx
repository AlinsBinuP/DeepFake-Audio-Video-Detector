import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Youtube, BookOpen, Download, Loader2, Lightbulb, Clock, FileText, Sparkles, Play } from 'lucide-react';
import { BackgroundParticles } from '../../components/BackgroundParticles';
import { AnalysisStatus } from '../../types';
import { summarizeYouTubeVideo } from '../../services/geminiService';
import ReactMarkdown from 'react-markdown';

interface StudyNotes {
    summary: string;
    keyPoints: string[];
    timestamps: { time: string; topic: string }[];
    studyNotes: string;
}

export const YouTubeSummarizer: React.FC = () => {
    const [videoUrl, setVideoUrl] = useState('');
    const [notes, setNotes] = useState<StudyNotes | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [videoTitle, setVideoTitle] = useState('');
    const [videoId, setVideoId] = useState('');

    const extractVideoId = (url: string): string | null => {
        const patterns = [
            /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
            /youtube\.com\/embed\/([^&\n?#]+)/,
        ];

        for (const pattern of patterns) {
            const match = url.match(pattern);
            if (match) return match[1];
        }
        return null;
    };

    const fetchTranscript = async (videoId: string): Promise<{ transcript: string; title: string }> => {
        try {
            // Use local Vite proxy to bypass CORS
            const response = await fetch(`/api/youtube/watch?v=${videoId}`);
            const html = await response.text();

            // Extract title
            const titleMatch = html.match(/<title>(.+?)<\/title>/);
            const title = titleMatch ? titleMatch[1].replace(' - YouTube', '') : 'YouTube Video';

            // Extract captions data
            // Look for ytInitialPlayerResponse
            const jsonMatch = html.match(/ytInitialPlayerResponse\s*=\s*({.+?});/);
            if (!jsonMatch) {
                throw new Error("Could not parse video data");
            }

            const data = JSON.parse(jsonMatch[1]);
            const captionTracks = data?.captions?.playerCaptionsTracklistRenderer?.captionTracks;

            if (!captionTracks || captionTracks.length === 0) {
                throw new Error("No captions available for this video");
            }

            // Get the first track (usually English or auto-generated)
            // Prioritize English if available
            const track = captionTracks.find((t: any) => t.languageCode === 'en') || captionTracks[0];
            const baseUrl = track.baseUrl;

            // Use proxy for transcript URL too
            const proxyUrl = baseUrl.replace('https://www.youtube.com', '/api/youtube');

            const transcriptResponse = await fetch(proxyUrl);
            const transcriptXml = await transcriptResponse.text();

            // Parse XML transcript
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(transcriptXml, 'text/xml');
            const textNodes = xmlDoc.getElementsByTagName('text');

            let transcript = '';
            for (let i = 0; i < textNodes.length; i++) {
                const text = textNodes[i].textContent || '';
                // Decode HTML entities
                const decodedText = text
                    .replace(/&amp;/g, '&')
                    .replace(/&lt;/g, '<')
                    .replace(/&gt;/g, '>')
                    .replace(/&quot;/g, '"')
                    .replace(/&#39;/g, "'");
                transcript += decodedText + ' ';
            }

            return { transcript: transcript.trim(), title };
        } catch (err) {
            console.error("Transcript fetch error:", err);
            throw new Error("Could not fetch transcript. Video may not have captions enabled.");
        }
    };

    const handleSummarize = async () => {
        if (!videoUrl.trim()) {
            setError("Please enter a YouTube URL");
            return;
        }

        const extractedId = extractVideoId(videoUrl);
        if (!extractedId) {
            setError("Invalid YouTube URL");
            return;
        }

        setIsLoading(true);
        setError(null);
        setNotes(null);

        try {
            const { transcript, title } = await fetchTranscript(extractedId);
            setVideoTitle(title);
            setVideoId(extractedId);

            const result = await summarizeYouTubeVideo(transcript, title);
            setNotes(result);
        } catch (err: any) {
            console.error(err);
            setError(err.message || "Failed to generate study notes");
        } finally {
            setIsLoading(false);
        }
    };

    const downloadNotes = () => {
        if (!notes) return;

        const content = `# ${videoTitle}\n\n## Summary\n${notes.summary}\n\n## Key Points\n${notes.keyPoints.map((p, i) => `${i + 1}. ${p}`).join('\n')}\n\n## Timestamps\n${notes.timestamps.map(t => `- **${t.time}**: ${t.topic}`).join('\n')}\n\n## Study Notes\n${notes.studyNotes}`;

        const blob = new Blob([content], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `study-notes-${Date.now()}.md`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <>
            {/* YouTube-inspired Background */}
            <div className="fixed inset-0 z-0 bg-[#0f0f0f]">
                <BackgroundParticles status={AnalysisStatus.IDLE} />
            </div>

            <div className="min-h-screen pt-20 pb-12 px-4 relative z-10">
                <div className="max-w-7xl mx-auto">

                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8 text-center"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 text-red-300 text-sm font-medium backdrop-blur-sm mb-6">
                            <Youtube className="w-4 h-4" />
                            <span>AI Study Assistant</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 font-display">
                            YouTube to <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-pink-400 to-orange-400 animate-gradient-x">Video Notes.</span>
                        </h1>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                            Transform educational videos into comprehensive study materials with AI
                        </p>
                    </motion.div>

                    {/* Input Section - YouTube Style */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6"
                    >
                        <div className="flex gap-3">
                            <div className="flex-1 relative">
                                <input
                                    type="text"
                                    value={videoUrl}
                                    onChange={(e) => setVideoUrl(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSummarize()}
                                    placeholder="Paste YouTube URL (e.g., https://youtube.com/watch?v=...)"
                                    className="w-full px-4 py-3.5 bg-[#121212] border border-[#303030] rounded-full text-white placeholder-gray-500 focus:outline-none focus:border-red-600 transition-colors"
                                />
                            </div>
                            <button
                                onClick={handleSummarize}
                                disabled={isLoading}
                                className="px-8 py-3.5 bg-red-600 hover:bg-red-700 rounded-full font-semibold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg"
                            >
                                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                                {isLoading ? 'Analyzing...' : 'Generate Notes'}
                            </button>
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="mt-4 p-4 bg-red-900/20 border border-red-600/30 rounded-lg text-red-200 text-sm"
                            >
                                {error}
                            </motion.div>
                        )}
                    </motion.div>

                    {/* Results Section */}
                    <AnimatePresence mode="wait">
                        {notes && videoId && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="grid grid-cols-1 lg:grid-cols-3 gap-6"
                            >
                                {/* Video Preview Section - YouTube Style */}
                                <div className="lg:col-span-2 space-y-4">
                                    {/* Video Embed */}
                                    <div className="relative w-full rounded-xl overflow-hidden bg-black shadow-2xl aspect-video">
                                        <iframe
                                            src={`https://www.youtube.com/embed/${videoId}`}
                                            className="w-full h-full"
                                            allowFullScreen
                                            title="YouTube video player"
                                        />
                                    </div>

                                    {/* Video Title & Download */}
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <h2 className="text-xl font-bold text-white mb-2">
                                                {videoTitle}
                                            </h2>
                                            <div className="flex items-center gap-2 text-gray-400 text-sm">
                                                <span className="flex items-center gap-1">
                                                    <BookOpen className="w-4 h-4" />
                                                    AI-Generated Study Notes
                                                </span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={downloadNotes}
                                            className="px-4 py-2 bg-[#272727] hover:bg-[#3d3d3d] rounded-full text-white font-medium transition-all flex items-center gap-2"
                                        >
                                            <Download className="w-4 h-4" />
                                            Download
                                        </button>
                                    </div>

                                    {/* Summary Section */}
                                    <div className="p-5 bg-[#212121] rounded-xl border border-[#303030]">
                                        <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                                            <FileText className="w-5 h-5 text-red-500" />
                                            Summary
                                        </h3>
                                        <p className="text-gray-300 leading-relaxed">{notes.summary}</p>
                                    </div>

                                    {/* Detailed Study Notes */}
                                    <div className="p-5 bg-[#212121] rounded-xl border border-[#303030]">
                                        <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                                            <BookOpen className="w-5 h-5 text-red-500" />
                                            Detailed Notes
                                        </h3>
                                        <div className="prose prose-invert prose-sm max-w-none text-gray-300 leading-relaxed">
                                            <ReactMarkdown
                                                components={{
                                                    h1: ({ node, ...props }) => <h1 className="text-2xl font-bold text-white mt-6 mb-3" {...props} />,
                                                    h2: ({ node, ...props }) => <h2 className="text-xl font-bold text-white mt-5 mb-2" {...props} />,
                                                    h3: ({ node, ...props }) => <h3 className="text-lg font-semibold text-white mt-4 mb-2" {...props} />,
                                                    p: ({ node, ...props }) => <p className="mb-3 text-gray-300" {...props} />,
                                                    strong: ({ node, ...props }) => <strong className="font-bold text-white" {...props} />,
                                                    ul: ({ node, ...props }) => <ul className="list-disc list-inside mb-3 space-y-1" {...props} />,
                                                    ol: ({ node, ...props }) => <ol className="list-decimal list-inside mb-3 space-y-1" {...props} />,
                                                    li: ({ node, ...props }) => <li className="text-gray-300" {...props} />,
                                                }}
                                            >
                                                {notes.studyNotes}
                                            </ReactMarkdown>
                                        </div>
                                    </div>
                                </div>

                                {/* Sidebar - Key Points & Timestamps */}
                                <div className="space-y-4">
                                    {/* Key Points */}
                                    <div className="p-5 bg-[#212121] rounded-xl border border-[#303030] sticky top-24">
                                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                            <Lightbulb className="w-5 h-5 text-yellow-500" />
                                            Key Takeaways
                                        </h3>
                                        <ul className="space-y-3">
                                            {notes.keyPoints.map((point, i) => (
                                                <motion.li
                                                    key={i}
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: i * 0.1 }}
                                                    className="flex items-start gap-3 p-3 bg-[#181818] rounded-lg hover:bg-[#272727] transition-colors"
                                                >
                                                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center text-sm font-bold">
                                                        {i + 1}
                                                    </span>
                                                    <span className="text-gray-300 text-sm">{point}</span>
                                                </motion.li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Timestamps */}
                                    {notes.timestamps.length > 0 && (
                                        <div className="p-5 bg-[#212121] rounded-xl border border-[#303030]">
                                            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                                <Clock className="w-5 h-5 text-blue-500" />
                                                Timestamps
                                            </h3>
                                            <div className="space-y-2">
                                                {notes.timestamps.map((ts, i) => (
                                                    <motion.div
                                                        key={i}
                                                        initial={{ opacity: 0, x: -10 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: i * 0.05 }}
                                                        className="flex items-start gap-2 p-2.5 bg-[#181818] rounded-lg hover:bg-[#272727] transition-colors cursor-pointer group"
                                                    >
                                                        <Play className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform" />
                                                        <div className="flex-1 min-w-0">
                                                            <div className="font-mono text-xs text-blue-400 mb-0.5">
                                                                {ts.time}
                                                            </div>
                                                            <div className="text-gray-300 text-sm truncate">
                                                                {ts.topic}
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}

                        {!notes && !isLoading && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center py-24"
                            >
                                <div className="w-24 h-24 bg-[#212121] rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Youtube className="w-12 h-12 text-red-600" />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-3">Ready to Learn</h3>
                                <p className="text-gray-400 max-w-md mx-auto">
                                    Paste any educational YouTube URL above to generate comprehensive study notes with AI
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </>
    );
};
