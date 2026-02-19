type Generated = () => string

export const generatedId: Generated = () => (
    Math.random().toString(16).slice(2) + Math.random().toString(16).slice(2)
)