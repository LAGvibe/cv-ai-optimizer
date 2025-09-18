import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AppPage from '@/app/app/page'

jest.mock('@/lib/cv-api', () => ({
    extractTextFromFile: jest.fn(),
    analyzeCV: jest.fn()
}), { virtual: true })

jest.mock('sonner', () => ({
    toast: {
        loading: jest.fn(),
        success: jest.fn(),
        error: jest.fn()
    }
}))

const mockExtractTextFromFile = require('@/lib/cv-api').extractTextFromFile
const mockAnalyzeCV = require('@/lib/cv-api').analyzeCV

describe('CV Assist Integration Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('should render the upload page initially', () => {
        render(<AppPage />)

        expect(screen.getByText('CV Assistant')).toBeInTheDocument()
        expect(screen.getByText('Glissez votre CV ici')).toBeInTheDocument()
        expect(screen.getByText('ou cliquez pour sélectionner un fichier')).toBeInTheDocument()
    })

    it('should show progress indicator', () => {
        render(<AppPage />)

        expect(screen.getByText('Étape 1/3')).toBeInTheDocument()
        expect(screen.getByText('Progression')).toBeInTheDocument()
    })

    it('should handle file upload and move to analysis step', async () => {
        const user = userEvent.setup()

        const mockFile = new File(['CV content'], 'test-cv.pdf', { type: 'application/pdf' })
        const mockExtractionResult = {
            success: true,
            text: 'Jean Dupont\nDéveloppeur Full Stack\n\nExpérience:\n- 3 ans chez TechCorp',
            fileName: 'test-cv.pdf',
            fileSize: 1024,
            fileType: 'application/pdf',
            textLength: 50,
            timestamp: new Date().toISOString()
        }

        mockExtractTextFromFile.mockResolvedValue(mockExtractionResult)

        render(<AppPage />)

        const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
        expect(fileInput).toBeInTheDocument()

        await user.upload(fileInput, mockFile)

        await waitFor(() => {
            expect(screen.getByText('Configuration')).toBeInTheDocument()
        })

        expect(screen.getByText('Étape 2/3')).toBeInTheDocument()
        expect(screen.getByText('Ajoutez l\'offre d\'emploi pour l\'analyse')).toBeInTheDocument()
    })

    it('should handle analysis and show results', async () => {
        const user = userEvent.setup()

        const mockFile = new File(['CV content'], 'test-cv.pdf', { type: 'application/pdf' })
        const mockExtractionResult = {
            success: true,
            text: 'Jean Dupont\nDéveloppeur Full Stack\n\nExpérience:\n- 3 ans chez TechCorp',
            fileName: 'test-cv.pdf',
            fileSize: 1024,
            fileType: 'application/pdf',
            textLength: 50,
            timestamp: new Date().toISOString()
        }

        const mockAnalysisResult = {
            success: true,
            analysis: {
                score: 85,
                summary: 'CV bien structuré avec de bonnes compétences techniques',
                strengths: ['Expérience React', 'Compétences TypeScript'],
                weaknesses: ['Manque d\'expérience en tests'],
                suggestions: [
                    {
                        type: 'add',
                        section: 'Compétences',
                        text: 'JavaScript',
                        suggestion: 'Ajouter TypeScript dans les compétences techniques',
                        priority: 'high',
                        rationale: 'TypeScript est demandé dans l\'offre',
                        impact: 'Améliorera la correspondance avec le poste'
                    }
                ],
                missingSkills: ['Jest', 'Cypress'],
                improvementPotential: 25,
                analysisDate: '2024-01-01T00:00:00.000Z',
                jobMatch: {
                    technicalMatch: 80,
                    experienceMatch: 70,
                    softSkillsMatch: 85
                }
            },
            timestamp: new Date().toISOString()
        }

        mockExtractTextFromFile.mockResolvedValue(mockExtractionResult)
        mockAnalyzeCV.mockResolvedValue(mockAnalysisResult)

        render(<AppPage />)

        const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
        expect(fileInput).toBeInTheDocument()
        await user.upload(fileInput, mockFile)

        await waitFor(() => {
            expect(screen.getByText('Configuration')).toBeInTheDocument()
        })

        const jobDescriptionTextarea = screen.getByPlaceholderText(/collez ici la description/i)
        await user.type(jobDescriptionTextarea, 'Recherche développeur React avec 2+ ans d\'expérience')

        const analyzeButton = screen.getByRole('button', { name: /lancer l'analyse/i })
        await user.click(analyzeButton)

        await waitFor(() => {
            expect(screen.getByRole('heading', { name: 'Analyse terminée' })).toBeInTheDocument()
        })

        expect(screen.getByText('Étape 3/3')).toBeInTheDocument()
        expect(screen.getByText('Résumé de l\'analyse')).toBeInTheDocument()
        expect(screen.getByText('Points forts')).toBeInTheDocument()
        expect(screen.getByText('Points à améliorer')).toBeInTheDocument()
        expect(screen.getByText('Suggestions détaillées')).toBeInTheDocument()
    })

    it('should handle errors gracefully', async () => {
        const user = userEvent.setup()

        mockExtractTextFromFile.mockRejectedValue(new Error('File extraction failed'))

        render(<AppPage />)

        const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
        expect(fileInput).toBeInTheDocument()
        const mockFile = new File(['CV content'], 'test-cv.pdf', { type: 'application/pdf' })

        await user.upload(fileInput, mockFile)

        await waitFor(() => {
            expect(screen.getByText('CV Assistant')).toBeInTheDocument()
        })
    })

    it('should validate job description before analysis', async () => {
        const user = userEvent.setup()

        const mockFile = new File(['CV content'], 'test-cv.pdf', { type: 'application/pdf' })
        const mockExtractionResult = {
            success: true,
            text: 'Jean Dupont\nDéveloppeur Full Stack',
            fileName: 'test-cv.pdf',
            fileSize: 1024,
            fileType: 'application/pdf',
            textLength: 50,
            timestamp: new Date().toISOString()
        }

        mockExtractTextFromFile.mockResolvedValue(mockExtractionResult)

        render(<AppPage />)

        const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
        expect(fileInput).toBeInTheDocument()
        await user.upload(fileInput, mockFile)

        await waitFor(() => {
            expect(screen.getByText('Configuration')).toBeInTheDocument()
        })

        const analyzeButton = screen.getByRole('button', { name: /lancer l'analyse/i })
        await user.click(analyzeButton)

        expect(analyzeButton).toBeDisabled()
    })
})
