import { QueryParams } from '@/services/api/types';
import { User, UserProfile } from '@/models/User';

export interface UpdateUserProfileRequest {
  username?: string;
  fullName?: string;
  bio?: string;
  avatar?: File;
}

export interface UserQueryParams extends QueryParams {
  role?: string;
  keyword?: string;
}
