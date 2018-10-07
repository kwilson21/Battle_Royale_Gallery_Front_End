import React from "react";
import { Header } from "semantic-ui-react";

const NotFound = () => {
  return (
    <div
      style={{
        minHeight: "100%",
        minWidth: "1024px",
        width: "100%",
        height: "auto",
        position: "absolute",
        overflowY: "auto",
        top: "0",
        left: "0",
        backgroundImage: 'url("https://wallpapercave.com/wp/wp2208669.png")'
      }}
    >
      <Header style={{ textAlign: "center", padding: "250px 0" }} as="h1">
        404 Page not found
      </Header>
    </div>
  );
};

export default NotFound;
