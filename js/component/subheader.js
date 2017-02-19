import React from 'react';

var SubHeader = React.createClass({
  render: function() {    
    var links = [],
        viewingUrl = '?' + this.props.viewingPage;
    for (let link of Object.keys(this.props.links)) {
      links.push(
        <a href={link} key={link} className={ viewingUrl == link ? 'sub-header-selected' : 'sub-header-unselected' }>
          {this.props.links[link]}
        </a>
      );
    }
    return (
      <nav className="sub-header">
        {links}
      </nav>
    );
  }
});

export default SubHeader;