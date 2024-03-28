export interface LoginResponse {
    id: number
    name: string
    user_id: number
    license_key: string
    license_token: string
    start_date: string
    end_date: string
    created_at: string
    updated_at: string
    user: User
}

export interface User {
    id: number
    email: string
    phone: string
    password: string
    first_name: string
    last_name: string
    company_name: string
    db_key: string
    created_at: string
    updated_at: string
    deleted: number
    name: string
}
