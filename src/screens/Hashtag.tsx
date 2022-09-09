import { gql, useApolloClient } from "@apollo/client";
import { faHeart, faComment } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { useParams } from "react-router-dom";
import PageTitle from "../components/PageTitle";
import { useSeeHashtagQuery } from "../generated/graphql";
import {
  Avatar,
  Column,
  Grid,
  Header,
  Icon,
  Icons,
  Item,
  List,
  Name,
  Photo,
  Row,
  Username,
  Value,
} from "./Profile";

gql`
  query seeHashtag($hashtag: String!, $page: Int!) {
    seeHashtag(hashtag: $hashtag) {
      totalPhotos
      photos(page: $page) {
        file
        likes
        commentsNumber
      }
      updatedAt
    }
  }
`;

export default function Hashtag() {
  const { hashtag } = useParams();
  const { data, loading } = useSeeHashtagQuery({
    variables: { hashtag: "#" + hashtag, page: 1 },
  });
  const firstPhoto =
    data?.seeHashtag?.photos !== null
      ? data?.seeHashtag?.photos !== undefined
        ? data?.seeHashtag?.photos[0]
        : undefined
      : undefined;

  return (
    <div>
      <PageTitle title={loading ? "Loading..." : `#${hashtag}`} />
      <Header>
        <Avatar src={firstPhoto?.file} />
        <Column>
          <Row>
            <Username>#{hashtag}</Username>
          </Row>
          <Row>
            <List>
              <Item>
                <span>
                  Tagged: <Value>{data?.seeHashtag?.totalPhotos}</Value>
                </span>
              </Item>
            </List>
          </Row>
          <Row>
            <Name>
              {"Last Uploaded: "}
              {data?.seeHashtag?.updatedAt}
            </Name>
          </Row>
          <Row>
            {"Latest about "}
            {hashtag}
          </Row>
        </Column>
      </Header>
      <Grid>
        {data?.seeHashtag?.photos?.map((photo: any) => (
          <Photo key={photo?.id} bg={photo?.file}>
            <Icons>
              <Icon>
                <FontAwesomeIcon icon={faHeart} />
                {photo?.likes}
              </Icon>
              <Icon>
                <FontAwesomeIcon icon={faComment} />
                {photo?.commentsNumber}
              </Icon>
            </Icons>
          </Photo>
        ))}
      </Grid>
    </div>
  );
}
