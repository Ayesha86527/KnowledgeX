import React, { useState } from 'react';
import { Users, TrendingUp, MessageSquare, Award, ChevronDown, ChevronUp, Send } from 'lucide-react';


const TRUST_LEVELS = {
  NEW: { label: 'New', color: '#94a3b8', threshold: 0 },
  VERIFIED: { label: 'Verified', color: '#3b82f6', threshold: 100 },
  TRUSTED: { label: 'Trusted', color: '#8b5cf6', threshold: 500 },
  ELITE: { label: 'Elite', color: '#f59e0b', threshold: 1000 }
};

const POST_TYPES = {
  ASK: { label: 'Ask', icon: '❓', color: '#3b82f6' },
  TEACH: { label: 'Teach', icon: '📚', color: '#10b981' },
  CHALLENGE: { label: 'Challenge', icon: '⚡', color: '#f59e0b' },
  OPINION: { label: 'Opinion', icon: '💭', color: '#8b5cf6' }
};

const COMMENT_TYPES = {
  EXPLANATION: { label: 'Explanation', icon: '💡' },
  COUNTER: { label: 'Counter-argument', icon: '🔄' },
  EXAMPLE: { label: 'Example', icon: '📋' }
};

// Sample Users
const initialUsers = [
  {
    id: 1,
    username: 'sarah_dev',
    avatar: '👩‍💻',
    reputation: 1250,
    expertise: ['React', 'TypeScript', 'UI/UX'],
    contributions: [45, 52, 38, 61, 48, 70, 55],
    whyFollow: 'Expert in modern web development with clear explanations',
    followers: 342,
    following: 89,
    postsCount: 127,
    impactReach: 5600
  },
  {
    id: 2,
    username: 'alex_ml',
    avatar: '🧠',
    reputation: 890,
    expertise: ['Machine Learning', 'Python', 'Data Science'],
    contributions: [30, 42, 35, 48, 52, 45, 38],
    whyFollow: 'Breaks down complex ML concepts into digestible content',
    followers: 218,
    following: 45,
    postsCount: 89,
    impactReach: 3200
  },
  {
    id: 3,
    username: 'jordan_sys',
    avatar: '⚙️',
    reputation: 650,
    expertise: ['DevOps', 'AWS', 'Docker'],
    contributions: [20, 28, 32, 25, 30, 35, 28],
    whyFollow: 'Practical infrastructure advice from real-world experience',
    followers: 156,
    following: 67,
    postsCount: 54,
    impactReach: 1800
  }
];

// Sample Posts
const initialPosts = [
  {
    id: 1,
    authorId: 1,
    type: 'TEACH',
    content: 'Understanding React Hooks: A practical guide to useState and useEffect with real examples from production code.',
    timestamp: Date.now() - 3600000,
    reactions: { agree: 45, useful: 62, insightful: 38, disagree: [] },
    visibility: 95
  },
  {
    id: 2,
    authorId: 2,
    type: 'ASK',
    content: 'What are the best practices for handling imbalanced datasets in ML? Looking for techniques beyond SMOTE.',
    timestamp: Date.now() - 7200000,
    reactions: { agree: 12, useful: 8, insightful: 5, disagree: [] },
    visibility: 78
  },
  {
    id: 3,
    authorId: 3,
    type: 'CHALLENGE',
    content: 'Most developers over-engineer their Docker setups. Change my mind. Here\'s why simpler is often better...',
    timestamp: Date.now() - 10800000,
    reactions: { agree: 28, useful: 15, insightful: 22, disagree: [{ reason: 'Enterprise needs differ', count: 8 }] },
    visibility: 88
  },
  {
    id: 4,
    authorId: 1,
    type: 'OPINION',
    content: 'TypeScript is no longer optional for serious web development. The tooling and DX improvements are too significant to ignore.',
    timestamp: Date.now() - 14400000,
    reactions: { agree: 89, useful: 34, insightful: 45, disagree: [{ reason: 'Small projects don\'t need it', count: 12 }] },
    visibility: 92
  },
  {
    id: 5,
    authorId: 2,
    type: 'TEACH',
    content: 'Neural network optimization: Why learning rate scheduling matters more than most people think. Thread 🧵',
    timestamp: Date.now() - 18000000,
    reactions: { agree: 34, useful: 56, insightful: 67, disagree: [] },
    visibility: 90
  }
];

