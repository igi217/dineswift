import { useAtom } from "jotai"
import { atomWithStorage } from "jotai/utils"

type AuthUser = {
    table: string
    name: string
    username: string
    password: string
    url: string
    modified: number
    _id: string
    _rev: string
}

const userAtom = atomWithStorage<AuthUser | null>("@current_user", null)


export const useAuthUserStore = () => useAtom(userAtom)