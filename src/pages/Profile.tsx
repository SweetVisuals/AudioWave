import React from 'react';
import { useParams } from 'react-router-dom';
import { Music, Users, Gem } from 'lucide-react';
import { AudioPlayer } from '../components/AudioPlayer';

// Mock data for different artists
const MOCK_USERS = {
  'dj-wave': {
    id: 'dj-wave',
    name: 'DJ Wave',
    image: 'https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?w=400&h=400&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1920&h=400&fit=crop&q=80',
    stats: {
      followers: 12500,
      following: 450,
      gems: 2800
    },
    bio: 'Electronic music producer and DJ based in Los Angeles. Creating vibes since 2015.',
    tracks: [
      {
        id: 1,
        title: "Summer Vibes",
        artist: "DJ Wave",
        artistImage: "https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?w=100&h=100&fit=crop&q=80",
        stats: {
          gems: 156,
          streams: 125000,
          upvotes: 3200,
          popularity: 85
        },
        price: {
          buy: 29.99,
          lease: 9.99
        },
        audio_url: "https://actions.google.com/sounds/v1/alarms/digital_watch_alarm_long.ogg"
      }
    ]
  },
  'luna-beats': {
    id: 'luna-beats',
    name: 'Luna Beats',
    image: 'https://images.unsplash.com/photo-1534258936925-c58bed479fcb?w=400&h=400&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1920&h=400&fit=crop&q=80',
    stats: {
      followers: 8900,
      following: 320,
      gems: 1500
    },
    bio: 'R&B producer crafting smooth melodies and soulful beats.',
    tracks: [
      {
        id: 2,
        title: "Midnight Dreams",
        artist: "Luna Beats",
        artistImage: "https://images.unsplash.com/photo-1534258936925-c58bed479fcb?w=100&h=100&fit=crop&q=80",
        stats: {
          gems: 98,
          streams: 98000,
          upvotes: 2800,
          popularity: 75
        },
        price: {
          buy: 24.99,
          lease: 7.99
        },
        audio_url: "https://actions.google.com/sounds/v1/alarms/mechanical_clock_ring.ogg"
      }
    ]
  },
  'metro-sounds': {
    id: 'metro-sounds',
    name: 'Metro Sounds',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=400&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=1920&h=400&fit=crop&q=80',
    stats: {
      followers: 15600,
      following: 280,
      gems: 3100
    },
    bio: 'Hip Hop producer from New York City. Bringing the streets to your speakers.',
    tracks: [
      {
        id: 3,
        title: "Urban Flow",
        artist: "Metro Sounds",
        artistImage: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=100&h=100&fit=crop&q=80",
        stats: {
          gems: 204,
          streams: 156000,
          upvotes: 4100,
          popularity: 92
        },
        price: {
          buy: 34.99,
          lease: 11.99
        },
        audio_url: "https://actions.google.com/sounds/v1/alarms/digital_watch_alarm_long.ogg"
      }
    ]
  }
};

function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
}

export function Profile() {
  const { id } = useParams();
  const user = id ? MOCK_USERS[id as keyof typeof MOCK_USERS] : null;

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">User Not Found</h1>
          <p className="text-white/60">The user you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Banner */}
      <div 
        className="h-48 md:h-64 bg-center bg-cover"
        style={{ backgroundImage: `url(${user.banner})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50" />
      </div>

      {/* Profile Info */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-start md:items-end gap-6 -mt-20 mb-8 relative z-10">
          {/* Profile Picture */}
          <div className="w-32 h-32 rounded-full border-4 border-black overflow-hidden">
            <img 
              src={user.image} 
              alt={user.name} 
              className="w-full h-full object-cover"
            />
          </div>

          {/* User Info */}
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white mb-2">{user.name}</h1>
            <p className="text-white/60 max-w-2xl">{user.bio}</p>
          </div>

          {/* Stats */}
          <div className="flex gap-4">
            <div className="text-center">
              <div className="flex items-center gap-1 text-white">
                <Users size={16} />
                <span className="font-bold">{formatNumber(user.stats.followers)}</span>
              </div>
              <div className="text-sm text-white/60">Followers</div>
            </div>
            <div className="text-center">
              <div className="flex items-center gap-1 text-white">
                <Users size={16} />
                <span className="font-bold">{formatNumber(user.stats.following)}</span>
              </div>
              <div className="text-sm text-white/60">Following</div>
            </div>
            <div className="text-center">
              <div className="flex items-center gap-1 text-white">
                <Gem size={16} />
                <span className="font-bold">{formatNumber(user.stats.gems)}</span>
              </div>
              <div className="text-sm text-white/60">Gems</div>
            </div>
          </div>
        </div>

        {/* Tracks */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <Music className="h-6 w-6 text-white" />
            <h2 className="text-2xl font-bold text-white">Tracks</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {user.tracks.map((track) => (
              <div key={track.id} className="bg-white/10 backdrop-blur-lg rounded-lg border border-primary/20">
                <AudioPlayer
                  id={track.id}
                  url={track.audio_url}
                  title={track.title}
                  artist={track.artist}
                  artistId={user.id}
                  artistImage={track.artistImage}
                  price={track.price}
                  stats={track.stats}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}