import React from "react";

const VideoPlayer = ({ url, background = "black", className = "video" }) => {
  return (
    <div
      className={className}
      style={{
        position: "relative",
        background: background,
        paddingBottom: "56.25%" /* 16:9 */,
        paddingTop: 25,
        height: 0,
      }}
    >
      {/* <iframe
        title="Embeded Video"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
        src={url}
        frameBorder="0"
      /> */}

      {/* -----For YouTube-------- */}
      {/* <iframe
        width="560"
        height="315"
        src="https://www.youtube.com/embed/YykjpeuMNEk"
        title="YouTube video player"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
      ></iframe> */}

      {/* -----For Vimeo-------- */}
      <iframe
        src={url}
        width="640"
        height="360"
        frameborder="0"
        allow="autoplay; fullscreen; picture-in-picture"
        allowfullscreen
      ></iframe>
    </div>
  );
};

export default VideoPlayer;
