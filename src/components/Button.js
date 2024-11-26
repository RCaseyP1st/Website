import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom'; // Import Link for navigation

const Button = () => {
  return (
    <StyledWrapper>
      <Link to="/wellbeing-review-form" className="learn-more"> {/* Use Link for navigation */}
        <span className="circle" aria-hidden="true">
          <span className="icon arrow" />
        </span>
        <span className="button-text">Wellbeing Review Form</span>
      </Link>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .learn-more {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    text-decoration: none;
    background: #03969b; /* Cyan background */
    color: #fff;
    font-family: 'Century Gothic', sans-serif;
    font-size: 1rem;
    font-weight: bold;
    text-transform: uppercase;
    margin-bottom: 20px;
    padding: 10px 20px;
    border-radius: 8px;
    overflow: hidden;
    transition: all 0.3s ease-in-out;
    cursor: pointer;
  }

  .learn-more:hover {
    background: #d78223; /* Orange hover */
    transform: scale(1.05); /* Slight hover effect */
  }

  .circle {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.5rem;
    height: 2.5rem;
    background: #fff;
    border-radius: 50%;
    margin-right: 10px;
    transition: all 0.3s ease-in-out;
  }

  .icon.arrow {
    position: relative;
    width: 0.75rem;
    height: 0.75rem;
    border: 2px solid #03969b; /* Cyan */
    border-width: 2px 2px 0 0;
    transform: rotate(45deg);
    transition: all 0.3s ease-in-out;
  }

  .learn-more:hover .circle {
    transform: scale(1.2); /* Enlarge the circle */
  }

  .learn-more:hover .icon.arrow {
    transform: translateX(5px) rotate(45deg); /* Move arrow to the right */
  }
`;

export default Button;
