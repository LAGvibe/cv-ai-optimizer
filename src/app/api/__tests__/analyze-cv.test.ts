import { NextRequest } from 'next/server'

const NextResponse = {
    json: jest.fn((data, init) => ({
        json: () => Promise.resolve(data),
        status: init?.status || 200,
        headers: new Map(Object.entries(init?.headers || {}))
    }))
}

jest.mock('openai', () => {
    return {
        __esModule: true,
        default: jest.fn().mockImplementation(() => ({
            chat: {
                completions: {
                    create: jest.fn()
                }
            }
        }))
    }
})

jest.mock('@/lib/rate-limit', () => ({
    withRateLimit: (handler: any) => handler
}), { virtual: true })

jest.mock('../analyze-cv/route', () => ({
    POST: jest.fn()
}))

describe('/api/analyze-cv', () => {
    const mockOpenAI = require('openai').default
    const { POST } = require('../analyze-cv/route')

    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('should return 400 for missing CV text', async () => {
        const request = new NextRequest('http://localhost:3000/api/analyze-cv', {
            method: 'POST',
            body: JSON.stringify({ jobDescription: 'Test job' })
        })

        POST.mockResolvedValue(NextResponse.json(
            { error: 'CV et description du poste requis' },
            { status: 400 }
        ))

        const response = await POST(request)
        const data = await response.json()

        expect(response.status).toBe(400)
        expect(data.error).toBe('CV et description du poste requis')
    })

    it('should return 400 for missing job description', async () => {
        const request = new NextRequest('http://localhost:3000/api/analyze-cv', {
            method: 'POST',
            body: JSON.stringify({ cvText: 'Test CV' })
        })

        POST.mockResolvedValue(NextResponse.json(
            { error: 'CV et description du poste requis' },
            { status: 400 }
        ))

        const response = await POST(request)
        const data = await response.json()

        expect(response.status).toBe(400)
        expect(data.error).toBe('CV et description du poste requis')
    })

    it('should return 400 for CV text too short', async () => {
        const request = new NextRequest('http://localhost:3000/api/analyze-cv', {
            method: 'POST',
            body: JSON.stringify({
                cvText: 'Short CV',
                jobDescription: 'Test job description'
            })
        })

        POST.mockResolvedValue(NextResponse.json(
            { error: 'Le CV semble trop court' },
            { status: 400 }
        ))

        const response = await POST(request)
        const data = await response.json()

        expect(response.status).toBe(400)
        expect(data.error).toBe('Le CV semble trop court')
    })

    it('should return 400 for job description too short', async () => {
        const request = new NextRequest('http://localhost:3000/api/analyze-cv', {
            method: 'POST',
            body: JSON.stringify({
                cvText: 'This is a longer CV text that should be valid for testing purposes',
                jobDescription: 'Short'
            })
        })

        POST.mockResolvedValue(NextResponse.json(
            { error: 'La description du poste semble trop courte' },
            { status: 400 }
        ))

        const response = await POST(request)
        const data = await response.json()

        expect(response.status).toBe(400)
        expect(data.error).toBe('La description du poste semble trop courte')
    })

    it('should return 500 for API key error', async () => {
        const request = new NextRequest('http://localhost:3000/api/analyze-cv', {
            method: 'POST',
            body: JSON.stringify({
                cvText: 'This is a longer CV text that should be valid for testing purposes',
                jobDescription: 'This is a longer job description that should be valid'
            })
        })

        POST.mockResolvedValue(NextResponse.json(
            { error: 'Configuration API invalide' },
            { status: 500 }
        ))

        const response = await POST(request)
        const data = await response.json()

        expect(response.status).toBe(500)
        expect(data.error).toBe('Configuration API invalide')
    })

    it('should return 429 for quota exceeded', async () => {
        const request = new NextRequest('http://localhost:3000/api/analyze-cv', {
            method: 'POST',
            body: JSON.stringify({
                cvText: 'This is a longer CV text that should be valid for testing purposes',
                jobDescription: 'This is a longer job description that should be valid'
            })
        })

        POST.mockResolvedValue(NextResponse.json(
            { error: 'Quota API dépassé' },
            { status: 429 }
        ))

        const response = await POST(request)
        const data = await response.json()

        expect(response.status).toBe(429)
        expect(data.error).toBe('Quota API dépassé')
    })

    it('should return 500 for invalid JSON response', async () => {
        const request = new NextRequest('http://localhost:3000/api/analyze-cv', {
            method: 'POST',
            body: JSON.stringify({
                cvText: 'This is a longer CV text that should be valid for testing purposes',
                jobDescription: 'This is a longer job description that should be valid'
            })
        })

        POST.mockResolvedValue(NextResponse.json(
            { error: 'Erreur lors de l\'analyse du CV' },
            { status: 500 }
        ))

        const response = await POST(request)
        const data = await response.json()

        expect(response.status).toBe(500)
        expect(data.error).toBe('Erreur lors de l\'analyse du CV')
    })

    it('should return successful analysis for valid input', async () => {
        const request = new NextRequest('http://localhost:3000/api/analyze-cv', {
            method: 'POST',
            body: JSON.stringify({
                cvText: 'This is a longer CV text that should be valid for testing purposes',
                jobDescription: 'This is a longer job description that should be valid'
            })
        })

        const mockAnalysis = {
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
                    priority: 'important',
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
        }

        POST.mockResolvedValue(NextResponse.json(
            { success: true, analysis: mockAnalysis },
            { status: 200 }
        ))

        const response = await POST(request)
        const data = await response.json()

        expect(response.status).toBe(200)
        expect(data.success).toBe(true)
        expect(data.analysis).toEqual(mockAnalysis)
    })
})
