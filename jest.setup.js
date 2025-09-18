import '@testing-library/jest-dom'

jest.mock('next/navigation', () => ({
    useRouter() {
        return {
            push: jest.fn(),
            replace: jest.fn(),
            prefetch: jest.fn(),
            back: jest.fn(),
            forward: jest.fn(),
            refresh: jest.fn(),
        }
    },
    useSearchParams() {
        return new URLSearchParams()
    },
    usePathname() {
        return '/'
    },
}))

jest.mock('next/link', () => {
    return ({ children, href, ...props }) => {
        return (
            <a href={href} {...props}>
                {children}
            </a>
        )
    }
})

process.env.OPENAI_API_KEY = 'test-api-key'
process.env.NODE_ENV = 'test'

global.fetch = jest.fn()

global.NextResponse = {
    json: jest.fn((data, init) => ({
        json: () => Promise.resolve(data),
        status: init?.status || 200,
        headers: new Map(Object.entries(init?.headers || {}))
    }))
}

jest.mock('@/app/api/parse/pdf/route', () => ({
    POST: jest.fn()
}))

jest.mock('@/app/api/analyze-cv/route', () => ({
    POST: jest.fn()
}))

global.console = {
    ...console,
    log: jest.fn(),
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
}

global.Request = global.Request || class Request {
    constructor(input, init) {
        Object.defineProperty(this, 'url', {
            value: input,
            writable: false,
            enumerable: true,
            configurable: false
        })
        this.method = init?.method || 'GET'
        this.headers = new Map(Object.entries(init?.headers || {}))
    }

    async json() {
        return {}
    }
}

global.Response = global.Response || class Response {
    constructor(body, init) {
        this.body = body
        this.status = init?.status || 200
        this.headers = new Map(Object.entries(init?.headers || {}))
    }

    async json() {
        return JSON.parse(this.body)
    }
}
