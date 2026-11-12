import { useState, useRef, useEffect } from "react";
import {
  Home,
  Search,
  Library,
  Heart,
  Play,
  Pause,
  Music2,
  Headphones,
  Plus,
  SkipBack,
  SkipForward,
  Volume2,
} from "lucide-react";
import "./App.css";

const songs = [
  {
    id: 1,
    title: "Anbu kooruven",
    artist: "Berchmans",
    color: "#5545a4",
    audio: "/songs/song1.mp3",
    image: "/covers/cover1.jpg",
  },
  {
    id: 2,
    title: "Radhimaa",
    artist: "Sai abhyankkar",
    color: "#bc7449",
    audio: "/songs/song2.mp3",
    image: "/covers/cover2.jpeg",
  },
  {
    id: 3,
    title: "Rathinamo",
    artist: "Saurav Srisan",
    color: "#247d86",
    audio: "/songs/song3.mp3",
    image: "/covers/cover3.png",
  },
  {
    id: 4,
    title: "Thangamey",
    artist: "Anirudh Ravichander", 
    color: "#b76e79", audio: "/songs/song4.mp3", 
    image: "/covers/cover4.jpg",
   },
   { 
    id: 5,
    title: "Sagala Thuthiyum", 
    artist: "MPA Church Kellys Choir", 
    color: "#6b8e70", 
    audio: "/songs/song6.mp3", 
    image: "/covers/cover5.jpg", 
   }, 
   { id: 6, 
    title: "Vaanaathi Vaanangal", 
    artist: "Leo Rakesh", 
    color: "#487a9b", 
    audio: "/songs/song7.mp3", 
    image: "/covers/cover6.jpg",
   }, 
   {
     id: 7, 
     title: "Oorum Blood Unplugged", 
     artist: "Sai Abhyankkar", 
     color: "#984e43", 
     audio: "/songs/song7.mp3", 
     image: "/covers/cover7.jpeg",
   },
   { 
     id: 8, 
     title: "Nallaru Po", 
     artist: "Sai Abhyankkar", 
     color: "#a28b54", 
     audio: "/songs/song8.mp3", 
     image: "/covers/cover8.jpeg",
     }, 
     { 
      id: 9, 
      title: "Chellame Magale", 
      artist: "Sai Abhyankkar", 
      color: "#966b9d", 
      audio: "/songs/song9.mp3", 
      image: "/covers/cover9.jpg",
    }, 
    { 
      id: 10, 
      title: "Kannukulla", 
      artist: "Adesh Krishna, Jonita Gandhi & Sai Abhyankkar", 
      color: "#547b85", audio: "/songs/song10.mp3", 
      image: "/covers/cover10.jpeg", 
    },
];

function formatTime(time) {
  if (!Number.isFinite(time)) return "0:00";

  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);

  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function App() {
  const audioRef = useRef(null);

  const [search, setSearch] = useState("");
  const [currentSong, setCurrentSong] = useState(songs[0]);
const [likedSongs, setLikedSongs] = useState(() => {
  try {
    return JSON.parse(localStorage.getItem("melody-liked-songs")) || [];
  } catch {
    return [];
  }
});
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [activeView, setActiveView] = useState("home");
  const [showFullPlayer, setShowFullPlayer] = useState(false);


  const filteredSongs = songs.filter((song) => {
  const matchesSearch = `${song.title} ${song.artist}`
    .toLowerCase()
    .includes(search.toLowerCase());

  const matchesView =
    activeView !== "favorites" ||
    likedSongs.includes(song.id);

  return matchesSearch && matchesView;
});

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) return;

    audio.load();
    setCurrentTime(0);
    setDuration(0);

    if (isPlaying) {
      audio.play().catch((error) => {
        console.error("Unable to play audio:", error);
        setIsPlaying(false);
      });
    }
  }, [currentSong]);

