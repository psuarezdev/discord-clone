import { Server as NetServer, Socket } from 'net';
import type { NextApiRequest, NextApiResponse } from 'next';
import { Server as SocketServer } from 'socket.io';
import type { Server as PrismaServer, Channel, Member, Message as PrismaMessage, User } from '@prisma/client';

export interface CloudinaryResponse {
  asset_id: string;
  public_id: string;
  version: number;
  version_id: string;
  signature: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  created_at: string;
  tags: string[];
  bytes: number;
  type: string;
  etag: string;
  placeholder: boolean;
  url: string;
  secure_url: string;
  folder: string;
  original_filename: string;
  api_key: string;
}

export interface Server extends PrismaServer {
  channels: Channel[];
  members: Member & { user: User }[];
}

interface Message extends PrismaMessage {
  member: Member & {
    user: User
  };
}

export type NextApiResponseServerIo = NextApiResponse & {
  socket: Socket & {
    server: NetServer & {
      io: SocketServer;
    };
  };
};