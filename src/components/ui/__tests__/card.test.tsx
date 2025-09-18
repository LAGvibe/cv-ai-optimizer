import { render, screen } from '@testing-library/react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../card'

describe('Card Components', () => {
    describe('Card', () => {
        it('should render with default props', () => {
            render(<Card>Card content</Card>)

            const card = screen.getByText('Card content')
            expect(card).toBeInTheDocument()
            expect(card).toHaveClass('card-modern', 'flex', 'flex-col')
        })

        it('should apply custom className', () => {
            render(<Card className="custom-card">Custom card</Card>)

            const card = screen.getByText('Custom card')
            expect(card).toHaveClass('custom-card')
        })
    })

    describe('CardHeader', () => {
        it('should render with correct classes', () => {
            render(
                <Card>
                    <CardHeader>Header content</CardHeader>
                </Card>
            )

            const header = screen.getByText('Header content')
            expect(header).toHaveClass('grid', 'items-start', 'gap-1.5', 'px-6')
        })
    })

    describe('CardTitle', () => {
        it('should render with correct classes', () => {
            render(
                <Card>
                    <CardTitle>Card Title</CardTitle>
                </Card>
            )

            const title = screen.getByText('Card Title')
            expect(title).toHaveClass('leading-none', 'font-semibold')
        })
    })

    describe('CardDescription', () => {
        it('should render with correct classes', () => {
            render(
                <Card>
                    <CardDescription>Card description</CardDescription>
                </Card>
            )

            const description = screen.getByText('Card description')
            expect(description).toHaveClass('text-muted-foreground', 'text-sm')
        })
    })

    describe('CardContent', () => {
        it('should render with correct classes', () => {
            render(
                <Card>
                    <CardContent>Card content</CardContent>
                </Card>
            )

            const content = screen.getByText('Card content')
            expect(content).toHaveClass('px-6')
        })
    })

    describe('CardFooter', () => {
        it('should render with correct classes', () => {
            render(
                <Card>
                    <CardFooter>Footer content</CardFooter>
                </Card>
            )

            const footer = screen.getByText('Footer content')
            expect(footer).toHaveClass('flex', 'items-center', 'px-6')
        })
    })

    describe('Complete Card Structure', () => {
        it('should render a complete card with all components', () => {
            render(
                <Card>
                    <CardHeader>
                        <CardTitle>Test Title</CardTitle>
                        <CardDescription>Test description</CardDescription>
                    </CardHeader>
                    <CardContent>Test content</CardContent>
                    <CardFooter>Test footer</CardFooter>
                </Card>
            )

            expect(screen.getByText('Test Title')).toBeInTheDocument()
            expect(screen.getByText('Test description')).toBeInTheDocument()
            expect(screen.getByText('Test content')).toBeInTheDocument()
            expect(screen.getByText('Test footer')).toBeInTheDocument()
        })
    })
})