useEffect(() => {
  localStorage.setItem(
    "melody-liked-songs",
    JSON.stringify(likedSongs)
  );
}, [likedSongs]);



  function toggleLike(id) {
    setLikedSongs((previous) =>
      previous.includes(id)
        ? previous.filter((songId) => songId !== id)
        : [...previous, id]
    );
  }

  async function togglePlay() {
    const audio = audioRef.current;

    if (!audio) return;

    if (audio.paused) {
      try {
        await audio.play();
      } catch (error) {
        console.error("Unable to play audio:", error);
        setIsPlaying(false);
      }
    } else {
      audio.pause();
    }
  }

  function selectSong(song) {
if (song.id === currentSong.id) {
togglePlay();
} else {
setCurrentSong(song);
setIsPlaying(true);
}

setShowFullPlayer(true);
}


  function changeSong(direction) {
    const currentIndex = songs.findIndex(
      (song) => song.id === currentSong.id
    );

    const nextIndex =
      (currentIndex + direction + songs.length) % songs.length;

    setCurrentSong(songs[nextIndex]);
    setIsPlaying(true);
  }

  function handleSeek(event) {
    const audio = audioRef.current;

    if (!audio || !Number.isFinite(audio.duration)) return;

    const time = Number(event.target.value);

    audio.currentTime = time;
    setCurrentTime(time);
  }

  function handleVolume(event) {
    setVolume(Number(event.target.value));
  }

  return (
    <div className="app">
      {showFullPlayer && (
        <section className="full-player">
          <div
            className="full-player-backdrop"
            style={{ backgroundImage: `url("${currentSong.image}")` }}
            aria-hidden="true"
          />
          <div className="full-player-shade" aria-hidden="true" />

          <button
            className="back-button"
            onClick={() => setShowFullPlayer(false)}
          >
            ← Back to Isai Mazhai
          </button>

          <div className="full-player-content">
            <p className="full-player-label">NOW PLAYING</p>

            <img
              key={currentSong.id}
              src={currentSong.image}
              alt={`${currentSong.title} album cover`}
              className="full-player-cover"
            />
            

            <div className="full-player-details">
              <div>
                <h1>{currentSong.title}</h1>
                <p>{currentSong.artist}</p>
              </div>

              <button
                className={`like-button ${
                  likedSongs.includes(currentSong.id) ? "liked" : ""
                }`}
                onClick={() => toggleLike(currentSong.id)}
                aria-label="Like current song"
              >
                <Heart
                  size={25}
                  fill={
                    likedSongs.includes(currentSong.id)
                      ? "currentColor"
                      : "none"
                  }
                />
              </button>
            </div>

            <div className="full-player-progress">
              <input
                className="progress-slider"
                type="range"
                min="0"
                max={duration || 0}
                step="0.1"
                value={Math.min(currentTime, duration || 0)}
                onChange={handleSeek}
                aria-label="Seek through song"
                style={{
                  "--progress": `${
                    duration ? (currentTime / duration) * 100 : 0
                  }%`,
                }}
              />

              <div className="full-player-times">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            <div className="full-player-controls">
              <button
                className="control-button"
                onClick={() => changeSong(-1)}
                aria-label="Previous song"
              >
                <SkipBack size={25} fill="currentColor" />
              </button>

              <button
                className="full-player-play"
                onClick={togglePlay}
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? (
                  <Pause size={28} fill="currentColor" />
                ) : (
                  <Play size={28} fill="currentColor" />
                )}
              </button>

              <button
                className="control-button"
                onClick={() => changeSong(1)}
                aria-label="Next song"
              >
                <SkipForward size={25} fill="currentColor" />
              </button>
            </div>

            <div className="full-player-volume">
              <Volume2 size={18} />
              <input
                className="volume-slider"
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={handleVolume}
                aria-label="Volume"
                style={{ "--volume": `${volume * 100}%` }}
              />
            </div>
          </div>
        </section>
      )}

      <audio
        ref={audioRef}
        src={currentSong.audio}
        preload="metadata"
        onTimeUpdate={(event) =>
          setCurrentTime(event.currentTarget.currentTime)
        }
        onLoadedMetadata={(event) =>
          setDuration(event.currentTarget.duration)
        }
        onDurationChange={(event) =>
          setDuration(event.currentTarget.duration)
        }
        onEnded={() => changeSong(1)}
        onPause={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
      />

      <aside className="sidebar">
       <div className="brand">
  <img src="/isai-mazhai-logo.png" alt="Isai Mazhai Logo" className="brand-logo"/>

  <h2>
    Isai Mazhai<span>.</span>
  </h2>
</div>

        <p className="menu-label">MENU</p>

        <nav className="navigation">

<button
  className={`nav-item ${
    activeView === "home" ? "active" : ""
  }`}
  onClick={() => {
    setActiveView("home");
    setSearch("");
  }}
>
  <Home size={19} />
  <span>Home</span>
</button>


          <button
            className="nav-item"
            onClick={() =>
              document.getElementById("search-input")?.focus()
            }
          >
            <Search size={19} />
            <span>Search</span>
          </button>

          <button
            className="nav-item"
            onClick={() => setSearch("")}
          >
            <Library size={19} />
            <span>Your Library</span>
          </button>
        </nav>

        <div className="playlist-heading">
          <p className="menu-label">YOUR PLAYLISTS</p>
          <button
            className="icon-button"
            aria-label="Add playlist"
            title="Playlist feature coming soon"
          >
            <Plus size={19} />
          </button>
        </div>


<div className="playlist-list">
  <button onClick={() => setSearch("")}>
    Chill Vibes
  </button>

  <button onClick={() => setSearch("")}>
    Daily Mix
  </button>

  <button onClick={() => setSearch("")}>
    Late Night
  </button>

<button
  onClick={() => {
    setActiveView("favorites");
    setSearch("");
  }}
>
  Favourite Tracks
</button>


</div>

        <div className="sidebar-footer">
          <Music2 size={18} />
          <span>Your music, your mood.</span>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <p className="greeting">YOUR SPACE, YOUR SOUND</p>
            <h1>Good music. Good mood.</h1>
          </div>

          <div className="profile">
            <div className="profile-avatar">M</div>
            <span>Music Lover</span>
          </div>
        </header>

        <section className="hero">
          <div className="hero-content">

  <span className="hero-tag">
    இசை மழையில் நனைய நீங்கள் தயாரா?
  </span>

  <h2>
    Let the Music
    <br />
    Rain.
  </h2>

  <p>
    Your favourite melodies, your favourite moments.
    Experience music that speaks to your heart.
  </p>

  <button
    className="hero-button"
    onClick={() => selectSong(songs[0])}
  >
    <Play size={17} fill="currentColor" />
    Explore Music
  </button>

</div>

          <div className="hero-art">
            <div className="art-circle circle-one"></div>
            <div className="art-circle circle-two"></div>

            <div className="art-disc">
              <div className="disc-center">
                <Music2 size={35} />
              </div>
            </div>

            <span className="floating-note">♫</span>
          </div>
        </section>

        <section className="music-section">
          <div className="section-heading">
            <div>
              <p className="section-subtitle">MADE FOR YOU</p>
<h2>
  {activeView === "favorites"
    ? "Your Favourite Tracks"
    : "Discover your sound"}
</h2>

            </div>

            <span className="song-count">
              {filteredSongs.length} tracks
            </span>
          </div>

          <div className="search-box">
            <Search size={19} />

            <input
              id="search-input"
              type="text"
              placeholder="Search songs or artists..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          <div className="song-grid">
            {filteredSongs.map((song) => (
              <article className="song-card" key={song.id}>
                <button
                  className="cover-art"
                  style={{ backgroundColor: song.color }}
                  onClick={() => selectSong(song)}
                  aria-label={`Play ${song.title}`}
                >
                  <img src={song.image} alt={`${song.title} album cover`} className="album-cover"/>

                  <span className="cover-play">
                    {currentSong.id === song.id && isPlaying ? (
                      <Pause size={20} fill="currentColor" />
                    ) : (
                      <Play size={20} fill="currentColor" />
                    )}
                  </span>
                </button>

                <div className="song-details">
                  <div>
                    <h3>{song.title}</h3>
                    <p>{song.artist}</p>
                  </div>

                  <button
                    className={`like-button ${
                      likedSongs.includes(song.id) ? "liked" : ""
                    }`}
                    onClick={() => toggleLike(song.id)}
                    aria-label={`Like ${song.title}`}
                  >
                    <Heart
                      size={19}
                      fill={
                        likedSongs.includes(song.id)
                          ? "currentColor"
                          : "none"
                      }
                    />
                  </button>
                </div>

                <button
                  className="play-track"
                  onClick={() => selectSong(song)}
                >
                  {currentSong.id === song.id && isPlaying ? (
                    <Pause size={14} />
                  ) : (
                    <Play size={14} fill="currentColor" />
                  )}
                  {currentSong.id === song.id && isPlaying
                    ? "Now playing"
                    : "Play track"}
                </button>
              </article>
            ))}
          </div>

          {filteredSongs.length === 0 && (
            <p className="empty-message">
              No songs found. Try another search.
            </p>
          )}
        </section>

        <footer className="page-footer">
  Created with <span>♥</span> by Edison</footer>
      </main>

      <footer className="music-player">
        <div className="now-playing">
          <img className="mini-cover" src={currentSong.image} alt={`${currentSong.title} cover`}/>

          <div>
            <h4>{currentSong.title}</h4>
            <p>{currentSong.artist}</p>
          </div>

          <button
            className={`like-button ${
              likedSongs.includes(currentSong.id) ? "liked" : ""
            }`}
            onClick={() => toggleLike(currentSong.id)}
            aria-label="Like current song"
          >
            <Heart
              size={18}
              fill={
                likedSongs.includes(currentSong.id)
                  ? "currentColor"
                  : "none"
              }
            />
          </button>
        </div>

        <div className="player-controls">
          <div className="control-buttons">
            <button
              className="control-button"
              onClick={() => changeSong(-1)}
              aria-label="Previous song"
            >
              <SkipBack size={20} fill="currentColor" />
            </button>

            <button
              className="main-play-button"
              onClick={togglePlay}
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <Pause size={19} fill="currentColor" />
              ) : (
                <Play size={19} fill="currentColor" />
              )}
            </button>

            <button
              className="control-button"
              onClick={() => changeSong(1)}
              aria-label="Next song"
            >
              <SkipForward size={20} fill="currentColor" />
            </button>
          </div>

          <div className="progress-area">
            <span>{formatTime(currentTime)}</span>

            <input
              className="progress-slider"
              type="range"
              min="0"
              max={duration || 0}
              step="0.1"
              value={Math.min(currentTime, duration || 0)}
              onChange={handleSeek}
              aria-label="Seek through song"
              style={{
                "--progress": `${
                  duration ? (currentTime / duration) * 100 : 0
                }%`,
              }}
            />

            <span>{formatTime(duration)}</span>
          </div>
        </div>

        <div className="volume-control">
          <Volume2 size={19} />

          <input
            className="volume-slider"
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolume}
            aria-label="Volume"
            style={{
              "--volume": `${volume * 100}%`,
            }}
          />
        </div>
      </footer>
    </div>
  );
}

export default App;
