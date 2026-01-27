import React, { Component } from "react";
import "../css/home.css";

const ActionPanel = ({ signIn, slide }) => {
  const heading = signIn ? "Traditional Care" : "Welcome back!";
  const paragraph = signIn
    ? "Enter your personal details and start your journey with us"
    : "To keep connected with us please login with your personal info";
  const button = signIn ? "Sign up!" : "Sign in!";

  return (
    <div className="Panel ActionPanel">
      <h2>{heading}</h2>
      <p>{paragraph}</p>
      <button onClick={slide}>{button}</button>
    </div>
  );
};

const FormPanel = ({ signIn }) => {
  const heading = signIn ? "Sign in" : "Create account";

  const social = [
    { href: "#", icon: "f" },
    { href: "#", icon: "t" },
    { href: "#", icon: "in" },
  ];

  const inputs = signIn
    ? [
        { type: "text", placeholder: "Email" },
        { type: "password", placeholder: "Password" },
      ]
    : [
        { type: "text", placeholder: "Name" },
        { type: "text", placeholder: "Email" },
        { type: "password", placeholder: "Password" },
      ];

  const link = { href: "#", text: "Forgot your password?" };
  const button = signIn ? "Sign in" : "Sign up";

  return (
    <div className="">
    <div className="login">
      <div className="Panel FormPanel">
        <h2>{heading}</h2>
        <div className="Social">
          {social.map(({ href, icon }) => (
            <a href={href} key={icon}>
              {icon}
            </a>
          ))}
        </div>
        <p>Or use your email account</p>
        <form>
          {inputs.map(({ type, placeholder }) => (
            <input type={type} key={placeholder} placeholder={placeholder} />
          ))}
        </form>
        <a href={link.href}>{link.text}</a>
        <button>{button}</button>
      </div>
    </div>
    </div>
  );
};

class AuthPanel extends Component {
  constructor() {
    super();
    this.state = { signIn: true, transition: false };
    this.slide = this.slide.bind(this);
  }

  slide() {
    if (this.state.transition) return;

    const { signIn } = this.state;
    const formPanel = document.querySelector(".FormPanel");
    const actionPanel = document.querySelector(".ActionPanel");
    const actionPanelChildren = actionPanel.children;

    const formBoundingRect = formPanel.getBoundingClientRect();
    const actionBoundingRect = actionPanel.getBoundingClientRect();

    formPanel.style.transition = "all 0.6s ease-in-out";
    actionPanel.style.transition = "all 0.6s ease-in-out";
    [...actionPanelChildren].forEach(
      (child) => (child.style.transition = "all 0.4s ease-in-out")
    );

    this.setState({ transition: true });

    if (signIn) {
      formPanel.style.transform = `translateX(${actionBoundingRect.width}px)`;
      actionPanel.style.transform = `translateX(${-formBoundingRect.width}px)`;
    } else {
      formPanel.style.transform = `translateX(${-actionBoundingRect.width}px)`;
      actionPanel.style.transform = `translateX(${formBoundingRect.width}px)`;
    }

    setTimeout(() => {
      this.setState({ signIn: !signIn });
    }, 300);

    setTimeout(() => {
      formPanel.style.transition = "none";
      actionPanel.style.transition = "none";
      formPanel.style.transform = "translate(0)";
      actionPanel.style.transform = "translate(0)";
      actionPanel.style.order = signIn ? -1 : 1;
      this.setState({ transition: false });
    }, 600);
  }

  render() {
    return (
      <div className="App">
        <FormPanel signIn={this.state.signIn} />
        <ActionPanel signIn={this.state.signIn} slide={this.slide} />
      </div>
    );
  }
}

export default AuthPanel;
