import { VideoStates } from "../utils/video-states";

export type User = {
  id: string;
  email: string;
  fullname: string;
  address: {
    country: string;
    city: string;
    street: string;
  };
  version: number;
  updatedAt: string;
  createdAt: string;
};

export type Resource = {
  status: any;
  resource: {
    id: string;
    name: string;
    video: string;
    audio: string;
    size: number;
    user: User;
    status: VideoStates;
    updatedAt: string;
    createdAt: string;
  };
  videoUrl?: string;
  audioUrl?: string;
};
