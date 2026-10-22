import styles from "@styles/video.module.css";

// A YouTube video that plays muted on a loop, framed like light projected into the room.
function Video({ youtubeId, title }) {
    const params = new URLSearchParams({
        autoplay: 1,
        mute: 1,
        loop: 1,
        // looping a single video only works when it's also its own playlist
        playlist: youtubeId,
        controls: 0,
        rel: 0,
        playsinline: 1,
        modestbranding: 1,
    });

    return (
        <figure className={styles.video}>
            <div className={styles.frame}>
                <iframe
                    src={`https://www.youtube-nocookie.com/embed/${youtubeId}?${params}`}
                    title={title}
                    allow="autoplay; encrypted-media; picture-in-picture"
                    allowFullScreen
                />
            </div>
            <figcaption className={styles.caption}>
                <span>Playing muted.</span>
                <a href={`https://www.youtube.com/watch?v=${youtubeId}`} target="_blank" rel="noopener noreferrer">
                    Watch with sound on YouTube <span aria-hidden="true">↗</span>
                </a>
            </figcaption>
        </figure>
    );
}

export default Video;
