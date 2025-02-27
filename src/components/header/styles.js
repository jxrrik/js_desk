import styled from 'styled-components'

export const Bar = styled.div`
  height: 2em;
  display: flex;
  background-color: ${({ theme }) => theme.bar};
  border-bottom: 1px solid rgba(0, 0, 0, 0.03);
  box-shadow: 0px 0px 3px rgba(0, 0, 0, 0.03);
  -webkit-user-select: none;
  z-index: 100;
  
`;

export const Space = styled.div`
  -webkit-app-region: drag;
  width: 100%;
  height: 100%;
`

export const Side = styled.div`
  width: max-content;
  height: 100%;
  display: flex;

  .btn {
    width: 2em;
    height: 2em;
    display: flex;
    justify-content: center;
    align-items: center;
    border-left: 1px solid ${({ theme }) => theme.border2};
    background-color: ${({ theme }) => theme.contrast};
    opacity: 0.5;
    cursor: pointer;
    transition: all 0.2s;

    svg {
      font-size: 0.8em;
      opacity: 0.8;
      color: ${({ theme }) => theme.text};
    }
    &.ativ {
      border: none;
    }
    &:hover,
    &.ativ {
      opacity: 1;
      background-color: ${({ theme }) => theme.contrast2};
    }

    &.close:hover {
      background-color: red;
      svg {
        color: ${({ theme }) => theme.text};
        opacity: 1;
      }
    }
  }
`;