// Sample Comments
const initialComments = [
  {
    id: 1,
    postId: 1,
    authorId: 2,
    type: 'EXAMPLE',
    content: 'Great post! Here\'s how I used useEffect to handle WebSocket connections in my project...',
    timestamp: Date.now() - 3000000,
    likes: 23
  },
  {
    id: 2,
    postId: 1,
    authorId: 3,
    type: 'EXPLANATION',
    content: 'To add to this: the cleanup function in useEffect is crucial for preventing memory leaks.',
    timestamp: Date.now() - 2800000,
    likes: 18
  },
  {
    id: 3,
    postId: 3,
    authorId: 1,
    type: 'COUNTER',
    content: 'While I agree with simplicity, multi-stage builds and proper layer caching can significantly reduce deployment time.',
    timestamp: Date.now() - 9000000,
    likes: 34
  },
  {
    id: 4,
    postId: 4,
    authorId: 3,
    type: 'EXPLANATION',
    content: 'The type safety catches so many bugs at compile time. Saved our team countless hours of debugging.',
    timestamp: Date.now() - 13000000,
    likes: 45
  },
  {
    id: 5,
    postId: 2,
    authorId: 1,
    type: 'EXAMPLE',
    content: 'I\'ve had success with focal loss for extreme imbalance cases. Here\'s a notebook showing the implementation...',
    timestamp: Date.now() - 6000000,
    likes: 28
  }
];

// ==================== COMPONENTS ====================

