import { CVAnalysisSchema, CVSuggestionSchema, DetailedMetricsSchema } from '../cv-analysis'

describe('CV Analysis Types', () => {
  describe('CVSuggestionSchema', () => {
    it('should validate a correct suggestion', () => {
      const validSuggestion = {
        type: 'add',
        section: 'Compétences',
        text: 'JavaScript',
        suggestion: 'Ajouter TypeScript dans les compétences techniques',
        priority: 'important',
        rationale: 'TypeScript est demandé dans l\'offre',
        impact: 'Améliorera la correspondance avec le poste'
      }

      expect(() => CVSuggestionSchema.parse(validSuggestion)).not.toThrow()
    })

    it('should reject invalid suggestion type', () => {
      const invalidSuggestion = {
        type: 'invalid',
        section: 'Compétences',
        text: 'JavaScript',
        suggestion: 'Test suggestion',
        priority: 'important'
      }

      expect(() => CVSuggestionSchema.parse(invalidSuggestion)).toThrow()
    })

    it('should reject empty section', () => {
      const invalidSuggestion = {
        type: 'add',
        section: '',
        text: 'JavaScript',
        suggestion: 'Test suggestion',
        priority: 'important'
      }

      expect(() => CVSuggestionSchema.parse(invalidSuggestion)).toThrow()
    })

    it('should reject short suggestion', () => {
      const invalidSuggestion = {
        type: 'add',
        section: 'Compétences',
        text: 'JavaScript',
        suggestion: 'Short',
        priority: 'important'
      }

      expect(() => CVSuggestionSchema.parse(invalidSuggestion)).toThrow()
    })

    it('should validate suggestion with exactReplacement', () => {
      const validSuggestion = {
        type: 'correct',
        section: 'Expérience',
        text: 'gestion d\'équipe',
        suggestion: 'Remplacer par une formulation plus précise',
        priority: 'critique',
        exactReplacement: 'leadership d\'équipe de 5 développeurs'
      }

      expect(() => CVSuggestionSchema.parse(validSuggestion)).not.toThrow()
    })

    it('should validate all priority levels', () => {
      const priorities = ['critique', 'important', 'recommandé', 'optionnel']

      priorities.forEach(priority => {
        const suggestion = {
          type: 'improve',
          section: 'Test',
          text: 'Test text',
          suggestion: 'Test suggestion with enough characters',
          priority
        }
        expect(() => CVSuggestionSchema.parse(suggestion)).not.toThrow()
      })
    })
  })

  describe('DetailedMetricsSchema', () => {
    it('should validate correct detailed metrics', () => {
      const validMetrics = {
        experience: {
          score: 8,
          maxScore: 10,
          comment: 'Bonne expérience dans le domaine'
        },
        education: {
          score: 7,
          maxScore: 10,
          comment: 'Formation adaptée au poste'
        },
        softSkills: {
          score: 9,
          maxScore: 10,
          comment: 'Excellent niveau de soft skills'
        },
        technicalSkills: {
          score: 6,
          maxScore: 10,
          comment: 'Compétences techniques à améliorer'
        }
      }

      expect(() => DetailedMetricsSchema.parse(validMetrics)).not.toThrow()
    })

    it('should reject invalid scores', () => {
      const invalidMetrics = {
        experience: {
          score: 15,
          maxScore: 10,
          comment: 'Test comment'
        },
        education: {
          score: 7,
          maxScore: 10,
          comment: 'Test comment'
        },
        softSkills: {
          score: 9,
          maxScore: 10,
          comment: 'Test comment'
        },
        technicalSkills: {
          score: 6,
          maxScore: 10,
          comment: 'Test comment'
        }
      }

      expect(() => DetailedMetricsSchema.parse(invalidMetrics)).toThrow()
    })
  })

  describe('CVAnalysisSchema', () => {
    it('should validate a complete analysis', () => {
      const validAnalysis = {
        score: 85,
        summary: 'CV bien structuré avec de bonnes compétences techniques',
        strengths: ['Expérience React', 'Compétences TypeScript'],
        weaknesses: ['Manque d\'expérience en tests'],
        suggestions: [
          {
            type: 'add',
            section: 'Compétences',
            text: 'JavaScript',
            suggestion: 'Ajouter TypeScript dans les compétences',
            priority: 'important'
          }
        ],
        missingSkills: ['Jest', 'Cypress'],
        improvementPotential: 25,
        analysisDate: '2024-01-01T00:00:00.000Z',
        jobMatch: {
          technicalMatch: 80,
          experienceMatch: 70,
          softSkillsMatch: 85
        },
        detailedMetrics: {
          experience: {
            score: 8,
            maxScore: 10,
            comment: 'Bonne expérience dans le domaine'
          },
          education: {
            score: 7,
            maxScore: 10,
            comment: 'Formation adaptée au poste'
          },
          softSkills: {
            score: 9,
            maxScore: 10,
            comment: 'Excellent niveau de soft skills'
          },
          technicalSkills: {
            score: 6,
            maxScore: 10,
            comment: 'Compétences techniques à améliorer'
          }
        }
      }

      expect(() => CVAnalysisSchema.parse(validAnalysis)).not.toThrow()
    })

    it('should reject invalid score', () => {
      const invalidAnalysis = {
        score: 150,
        summary: 'Test summary',
        strengths: ['Strength 1'],
        weaknesses: ['Weakness 1'],
        suggestions: [
          {
            type: 'add',
            section: 'Test',
            text: 'Test text',
            suggestion: 'Test suggestion with enough characters',
            priority: 'important'
          }
        ],
        missingSkills: [],
        improvementPotential: 25
      }

      expect(() => CVAnalysisSchema.parse(invalidAnalysis)).toThrow()
    })

    it('should reject empty strengths array', () => {
      const invalidAnalysis = {
        score: 85,
        summary: 'Test summary',
        strengths: [],
        weaknesses: ['Weakness 1'],
        suggestions: [
          {
            type: 'add',
            section: 'Test',
            text: 'Test text',
            suggestion: 'Test suggestion with enough characters',
            priority: 'important'
          }
        ],
        missingSkills: [],
        improvementPotential: 25
      }

      expect(() => CVAnalysisSchema.parse(invalidAnalysis)).toThrow()
    })

    it('should reject short summary', () => {
      const invalidAnalysis = {
        score: 85,
        summary: 'Short',
        strengths: ['Strength 1'],
        weaknesses: ['Weakness 1'],
        suggestions: [
          {
            type: 'add',
            section: 'Test',
            text: 'Test text',
            suggestion: 'Test suggestion with enough characters',
            priority: 'important'
          }
        ],
        missingSkills: [],
        improvementPotential: 25
      }

      expect(() => CVAnalysisSchema.parse(invalidAnalysis)).toThrow()
    })
  })
})

