export type Analyse = {
    analyse_id: string
    user_id: string
    image_url: string
    created_at: Date
    updated_at: Date
}

export type AnalyseCreate = {
    image_url: string
    email: string
}

export type AnalyseUpdate = {
    image_url?: string
}