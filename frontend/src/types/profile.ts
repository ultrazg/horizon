import { AuthorshipType } from '@/types/authorship'
import { baseUserType } from '@/types/user'

type UserProfileType = {
  authorship: AuthorshipType[]
} & baseUserType

export type { UserProfileType }
