import { Helmet } from "react-helmet-async";

type StringTitle = {
  title: string;
};

function PageTitle({ title }: StringTitle) {
  return (
    <Helmet>
      <title>{title} | Instagram</title>
    </Helmet>
  );
}

export default PageTitle;
