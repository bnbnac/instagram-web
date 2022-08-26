import { gql } from "@apollo/client";
import Photo from "../components/feed/Photo";
import PageTitle from "../components/PageTitle";
import { useSeeFeedQuery } from "../generated/graphql";

gql`
  query seeFeed($page: Int!) {
    seeFeed(page: $page) {
      id
      user {
        username
        avatar
      }
      file
      caption
      likes
      commentsNumber
      comments {
        id
        user {
          username
          avatar
        }
        payload
        isMine
        createdAt
      }
      createdAt
      isMine
      isLiked
    }
  }
`;

function Home() {
  const { data } = useSeeFeedQuery({ variables: { page: 1 } });
  return (
    <div>
      <PageTitle title="Home" />
      {data?.seeFeed?.map(
        (photo) => photo && <Photo key={photo?.id} {...photo} />
      )}
    </div>
  );
}

// Font Awesome supports t-shirt size scale from 2xs to 2xl as well as literal sizing from 1x to 10x.

// /* T-shirt sizes */
// <FontAwesomeIcon icon="fa-solid fa-coffee" size="xs" />
// <FontAwesomeIcon icon="fa-solid fa-coffee" size="lg" />

// /* X-factor sizing */
// <FontAwesomeIcon icon="fa-solid fa-coffee" size="6x" />
// Remember, you can always control icon size directly with the CSS `font-size` attribute. The `FontAwesomeIcon`'s size prop determines icon size relative to the current context's font-size.

export default Home;
