import { gql } from "@apollo/client";
import { useCallback, useEffect, useRef, useState } from "react";
import Photo from "../components/feed/Photo";
import PageTitle from "../components/PageTitle";
import { COMMENT_FRAGMENT, PHOTO_FRAGMENT } from "../fragment";
import { useSeeFeedQuery } from "../generated/graphql";

gql`
  query seeFeed($page: Int!) {
    seeFeed(page: $page) {
      ...PhotoFragment
      user {
        username
        avatar
      }
      caption
      comments {
        ...CommentFragment
      }
      createdAt
      isMine
    }
  }
  ${PHOTO_FRAGMENT}
  ${COMMENT_FRAGMENT}
`;

function Home() {
  const [page, setPage] = useState(1);
  const [target, setTarget] = useState<Element | null>(null);

  const { data, loading, fetchMore } = useSeeFeedQuery({
    variables: { page: page },
  });

  const handleObserver = useCallback(
    ([entry]: any) => {
      if (entry.isIntersecting) {
        setPage(page + 1);
        fetchMore({ variables: { page: page + 1 } });
      }
    },
    [page]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: "0px",
      threshold: 0.6,
    });
    target && observer.observe(target);
    return () => {
      if (target) {
        observer.disconnect();
      }
    };
  }, [target]);

  return (
    <div>
      <PageTitle title={loading ? "Loading..." : "Home"} />
      {data?.seeFeed?.map(
        (photo, i) =>
          photo && (
            <div ref={i + 1 !== data?.seeFeed?.length ? null : setTarget}>
              <Photo key={i} {...photo} />
            </div>
          )
      )}
    </div>
  );
}

// {list.map((item, i) => {
//   const isLastElement = books.length === i + 1;
//   isLastElement ? (
//     <div key={i} ref={lastBookElementRef}>
//     {book}
//     </div>
//   ) : (
//   <div key={i}>{book}</div>
//   )
// })}

// Font Awesome supports t-shirt size scale from 2xs to 2xl as well as literal sizing from 1x to 10x.

// /* T-shirt sizes */
// <FontAwesomeIcon icon="fa-solid fa-coffee" size="xs" />
// <FontAwesomeIcon icon="fa-solid fa-coffee" size="lg" />

// /* X-factor sizing */
// <FontAwesomeIcon icon="fa-solid fa-coffee" size="6x" />
// Remember, you can always control icon size directly with the CSS `font-size` attribute. The `FontAwesomeIcon`'s size prop determines icon size relative to the current context's font-size.

export default Home;
