import { gql, useReactiveVar } from "@apollo/client";
import { faInstagram } from "@fortawesome/free-brands-svg-icons";
import {
  faCompass,
  faPlusSquare,
  faPaperPlane,
} from "@fortawesome/free-regular-svg-icons";
import { faDoorOpen, faHome } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { isLoggedInVar, logUserOut } from "../apollo";
import useUser from "../hooks/useUser";
import routes from "../routes";
import Avatar from "./Avatar";
import UploadModal from "./modal/UploadModal";
import SearchBar from "./SearchBar";

const SHeader = styled.header`
  width: 100%;
  border-bottom: 1px solid ${(props) => props.theme.borderColor};
  background-color: ${(props) => props.theme.bgColor};
  padding: 18px 0px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Wrapper = styled.div`
  max-width: 930px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Column = styled.div``;

const Icon = styled.span`
  margin-left: 15px;
  cursor: pointer;
`;

const Button = styled.span`
  background-color: ${(props) => props.theme.accent};
  border-radius: 4px;
  padding: 3px 15px;
  color: white;
  font-weight: 600;
`;

const IconsContainer = styled.div`
  display: flex;
  align-items: center;
`;

function Header() {
  const isLoggedIn = useReactiveVar(isLoggedInVar);
  const [isOpen, setIsOpen] = useState(false);
  const setIsOpenFalse = () => setIsOpen(false);
  const { data: myData } = useUser();

  return (
    <SHeader>
      <Wrapper>
        <Column>
          <FontAwesomeIcon icon={faInstagram} size="2x" />
        </Column>
        <Column>
          <SearchBar
            placeholder={"search USER with @AnyUsername, TAG with #AnyHashtag"}
            fromWhere={"Header"}
          />
        </Column>
        <Column>
          {isLoggedIn ? (
            <IconsContainer>
              <Icon>
                <Link to={routes.Home}>
                  <FontAwesomeIcon icon={faHome} size="lg" />
                </Link>
              </Icon>
              <Icon>
                <Link to={`/direct/main`}>
                  <FontAwesomeIcon icon={faPaperPlane} size="lg" />
                </Link>
              </Icon>
              <Icon>
                <FontAwesomeIcon
                  cursor={"pointer"}
                  onClick={() => {
                    setIsOpen(true);
                  }}
                  icon={faPlusSquare}
                  size="lg"
                />
              </Icon>
              <Icon onClick={() => logUserOut()}>
                <FontAwesomeIcon icon={faDoorOpen} size="lg" />
              </Icon>
              <Icon>
                <Link to={`/users/${myData?.me?.username}`}>
                  <Avatar url={myData?.me?.avatar} />
                </Link>
              </Icon>
            </IconsContainer>
          ) : (
            <Link to={routes.Home}>
              <Button>Login</Button>
            </Link>
          )}
        </Column>
      </Wrapper>
      <UploadModal isOpen={isOpen} setIsOpenFalse={setIsOpenFalse} />
    </SHeader>
  );
}
export default Header;
