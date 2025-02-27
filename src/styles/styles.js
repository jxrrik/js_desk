import styled from "styled-components";


export const AppContainer = styled.div`
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;

  

  .content-app {
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    border: 1px solid rgba(0, 0, 0, 0.1);
    box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.03);
    background-color: ${({ theme }) => theme.body};

    color: ${({ theme }) => theme.text};
  }
`;

export const BlackScreen = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  position: absolute;
  background-color: black;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3;

  input {
    user-select: all !important;
    width: 50%;
    height: 2em;
    background-color: white;
    z-index: 11;
    color: black;
  }
`;