const App = () => {
  const [users] = useState(initialUsers);
  const [posts, setPosts] = useState(initialPosts);
  const [comments, setComments] = useState(initialComments);
  const [currentUser] = useState(users[0]);
  const [activeTab, setActiveTab] = useState('feed');
  const [selectedUser, setSelectedUser] = useState(null);
  const [expandedPosts, setExpandedPosts] = useState(new Set());

  // Calculate trust level based on reputation
  const getTrustLevel = (reputation) => {
    if (reputation >= TRUST_LEVELS.ELITE.threshold) return TRUST_LEVELS.ELITE;
    if (reputation >= TRUST_LEVELS.TRUSTED.threshold) return TRUST_LEVELS.TRUSTED;
    if (reputation >= TRUST_LEVELS.VERIFIED.threshold) return TRUST_LEVELS.VERIFIED;
    return TRUST_LEVELS.NEW;
  };

  // Handle reactions
  const handleReaction = (postId, reactionType) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        const newReactions = { ...post.reactions };
        if (reactionType === 'disagree') {
          const reason = prompt('Why do you disagree?');
          if (reason) {
            newReactions.disagree = [...(newReactions.disagree || []), { reason, count: 1 }];
          }
        } else {
          newReactions[reactionType] = (newReactions[reactionType] || 0) + 1;
        }
        return { ...post, reactions: newReactions, visibility: post.visibility + 2 };
      }
      return post;
    }));
  };

  // Add comment
  const addComment = (postId, content, type) => {
    const newComment = {
      id: comments.length + 1,
      postId,
      authorId: currentUser.id,
      type,
      content,
      timestamp: Date.now(),
      likes: 0
    };
    setComments([...comments, newComment]);
  };

  // Toggle post expansion
  const togglePost = (postId) => {
    const newExpanded = new Set(expandedPosts);
    if (newExpanded.has(postId)) {
      newExpanded.delete(postId);
    } else {
      newExpanded.add(postId);
    }
    setExpandedPosts(newExpanded);
  };

  // Format timestamp
  const formatTime = (timestamp) => {
    const diff = Date.now() - timestamp;
    const hours = Math.floor(diff / 3600000);
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Header */}
      <header className="bg-black/30 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-2xl">
                🧠
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                KnowledgeX
              </h1>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full">
                <span className="text-2xl">{currentUser.avatar}</span>
                <div>
                  <div className="text-sm font-semibold">{currentUser.username}</div>
                  <div className="text-xs text-purple-400">{getTrustLevel(currentUser.reputation).label}</div>
                </div>
                <div className="ml-2 text-yellow-400 font-bold">{currentUser.reputation}</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-black/20 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-6">
            {['feed', 'profiles', 'impact'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 font-semibold capitalize transition-all ${
                  activeTab === tab
                    ? 'text-purple-400 border-b-2 border-purple-400'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Feed Tab */}
        {activeTab === 'feed' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Feed */}
            <div className="lg:col-span-2 space-y-4">
              {posts.map(post => {
                const author = users.find(u => u.id === post.authorId);
                const trustLevel = getTrustLevel(author.reputation);
                const postComments = comments.filter(c => c.postId === post.id);
                const isExpanded = expandedPosts.has(post.id);
                const totalReactions = post.reactions.agree + post.reactions.useful + post.reactions.insightful;

                return (
                  <div
                    key={post.id}
                    className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:border-purple-500/50 transition-all"
                  >
                    {/* Post Header */}
                    <div className="flex items-start gap-4 mb-4">
                      <div className="text-4xl">{author.avatar}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold">{author.username}</span>
                          <span
                            className="px-2 py-0.5 rounded-full text-xs font-semibold"
                            style={{ backgroundColor: trustLevel.color + '40', color: trustLevel.color }}
                          >
                            {trustLevel.label}
                          </span>
                          <span className="text-sm text-gray-400">{formatTime(post.timestamp)}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span
                            className="px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1"
                            style={{ backgroundColor: POST_TYPES[post.type].color + '20', color: POST_TYPES[post.type].color }}
                          >
                            {POST_TYPES[post.type].icon} {POST_TYPES[post.type].label}
                          </span>
                          <span className="text-xs text-gray-500">Visibility: {post.visibility}%</span>
                        </div>
                      </div>
                    </div>

                    {/* Post Content */}
                    <p className="text-gray-200 mb-4 leading-relaxed">{post.content}</p>

                    {/* Reactions */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      <button
                        onClick={() => handleReaction(post.id, 'agree')}
                        className="px-4 py-2 bg-green-500/20 hover:bg-green-500/30 rounded-full text-sm font-semibold flex items-center gap-2 transition-all"
                      >
                        👍 Agree <span className="text-green-400">{post.reactions.agree}</span>
                      </button>
                      <button
                        onClick={() => handleReaction(post.id, 'useful')}
                        className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-full text-sm font-semibold flex items-center gap-2 transition-all"
                      >
                        ⭐ Useful <span className="text-blue-400">{post.reactions.useful}</span>
                      </button>
                      <button
                        onClick={() => handleReaction(post.id, 'insightful')}
                        className="px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 rounded-full text-sm font-semibold flex items-center gap-2 transition-all"
                      >
                        💡 Insightful <span className="text-purple-400">{post.reactions.insightful}</span>
                      </button>
                      <button
                        onClick={() => handleReaction(post.id, 'disagree')}
                        className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-full text-sm font-semibold flex items-center gap-2 transition-all"
                      >
                        🤔 Disagree {post.reactions.disagree.length > 0 && <span className="text-red-400">{post.reactions.disagree.length}</span>}
                      </button>
                    </div>

                    {/* Comments Toggle */}
                    <button
                      onClick={() => togglePost(post.id)}
                      className="w-full py-2 text-sm text-purple-400 hover:text-purple-300 flex items-center justify-center gap-2"
                    >
                      <MessageSquare size={16} />
                      {postComments.length} comments
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>

                    {/* Comments Section */}
                    {isExpanded && (
                      <div className="mt-4 space-y-3 border-t border-white/10 pt-4">
                        {postComments.map(comment => {
                          const commentAuthor = users.find(u => u.id === comment.authorId);
                          return (
                            <div key={comment.id} className="bg-white/5 rounded-lg p-4">
                              <div className="flex items-start gap-3">
                                <span className="text-2xl">{commentAuthor.avatar}</span>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="font-semibold text-sm">{commentAuthor.username}</span>
                                    <span className="px-2 py-0.5 bg-purple-500/20 rounded text-xs flex items-center gap-1">
                                      {COMMENT_TYPES[comment.type].icon} {COMMENT_TYPES[comment.type].label}
                                    </span>
                                    <span className="text-xs text-gray-500">{formatTime(comment.timestamp)}</span>
                                  </div>
                                  <p className="text-sm text-gray-300">{comment.content}</p>
                                  <button className="mt-2 text-xs text-purple-400 hover:text-purple-300">
                                    ❤️ {comment.likes}
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              {/* Top Contributors */}
              <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Award className="text-yellow-400" size={20} />
                  Top Contributors
                </h3>
                {users.sort((a, b) => b.reputation - a.reputation).map((user, idx) => (
                  <div key={user.id} className="flex items-center gap-3 mb-3 cursor-pointer hover:bg-white/5 p-2 rounded-lg transition-all"
                    onClick={() => { setSelectedUser(user); setActiveTab('profiles'); }}>
                    <div className="text-2xl">{user.avatar}</div>
                    <div className="flex-1">
                      <div className="font-semibold text-sm">{user.username}</div>
                      <div className="text-xs text-gray-400">{user.reputation} rep</div>
                    </div>
                    <div className="text-xl font-bold text-yellow-400">#{idx + 1}</div>
                  </div>
                ))}
              </div>

              {/* Trending Topics */}
              <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <TrendingUp className="text-purple-400" size={20} />
                  Trending Topics
                </h3>
                {['React', 'Machine Learning', 'DevOps', 'TypeScript', 'Docker'].map(topic => (
                  <div key={topic} className="mb-2 px-3 py-2 bg-purple-500/10 rounded-lg text-sm hover:bg-purple-500/20 cursor-pointer transition-all">
                    #{topic}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Profiles Tab */}
        {activeTab === 'profiles' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map(user => {
              const trustLevel = getTrustLevel(user.reputation);
              return (
                <div key={user.id} className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:border-purple-500/50 transition-all">
                  <div className="text-center mb-4">
                    <div className="text-6xl mb-3">{user.avatar}</div>
                    <h3 className="text-xl font-bold mb-1">{user.username}</h3>
                    <div
                      className="inline-block px-3 py-1 rounded-full text-sm font-semibold mb-2"
                      style={{ backgroundColor: trustLevel.color + '40', color: trustLevel.color }}
                    >
                      {trustLevel.label}
                    </div>
                    <div className="text-2xl font-bold text-yellow-400">{user.reputation}</div>
                    <div className="text-xs text-gray-400 mb-4">Reputation Score</div>
                  </div>

                  <div className="flex justify-around mb-4 text-center">
                    <div>
                      <div className="font-bold text-lg">{user.postsCount}</div>
                      <div className="text-xs text-gray-400">Posts</div>
                    </div>
                    <div>
                      <div className="font-bold text-lg">{user.followers}</div>
                      <div className="text-xs text-gray-400">Followers</div>
                    </div>
                    <div>
                      <div className="font-bold text-lg">{user.following}</div>
                      <div className="text-xs text-gray-400">Following</div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="text-xs text-gray-400 mb-2">Expertise</div>
                    <div className="flex flex-wrap gap-2">
                      {user.expertise.map(tag => (
                        <span key={tag} className="px-2 py-1 bg-purple-500/20 rounded text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="text-xs text-gray-400 mb-2">Contribution Graph</div>
                    <div className="flex gap-1 h-16 items-end">
                      {user.contributions.map((val, idx) => (
                        <div
                          key={idx}
                          className="flex-1 bg-gradient-to-t from-purple-500 to-pink-500 rounded-t"
                          style={{ height: `${(val / 70) * 100}%` }}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="text-sm text-gray-300 italic mb-4">
                    "{user.whyFollow}"
                  </div>

                  <button className="w-full py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg font-semibold hover:opacity-90 transition-all">
                    Follow
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Impact Tab */}
        {activeTab === 'impact' && (
          <div className="space-y-6">
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <Users className="text-purple-400" />
                Social Impact Replay
              </h2>

              {users.map(user => (
                <div key={user.id} className="mb-8 pb-8 border-b border-white/10 last:border-0">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-4xl">{user.avatar}</span>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold">{user.username}</h3>
                      <div className="text-sm text-gray-400">Impact Reach: {user.impactReach.toLocaleString()} people</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                      <div className="text-2xl font-bold text-green-400">{user.postsCount}</div>
                      <div className="text-sm text-gray-400">Total Posts</div>
                    </div>
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                      <div className="text-2xl font-bold text-blue-400">{user.followers}</div>
                      <div className="text-sm text-gray-400">Influenced Users</div>
                    </div>
                    <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                      <div className="text-2xl font-bold text-purple-400">{user.reputation}</div>
                      <div className="text-sm text-gray-400">Reputation Earned</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm font-semibold text-gray-400 mb-2">Recent Impact Timeline</div>
                    {posts.filter(p => p.authorId === user.id).slice(0, 3).map(post => {
                      const totalReactions = post.reactions.agree + post.reactions.useful + post.reactions.insightful;
                      return (
                        <div key={post.id} className="bg-white/5 rounded-lg p-3 flex items-center gap-3">
                          <div
                            className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
                            style={{ backgroundColor: POST_TYPES[post.type].color + '30' }}
                          >
                            {POST_TYPES[post.type].icon}
                          </div>
                          <div className="flex-1">
                            <div className="text-sm">{post.content.substring(0, 60)}...</div>
                            <div className="text-xs text-gray-500 mt-1">
                              {totalReactions} reactions • {comments.filter(c => c.postId === post.id).length} comments
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-bold text-purple-400">+{totalReactions * 2}</div>
                            <div className="text-xs text-gray-500">reach</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;