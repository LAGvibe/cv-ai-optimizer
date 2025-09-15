"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, CheckCircle, AlertCircle, XCircle, Plus } from "lucide-react";

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

interface ResultsViewProps {
    analysisResult: AnalysisResult;
    annotations: Annotation[];
    onReset: () => void;
}

export default function ResultsView({ analysisResult, annotations, onReset }: ResultsViewProps) {
    const getAnnotationColor = (type: Annotation["type"]) => {
        switch (type) {
            case "keep": return "bg-green-400/60 border-green-500";
            case "improve": return "bg-yellow-400/60 border-yellow-500";
            case "remove": return "bg-red-400/60 border-red-500";
            case "add": return "bg-blue-400/60 border-blue-500";
        }
    };

    const getAnnotationIcon = (type: Annotation["type"]) => {
        switch (type) {
            case "keep": return <CheckCircle className="w-4 h-4 text-green-600" />;
            case "improve": return <AlertCircle className="w-4 h-4 text-yellow-600" />;
            case "remove": return <XCircle className="w-4 h-4 text-red-600" />;
            case "add": return <Plus className="w-4 h-4 text-blue-600" />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-6 py-8">
                <div className="flex items-center justify-between mb-6">
                    <Button onClick={onReset} variant="outline" className="flex items-center gap-2">
                        <ArrowLeft className="w-4 h-4" />
                        Nouvelle analyse
                    </Button>
                    <h1 className="text-2xl font-bold">Résultats d&apos;analyse</h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* PDF Viewer with Annotations */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold">CV avec annotations</h2>
                        <Card className="p-4">
                            <div className="relative">
                                <div className="bg-white border rounded-lg p-6 min-h-[600px] relative overflow-hidden">
                                    {/* Simulated PDF content */}
                                    <div className="text-sm leading-relaxed">
                                        <div className="font-bold text-lg mb-4">Louis Dupont — Ingénieur Full-Stack</div>
                                        <div className="mb-4">Email: louis@example.com | Paris</div>

                                        <div className="mb-6">
                                            <div className="font-semibold mb-2">Résumé</div>
                                            <div>Ingénieur full-stack TypeScript/Node/React. Focus performance, DX, tests E2E.</div>
                                        </div>

                                        <div className="mb-6">
                                            <div className="font-semibold mb-2">Compétences</div>
                                            <div>TypeScript, Node.js, React, Next.js, PostgreSQL, Redis, CI/CD, Docker, Playwright.</div>
                                        </div>

                                        <div className="mb-6">
                                            <div className="font-semibold mb-2">Expériences</div>
                                            <div className="mb-4">
                                                <div className="font-medium">Acme — Senior Full-Stack (2022–)</div>
                                                <div>- Conception d&apos;une plateforme Next.js (SSR) avec 1M+ pages/jour.</div>
                                                <div>- Réduction TTFB de 35% via edge caching et optimisations DB.</div>
                                                <div>- Mise en place tests E2E (Playwright) et coverage 85%.</div>
                                            </div>
                                        </div>

                                        <div>
                                            <div className="font-semibold mb-2">Formation</div>
                                            <div>MSc Informatique, 2019.</div>
                                        </div>
                                    </div>

                                    {/* Annotations Overlay */}
                                    {annotations.map((annotation) => (
                                        <div
                                            key={annotation.id}
                                            className={`absolute ${getAnnotationColor(annotation.type)} border-2 rounded cursor-pointer group`}
                                            style={{
                                                top: annotation.top,
                                                left: annotation.left,
                                                width: annotation.width,
                                                height: annotation.height,
                                            }}
                                        >
                                            {/* Tooltip */}
                                            <div className="absolute bottom-full left-0 mb-2 w-64 bg-black text-white text-xs rounded p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                                                <div className="flex items-center gap-2 mb-1">
                                                    {getAnnotationIcon(annotation.type)}
                                                    <span className="font-medium">{annotation.text}</span>
                                                </div>
                                                <div>{annotation.explanation}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </Card>

                        {/* Legend */}
                        <Card className="p-4">
                            <h3 className="font-semibold mb-3">Légende des annotations</h3>
                            <div className="grid grid-cols-2 gap-3 text-sm">
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 bg-green-400 border border-green-500 rounded"></div>
                                    <span>À conserver</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 bg-yellow-400 border border-yellow-500 rounded"></div>
                                    <span>À améliorer</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 bg-red-400 border border-red-500 rounded"></div>
                                    <span>À supprimer</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 bg-blue-400 border border-blue-500 rounded"></div>
                                    <span>À ajouter</span>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Suggestions Panel */}
                    <div className="space-y-6">
                        <h2 className="text-lg font-semibold">Suggestions détaillées</h2>

                        {analysisResult.summary && (
                            <Card className="p-4">
                                <h3 className="font-semibold mb-2">Résumé</h3>
                                <p className="text-sm text-gray-600">{analysisResult.summary}</p>
                            </Card>
                        )}

                        <Card className="p-4">
                            <h3 className="font-semibold mb-3">Compétences</h3>
                            <div className="space-y-4">
                                {analysisResult.skills.add.length > 0 && (
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <Plus className="w-4 h-4 text-blue-600" />
                                            <span className="font-medium text-sm">À ajouter</span>
                                        </div>
                                        <ul className="text-sm text-gray-600 ml-6 space-y-1">
                                            {analysisResult.skills.add.map((skill, i) => (
                                                <li key={i}>• {skill}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {analysisResult.skills.emphasize.length > 0 && (
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <CheckCircle className="w-4 h-4 text-green-600" />
                                            <span className="font-medium text-sm">À mettre en avant</span>
                                        </div>
                                        <ul className="text-sm text-gray-600 ml-6 space-y-1">
                                            {analysisResult.skills.emphasize.map((skill, i) => (
                                                <li key={i}>• {skill}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {analysisResult.skills.remove.length > 0 && (
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <XCircle className="w-4 h-4 text-red-600" />
                                            <span className="font-medium text-sm">À retirer</span>
                                        </div>
                                        <ul className="text-sm text-gray-600 ml-6 space-y-1">
                                            {analysisResult.skills.remove.map((skill, i) => (
                                                <li key={i}>• {skill}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </Card>

                        {analysisResult.experiences.map((exp, i) => (
                            <Card key={i} className="p-4">
                                <h3 className="font-semibold mb-3">{exp.sectionTitle}</h3>
                                <div className="space-y-3">
                                    <div>
                                        <div className="text-sm font-medium text-gray-700 mb-1">Avant</div>
                                        <ul className="text-sm text-gray-600 space-y-1">
                                            {exp.before.map((item, j) => (
                                                <li key={j}>• {item}</li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium text-gray-700 mb-1">Suggestion</div>
                                        <ul className="text-sm text-gray-600 space-y-1">
                                            {exp.after.map((item, j) => (
                                                <li key={j}>• {item}</li>
                                            ))}
                                        </ul>
                                    </div>
                                    {exp.rationale && (
                                        <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                                            {exp.rationale}
                                        </div>
                                    )}
                                </div>
                            </Card>
                        ))}

                        {analysisResult.wordingFixes.length > 0 && (
                            <Card className="p-4">
                                <h3 className="font-semibold mb-3">Améliorations de formulation</h3>
                                <div className="space-y-3">
                                    {analysisResult.wordingFixes.map((fix, i) => (
                                        <div key={i} className="border-l-4 border-blue-200 pl-3">
                                            <div className="text-sm">
                                                <div className="font-medium text-gray-700">Avant:</div>
                                                <div className="text-gray-600 mb-2">{fix.before}</div>
                                                <div className="font-medium text-gray-700">Après:</div>
                                                <div className="text-gray-600">{fix.after}</div>
                                                {fix.reason && (
                                                    <div className="text-xs text-gray-500 mt-2">{fix.reason}</div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
