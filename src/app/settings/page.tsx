import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FileText, ArrowLeft, Github, Mail, Info } from "lucide-react";

export default function SettingsPage(): React.JSX.Element {
    return (
        <div className="min-h-screen" style={{ background: "linear-gradient(135deg, #fafafa 0%, #ddca7d 100%)", color: "var(--earth-text)" }}>
            {/* Modern Header */}
            <header className="glass-effect sticky top-0 z-50 border-b" style={{ borderColor: "var(--earth-border)" }}>
                <div className="container mx-auto px-6 py-5 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-4 group">
                        <div className="w-11 h-11 rounded-2xl flex items-center justify-center group-hover:scale-105 transition-all duration-300 shadow-lg" style={{ background: "var(--earth-gold-gradient)" }}>
                            <FileText className="w-6 h-6" style={{ color: "var(--earth-primary)" }} />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-bold text-xl heading-gradient" style={{ fontFamily: "var(--font-heading)" }}>
                                CV Assist
                            </span>
                            <span className="text-xs" style={{ color: "var(--earth-text-muted)", fontFamily: "var(--font-body)" }}>
                                Assistant CV
                            </span>
                        </div>
                    </Link>
                    <Button asChild variant="outline" className="hover:opacity-80 transition-all duration-300 focus-ring rounded-xl" style={{ borderColor: "var(--earth-gold)", color: "var(--earth-primary)" }}>
                        <Link href="/app">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Retour à l'app
                        </Link>
                    </Button>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-6 py-12">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12 animate-fade-in-up">
                        <h1 className="text-4xl font-bold mb-6 heading-gradient" style={{ fontFamily: "var(--font-heading)" }}>Paramètres</h1>
                        <p className="text-xl" style={{ color: "var(--earth-text-secondary)" }}>
                            Informations sur l'application
                        </p>
                    </div>

                    <div className="space-y-8">
                        {/* App Info */}
                        <div className="card-modern p-8">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "var(--earth-gold-gradient)" }}>
                                    <Info className="w-6 h-6" style={{ color: "var(--earth-primary)" }} />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold" style={{ color: "var(--earth-primary)", fontFamily: "var(--font-heading)" }}>CV Assist</h2>
                                    <p style={{ color: "var(--earth-text-muted)" }}>Version 0.1.0 - MVP</p>
                                </div>
                            </div>
                            <p className="leading-relaxed" style={{ color: "var(--earth-text)" }}>
                                Interface moderne pour l'analyse de CV. Développée avec Next.js 15, TypeScript et Tailwind CSS
                                pour offrir une expérience utilisateur fluide et professionnelle.
                            </p>
                        </div>

                        {/* Tech Stack */}
                        <div className="card-modern p-8">
                            <h3 className="text-xl font-bold mb-6" style={{ color: "var(--earth-primary)", fontFamily: "var(--font-heading)" }}>Stack technique</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h4 className="font-medium mb-3" style={{ color: "var(--earth-primary)" }}>Frontend</h4>
                                    <ul className="space-y-2" style={{ color: "var(--earth-text-muted)" }}>
                                        <li>• Next.js 15 (App Router)</li>
                                        <li>• TypeScript</li>
                                        <li>• Tailwind CSS</li>
                                        <li>• shadcn/ui Components</li>
                                        <li>• Lucide Icons</li>
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="font-medium mb-3" style={{ color: "var(--earth-primary)" }}>Outils</h4>
                                    <ul className="space-y-2" style={{ color: "var(--earth-text-muted)" }}>
                                        <li>• ESLint</li>
                                        <li>• Sonner (Notifications)</li>
                                        <li>• Inter + Outfit</li>
                                        <li>• Tailwind Merge</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Features Status */}
                        <div className="card-modern p-8">
                            <h3 className="text-xl font-bold mb-6" style={{ color: "var(--earth-primary)", fontFamily: "var(--font-heading)" }}>État des fonctionnalités</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 rounded-lg" style={{ backgroundColor: "var(--earth-light)" }}>
                                    <span className="font-medium" style={{ color: "var(--earth-primary)" }}>Interface utilisateur</span>
                                    <span className="font-medium" style={{ color: "var(--earth-secondary)" }}>✓ Terminé</span>
                                </div>
                                <div className="flex items-center justify-between p-4 rounded-lg" style={{ backgroundColor: "var(--earth-light)" }}>
                                    <span className="font-medium" style={{ color: "var(--earth-primary)" }}>Navigation et routing</span>
                                    <span className="font-medium" style={{ color: "var(--earth-secondary)" }}>✓ Terminé</span>
                                </div>
                                <div className="flex items-center justify-between p-4 rounded-lg" style={{ backgroundColor: "#fff8e1" }}>
                                    <span className="font-medium" style={{ color: "var(--earth-primary)" }}>Upload de fichiers</span>
                                    <span className="font-medium" style={{ color: "var(--earth-accent)" }}>⏳ En développement</span>
                                </div>
                                <div className="flex items-center justify-between p-4 rounded-lg" style={{ backgroundColor: "#fff8e1" }}>
                                    <span className="font-medium" style={{ color: "var(--earth-primary)" }}>Analyse IA</span>
                                    <span className="font-medium" style={{ color: "var(--earth-accent)" }}>⏳ En développement</span>
                                </div>
                                <div className="flex items-center justify-between p-4 rounded-lg" style={{ backgroundColor: "#f5f5f5" }}>
                                    <span className="font-medium" style={{ color: "var(--earth-primary)" }}>Annotations visuelles</span>
                                    <span className="font-medium" style={{ color: "var(--earth-text-muted)" }}>📋 Planifié</span>
                                </div>
                            </div>
                        </div>

                        {/* Contact & Links */}
                        <div className="card-modern p-8">
                            <h3 className="text-xl font-bold mb-6" style={{ color: "var(--earth-primary)", fontFamily: "var(--font-heading)" }}>Contact et liens</h3>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Button variant="outline" asChild style={{ borderColor: "var(--earth-gold)", color: "var(--earth-primary)" }}>
                                    <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                                        <Github className="w-4 h-4 mr-2" />
                                        Code source
                                    </a>
                                </Button>
                                <Button variant="outline" asChild style={{ borderColor: "var(--earth-gold)", color: "var(--earth-primary)" }}>
                                    <a href="mailto:contact@example.com">
                                        <Mail className="w-4 h-4 mr-2" />
                                        Contact
                                    </a>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
