"use client";

import { useState, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { FileText, Upload, Loader2, CheckCircle, Target, Sparkles } from "lucide-react";
import { toast } from "sonner";
import ResultsView from "@/components/ResultsView";

type AppState = "input" | "loading" | "results";

type AnalysisResult = {
    summary?: string;
    skills: { add: string[]; emphasize: string[]; remove: string[] };
    experiences: { sectionTitle: string; before: string[]; after: string[]; rationale?: string }[];
    wordingFixes: { before: string; after: string; reason?: string }[];
};

type Annotation = {
    id: string;
    type: "keep" | "improve" | "remove" | "add";
    text: string;
    explanation: string;
    top: number;
    left: number;
    width: number;
    height: number;
};

export default function AppPage() {
    const [state, setState] = useState<AppState>("input");
    const [file, setFile] = useState<File | null>(null);
    const [jobDescription, setJobDescription] = useState("");
    const [cvText, setCvText] = useState("");
    const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
    const [annotations, setAnnotations] = useState<Annotation[]>([]);
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFile = useCallback(async (selectedFile: File) => {
        if (!selectedFile) return;

        setFile(selectedFile);

        try {
            const formData = new FormData();
            formData.append("file", selectedFile);

            const isPdf = selectedFile.type === "application/pdf" || selectedFile.name.endsWith(".pdf");
            const endpoint = isPdf ? "/api/parse/pdf" : "/api/parse/docx";

            const response = await fetch(endpoint, {
                method: "POST",
                body: formData,
            });

            if (!response.ok) throw new Error(`Erreur ${response.status}`);

            const data = await response.json();
            setCvText(data.text || "");
            toast.success("CV extrait avec succès");
        } catch (error) {
            const message = error instanceof Error ? error.message : "Erreur d'extraction";
            toast.error(message);
            setFile(null);
        }
    }, []);

    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) {
            handleFile(droppedFile);
        }
    }, [handleFile]);

    const loadExampleData = useCallback(async () => {
        try {
            const [cvResponse, jobResponse] = await Promise.all([
                fetch("/samples/cv.txt"),
                fetch("/samples/job.txt")
            ]);

            const cvData = await cvResponse.text();
            const jobData = await jobResponse.text();

            setCvText(cvData);
            setJobDescription(jobData);
            setFile(new File([cvData], "example-cv.txt", { type: "text/plain" }));
            toast.success("Données d'exemple chargées");
        } catch {
            toast.error("Erreur lors du chargement des exemples");
        }
    }, []);

    const generateSampleAnnotations = useCallback(() => {
        const sampleAnnotations: Annotation[] = [
            {
                id: "1",
                type: "keep",
                text: "TypeScript, React, Node.js",
                explanation: "Excellente correspondance avec les technologies requises",
                top: 120,
                left: 50,
                width: 200,
                height: 20,
            },
            {
                id: "2",
                type: "improve",
                text: "tests E2E",
                explanation: "Préciser 'tests end-to-end automatisés' pour plus de clarté",
                top: 180,
                left: 80,
                width: 120,
                height: 20,
            },
            {
                id: "3",
                type: "add",
                text: "UX/Design collaboration",
                explanation: "Compétence mentionnée dans l'offre mais absente du CV",
                top: 240,
                left: 60,
                width: 180,
                height: 20,
            },
        ];
        setAnnotations(sampleAnnotations);
    }, []);

    const analyzeCV = useCallback(async () => {
        if (!cvText.trim() || !jobDescription.trim()) {
            toast.error("Veuillez fournir un CV et une description de poste");
            return;
        }

        setState("loading");

        try {
            const response = await fetch("/api/llm/suggest", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    resumeText: cvText,
                    jobText: jobDescription,
                }),
            });

            if (response.status === 429) {
                toast.error("Limite atteinte (5 analyses par semaine par IP)");
                setState("input");
                return;
            }

            if (!response.ok) throw new Error(`Erreur ${response.status}`);

            const result = await response.json();
            setAnalysisResult(result);

            // Generate sample annotations for demo
            generateSampleAnnotations();

            setState("results");
            toast.success("Analyse terminée");
        } catch (error) {
            const message = error instanceof Error ? error.message : "Erreur lors de l'analyse";
            toast.error(message);
            setState("input");
        }
    }, [cvText, jobDescription, generateSampleAnnotations]);

    const resetApp = useCallback(() => {
        setState("input");
        setFile(null);
        setJobDescription("");
        setCvText("");
        setAnalysisResult(null);
        setAnnotations([]);
    }, []);

    if (state === "loading") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
                <div className="text-center space-y-4">
                    <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto" />
                    <h2 className="text-xl font-semibold">Analyse en cours...</h2>
                    <p className="text-gray-600">Notre IA compare votre CV avec l&apos;offre d&apos;emploi</p>
                </div>
            </div>
        );
    }

    if (state === "results" && analysisResult) {
        return (
            <ResultsView
                analysisResult={analysisResult}
                annotations={annotations}
                onReset={resetApp}
            />
        );
    }

    // Input State
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
            <div className="container mx-auto px-6 py-12">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <h1 className="text-3xl font-bold mb-4">Analysez votre CV</h1>
                        <p className="text-gray-600">
                            Uploadez votre CV et collez la description du poste pour obtenir des suggestions personnalisées
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                        {/* File Upload */}
                        <Card className="p-6">
                            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <FileText className="w-5 h-5" />
                                Votre CV
                            </h2>

                            <div
                                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${dragActive
                                        ? "border-blue-500 bg-blue-50"
                                        : file
                                            ? "border-green-500 bg-green-50"
                                            : "border-gray-300 hover:border-gray-400"
                                    }`}
                                onDragEnter={handleDrag}
                                onDragLeave={handleDrag}
                                onDragOver={handleDrag}
                                onDrop={handleDrop}
                            >
                                {file ? (
                                    <div className="space-y-2">
                                        <CheckCircle className="w-8 h-8 text-green-600 mx-auto" />
                                        <p className="font-medium">{file.name}</p>
                                        <p className="text-sm text-gray-600">
                                            {(file.size / 1024).toFixed(1)} KB
                                        </p>
                                        <Button
                                            onClick={() => fileInputRef.current?.click()}
                                            variant="outline"
                                            size="sm"
                                        >
                                            Changer de fichier
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <Upload className="w-12 h-12 text-gray-400 mx-auto" />
                                        <div>
                                            <p className="font-medium mb-2">
                                                Glissez-déposez votre CV ici
                                            </p>
                                            <p className="text-sm text-gray-600 mb-4">
                                                ou cliquez pour sélectionner un fichier
                                            </p>
                                            <Button
                                                onClick={() => fileInputRef.current?.click()}
                                                variant="outline"
                                            >
                                                Choisir un fichier
                                            </Button>
                                        </div>
                                        <p className="text-xs text-gray-500">
                                            Formats supportés: PDF, DOCX, TXT
                                        </p>
                                    </div>
                                )}
                            </div>

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
                                onChange={(e) => {
                                    const selectedFile = e.target.files?.[0];
                                    if (selectedFile) handleFile(selectedFile);
                                }}
                                className="hidden"
                            />

                            <Button
                                onClick={loadExampleData}
                                variant="ghost"
                                size="sm"
                                className="w-full mt-4"
                            >
                                Utiliser des données d&apos;exemple
                            </Button>
                        </Card>

                        {/* Job Description */}
                        <Card className="p-6">
                            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <Target className="w-5 h-5" />
                                Description du poste
                            </h2>
                            <Textarea
                                placeholder="Collez ici la description du poste ou de l&apos;offre d&apos;emploi..."
                                value={jobDescription}
                                onChange={(e) => setJobDescription(e.target.value)}
                                className="min-h-[200px] resize-none"
                            />
                            <p className="text-xs text-gray-500 mt-2">
                                Plus la description est détaillée, plus les suggestions seront précises
                            </p>
                        </Card>
                    </div>

                    {/* Analyze Button */}
                    <div className="text-center">
                        <Button
                            onClick={analyzeCV}
                            disabled={!file || !jobDescription.trim() || !cvText.trim()}
                            size="lg"
                            className="bg-blue-600 hover:bg-blue-700 px-12 py-6 text-lg"
                        >
                            <Sparkles className="w-5 h-5 mr-2" />
                            Analyser mon CV
                        </Button>

                        {(!file || !jobDescription.trim()) && (
                            <p className="text-sm text-gray-500 mt-2">
                                Veuillez uploader un CV et renseigner la description du poste
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}