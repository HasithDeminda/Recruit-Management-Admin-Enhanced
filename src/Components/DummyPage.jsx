import React from "react";
import VideoPlayer from "./VideoPlayer";

const DummyPage = () => {
  return (
    <div>
      DummyPage
      <VideoPlayer
        url="//player.vimeo.com/video/374265101?title=0&portrait=0&byline=0&autoplay=0&responsive=1"
        background="transparent"
      />
    </div>
  );
};

export default DummyPage;
