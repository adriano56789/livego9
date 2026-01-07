// Modelo para CreatePostScreen
type PostVisibility = 'public' | 'followers' | 'private';
type PostMediaType = 'image' | 'video' | 'poll' | 'text';

interface PollOption {
  id: string;
  text: string;
  votes: number;
}

interface PostMedia {
  type: PostMediaType;
  uri: string;
  thumbnail?: string;
  duration?: number;
  width?: number;
  height?: number;
}

export interface CreatePostScreenModel {
  content: string;
  media: PostMedia[];
  pollOptions: PollOption[];
  pollDuration: number; // in hours
  isPoll: boolean;
  isScheduled: boolean;
  scheduledDate: string | null;
  visibility: PostVisibility;
  allowComments: boolean;
  allowSharing: boolean;
  isPosting: boolean;
  error: string | null;
  mentions: string[];
  hashtags: string[];
  location: {
    name: string;
    latitude: number | null;
    longitude: number | null;
  } | null;
}

export const initialCreatePostScreenState: CreatePostScreenModel = {
  content: '',
  media: [],
  pollOptions: [
    { id: '1', text: '', votes: 0 },
    { id: '2', text: '', votes: 0 },
  ],
  pollDuration: 24,
  isPoll: false,
  isScheduled: false,
  scheduledDate: null,
  visibility: 'public',
  allowComments: true,
  allowSharing: true,
  isPosting: false,
  error: null,
  mentions: [],
  hashtags: [],
  location: null,
};

export type CreatePostScreenAction =
  | { type: 'UPDATE_CONTENT'; payload: string }
  | { type: 'ADD_MEDIA'; payload: PostMedia }
  | { type: 'REMOVE_MEDIA'; payload: number }
  | { type: 'UPDATE_POLL_OPTION'; payload: { index: number; text: string } }
  | { type: 'ADD_POLL_OPTION' }
  | { type: 'REMOVE_POLL_OPTION'; payload: number }
  | { type: 'SET_POLL_DURATION'; payload: number }
  | { type: 'TOGGLE_POLL'; payload: boolean }
  | { type: 'TOGGLE_SCHEDULED'; payload: boolean }
  | { type: 'SET_SCHEDULED_DATE'; payload: string | null }
  | { type: 'SET_VISIBILITY'; payload: PostVisibility }
  | { type: 'TOGGLE_COMMENTS'; payload: boolean }
  | { type: 'TOGGLE_SHARING'; payload: boolean }
  | { type: 'ADD_MENTION'; payload: string }
  | { type: 'ADD_HASHTAG'; payload: string }
  | { type: 'SET_LOCATION'; payload: { name: string; latitude: number; longitude: number } | null }
  | { type: 'POST_REQUEST' }
  | { type: 'POST_SUCCESS' }
  | { type: 'POST_ERROR'; payload: string }
  | { type: 'RESET' };
