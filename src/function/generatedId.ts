type Generated = () => string

export const generatedId: Generated = () => (
    Math.random().toString(16).slice(2) + new Date().getTime().toString(36)
)