export type IdentifiedFood = {
    food_id: string
    analyse_id: string
    food_name: string
    user_input_weight?: number
    created_at: Date
    updated_at: Date
}

export type IdentifiedFoodCreate = {
    food_name: string
    user_input_weight?: number
}

export type IdentifiedFoodUpdate = {
    user_input_weight?: number
}