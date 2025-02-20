/* eslint-disable no-unused-vars */
import React, { Component } from "react";

export default class Header extends Component {
  render() {
    return (
      <header>
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <div className="m-3 w-100">
            <div className="row">
              <div className="col d-flex">
                <h2 className="">Logo</h2>
              </div>
              <div className="col d-flex justify-content-end">
                <p>My Account Dropdown</p>
              </div>
            </div>
          </div>
        </nav>
      </header>
    );
  }
}
