import React from "react";
import { Segment } from "semantic-ui-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <Segment textAlign="center" tertiary vertical>
      <p className="copyright">
        &copy; Battle Royale Gallery <br></br>
        Designed by Kazon Wilson &nbsp;
        <Link to="http://kazonwilson.com">kazonwilson.com</Link>.
      </p>
    </Segment>
  );
};

export default Footer;
