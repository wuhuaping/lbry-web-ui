import React from 'react';
import {Link} from './link.js';

var NavItem = React.createClass({
  getDefaultProps: function() {
    return {
      subPages: [],
    };
  },
  render: function() { //old code, including bug
    var isSelected = (this.props.viewingPage == this.props.href.substr(2) ||
                      this.props.subPages.indexOf(this.props.viewingPage) != -1);
    return <Link {...this.props} className={ 'nav-item' + (isSelected ? ' nav-item-selected' : '') } />
  }
});

var Header = React.createClass({
  getInitialState: function() {
    return {
      isScrolled: false,
    };
  },
  componentDidMount: function() {
    document.addEventListener('scroll', this.handleScroll);
  },
  componentWillUnmount: function() {
    document.removeEventListener('scroll', this.handleScroll);
    if (this.userTypingTimer)
    {
      clearTimeout(this.userTypingTimer);
    }
  },
  handleScroll: function() {
    this.setState({
      isScrolled: document.body.scrollTop > 0
    });
  },
  onQueryChange: function(event) {
    if (this.userTypingTimer)
    {
      clearTimeout(this.userTypingTimer);
    }
    //@TODO: Switch to React.js timing
    var searchTerm = event.target.value;
    this.userTypingTimer = setTimeout(() => {
      this.props.onSearch(searchTerm);
    }, 800); // 800ms delay, tweak for faster/slower
  },

  render: function() {
    return (
      <header id="header" className={ (this.state.isScrolled ? 'header-scrolled' : 'header-unscrolled') + ' ' + (this.props.links ? 'header-with-subnav' : 'header-no-subnav') }>
          <div className="header-top-bar">        
            <a href="#"><img className="logoStyle" src="./img/lbry-dark-485x160.png"/></a>
            <nav id="navLinks">
              <NavItem href="/?discover" viewingPage={this.props.viewingPage} label="discover" />
              <NavItem href="/?downloaded" subPages={['published']} viewingPage={this.props.viewingPage} label="my collection" />
              <NavItem href="/?publish" viewingPage={this.props.viewingPage} label="publish" />
              <NavItem href="/?wallet" subPages={['send', 'receive', 'claim', 'referral']} viewingPage={this.props.viewingPage} label="wallet"/>
              <NavItem href="/?settings" viewingPage={this.props.viewingPage} label="settings" />
            </nav>
          </div>
          <div className="header-search row-fluid">
            <a href="#" className="span1"><img className="magGlass" src="./img/mag-glass.png"/></a>
            <input type="search" className="span9" onChange={this.onQueryChange}
            placeholder="i'm looking for..."/>
            <a href="#"><button className="searchBtn span2">search</button></a>
          </div>
      </header>
    );
  }
});

export default Header;