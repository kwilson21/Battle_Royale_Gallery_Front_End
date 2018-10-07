import React from "react";
import { Breadcrumb, Icon } from "semantic-ui-react";

const BreadCrumb = props => (
  <Breadcrumb size="large">
    <Breadcrumb.Section link>
      <Icon name="home" />
      Home
    </Breadcrumb.Section>
    <Breadcrumb.Divider icon="right angle" />
    <Breadcrumb.Section link>Games</Breadcrumb.Section>
    <Breadcrumb.Divider icon="right angle" />
    <Breadcrumb.Section active>Personal Information</Breadcrumb.Section>
  </Breadcrumb>
);

export default BreadCrumb;
