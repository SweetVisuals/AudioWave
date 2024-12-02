import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Music, User, Camera, ImageIcon, Edit2, X, Check } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useDashboardStore } from '../store/useDashboardStore';
import { DashboardSection } from '../components/DashboardSection';
import { AudioPlayer } from '../components/AudioPlayer';
import { getUserProfile } from '../lib/api';
import toast from 'react-hot-toast';

export function Dashboard() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuthStore();
  const { sections, isEditMode, setEditMode } = useDashboardStore();
  const [profileUser, setProfileUser] = useState<any>(null);
  const [bannerImage, setBannerImage] = useState<string | null>(null);
  const [avatarImage, setAvatarImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userTracks, setUserTracks] = useState<any[]>([]);

  useEffect(() => {
    async function loadProfile() {
      try {
        setIsLoading(true);
        if (id) {
          const profile = await getUserProfile(id);
          setProfileUser(profile);
          setUserTracks([]); // Initialize with empty array until we implement track fetching
        } else if (user) {
          navigate(`/dashboard/${user.username.toLowerCase().replace(/\s+/g, '-')}`);
        } else {
          navigate('/');
        }
      } catch (error) {
        console.error('Failed to load profile:', error);
        toast.error('Failed to load profile');
      } finally {
        setIsLoading(false);
      }
    }

    loadProfile();
  }, [id, user, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  const displayUser = profileUser || user;
  if (!displayUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white">User not found</div>
      </div>
    );
  }

  const isOwnProfile = user && (!id || id === user.username.toLowerCase().replace(/\s+/g, '-'));

  const orderedSections = Object.values(sections)
    .filter(section => section.visible)
    .sort((a, b) => a.order - b.order);

  return (
    <div className="min-h-screen">
      {/* Banner */}
      <div className="relative h-48 md:h-56 group bg-gray-800">
        {bannerImage && (
          <div 
            className="absolute inset-0 bg-center bg-cover transition-all duration-200"
            style={{ backgroundImage: `url(${bannerImage})` }}
          />
        )}
        {isOwnProfile && (
          <>
            <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-40 transition-opacity duration-200" />
            <label className="absolute inset-0 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setBannerImage(reader.result as string);
                    };
                    reader.readAsDataURL(file);
                  }
                }}
                className="hidden"
              />
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-lg px-4 py-2 rounded-lg text-white">
                <ImageIcon size={20} />
                <span className="text-sm">Change Banner</span>
              </div>
            </label>
          </>
        )}
      </div>

      {/* Profile Section */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between -mt-16 md:-mt-20 mb-8 relative z-10">
          {/* Profile Picture and Info */}
          <div className="flex items-center gap-4">
            <div className="relative group">
              <div className="w-20 h-20 rounded-full border-4 border-white overflow-hidden bg-gray-700 flex items-center justify-center">
                {avatarImage || displayUser.profilePicture ? (
                  <img 
                    src={avatarImage || displayUser.profilePicture} 
                    alt="Profile" 
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <User size={40} className="text-white/80" />
                )}
              </div>
              {isOwnProfile && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <label className="w-20 h-20 rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/40 flex items-center justify-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setAvatarImage(reader.result as string);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="hidden"
                    />
                    <Camera size={16} className="text-white" />
                  </label>
                </div>
              )}
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-lg px-4 py-2">
              <h1 className="text-lg font-bold text-white">{displayUser.username}</h1>
              <p className="text-sm text-white/60">
                {displayUser.wallet?.slice(0, 6)}...{displayUser.wallet?.slice(-4)}
              </p>
            </div>
          </div>

          {/* Edit Mode Toggle */}
          {isOwnProfile && (
            <div className="flex items-center gap-4">
              {isEditMode ? (
                <>
                  <button
                    onClick={() => setEditMode(false)}
                    className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors"
                  >
                    <Check size={20} />
                    <span>Save Layout</span>
                  </button>
                  <button
                    onClick={() => setEditMode(false)}
                    className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                  >
                    <X size={20} />
                    <span>Cancel</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setEditMode(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                >
                  <Edit2 size={20} />
                  <span>Edit Layout</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Dashboard Sections */}
        <div className="space-y-8">
          {orderedSections.map((section) => (
            <DashboardSection
              key={section.id}
              section={section}
            >
              {section.type === 'tracks' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {userTracks.length > 0 ? (
                    userTracks.map((track) => (
                      <div key={track.id} className="bg-white/5 backdrop-blur-lg rounded-lg border border-white/10">
                        <AudioPlayer
                          id={track.id}
                          url={track.audio_url}
                          title={track.title}
                          artist={track.artist}
                          artistId={track.artist?.toLowerCase().replace(/\s+/g, '-')}
                          artistImage={track.artistImage}
                          price={track.price}
                          stats={track.stats}
                        />
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-12">
                      <Music className="mx-auto h-12 w-12 text-white/20 mb-4" />
                      <p className="text-white/60">No tracks uploaded yet</p>
                    </div>
                  )}
                </div>
              )}
            </DashboardSection>
          ))}
        </div>
      </div>
    </div>
  );
}