import { Helmet, HelmetProvider } from "react-helmet-async";

type StringTitle = {
  title: string;
};

function PageTitle({ title }: StringTitle) {
  return (
    <HelmetProvider>
      <Helmet>
        <title>{title} | Instagram</title>
      </Helmet>
    </HelmetProvider>
  );
}

export default PageTitle;
