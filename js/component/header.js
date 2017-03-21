import React from 'react';
import Search from './search.js';
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
  },

  handleScroll: function() {
    this.setState({
      isScrolled: document.body.scrollTop > 0
    });
  },
  render: function() {
    return (
      <header id="header" className={ (this.state.isScrolled ? 'header-scrolled' : 'header-unscrolled') + ' ' + (this.props.links ? 'header-with-subnav' : 'header-no-subnav') }>
          <a href="#" className="lbry-Logo"><img className="logoStyle" src="./img/lbry-dark-485x160.png"/></a>
          <nav className="navLinks">
              <NavItem href="/?discover" viewingPage={this.props.viewingPage} label="discover" icon="icon-compass"/>
              <NavItem href="/?downloaded" subPages={['published']} viewingPage={this.props.viewingPage} label="my collection" icon="icon-paperclip" />
              <NavItem href="/?publish" viewingPage={this.props.viewingPage} label="publish" icon="icon-upload" />
              <NavItem href="/?wallet" subPages={['send', 'receive', 'claim', 'referral']} viewingPage={this.props.viewingPage} label="wallet" icon="icon-money"/>
              <NavItem href="/?settings" viewingPage={this.props.viewingPage} label="settings" icon="icon-cog"/>
          </nav>       
      </header>
  
    );
  }

});

export default Header;