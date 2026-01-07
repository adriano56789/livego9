// Modelo para FanClubMembersScreen
type MemberRole = 'owner' | 'admin' | 'moderator' | 'member' | 'vip';

interface FanClubMember {
  id: string;
  userId: string;
  username: string;
  avatar: string | null;
  joinDate: string;
  lastActive: string;
  role: MemberRole;
  isOnline: boolean;
  isFollowing: boolean;
  isBlocked: boolean;
  stats: {
    posts: number;
    likes: number;
    comments: number;
    shares: number;
  };
}

export interface FanClubMembersScreenModel {
  clubId: string;
  clubName: string;
  members: FanClubMember[];
  filteredMembers: FanClubMember[];
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
  selectedRole: MemberRole | 'all';
  isRefreshing: boolean;
  currentUserRole: MemberRole | null;
  showRoleSelector: boolean;
  selectedMember: string | null;
  showActionSheet: boolean;
  isProcessing: boolean;
}

export const initialFanClubMembersScreenState: FanClubMembersScreenModel = {
  clubId: '',
  clubName: '',
  members: [],
  filteredMembers: [],
  isLoading: false,
  error: null,
  searchQuery: '',
  selectedRole: 'all',
  isRefreshing: false,
  currentUserRole: null,
  showRoleSelector: false,
  selectedMember: null,
  showActionSheet: false,
  isProcessing: false,
};

export type FanClubMembersScreenAction =
  | { type: 'LOAD_MEMBERS_REQUEST' }
  | { type: 'LOAD_MEMBERS_SUCCESS'; payload: { members: FanClubMember[]; clubName: string; currentUserRole: MemberRole } }
  | { type: 'LOAD_MEMBERS_ERROR'; payload: string }
  | { type: 'REFRESH_MEMBERS' }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'SET_SELECTED_ROLE'; payload: MemberRole | 'all' }
  | { type: 'FILTER_MEMBERS' }
  | { type: 'SELECT_MEMBER'; payload: string }
  | { type: 'SHOW_ACTION_SHEET'; payload: boolean }
  | { type: 'SHOW_ROLE_SELECTOR'; payload: boolean }
  | { type: 'UPDATE_MEMBER_ROLE_REQUEST'; payload: { memberId: string; newRole: MemberRole } }
  | { type: 'UPDATE_MEMBER_ROLE_SUCCESS'; payload: { memberId: string; newRole: MemberRole } }
  | { type: 'UPDATE_MEMBER_ROLE_ERROR'; payload: string }
  | { type: 'REMOVE_MEMBER_REQUEST'; payload: string }
  | { type: 'REMOVE_MEMBER_SUCCESS'; payload: string }
  | { type: 'REMOVE_MEMBER_ERROR'; payload: string }
  | { type: 'BLOCK_MEMBER_REQUEST'; payload: string }
  | { type: 'BLOCK_MEMBER_SUCCESS'; payload: string }
  | { type: 'BLOCK_MEMBER_ERROR'; payload: string };

// Função auxiliar para filtrar membros
export function filterMembers(
  members: FanClubMember[], 
  searchQuery: string, 
  selectedRole: MemberRole | 'all'
): FanClubMember[] {
  return members.filter(member => {
    const matchesSearch = member.username.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = selectedRole === 'all' || member.role === selectedRole;
    return matchesSearch && matchesRole;
  });
}
