import React from 'react';
import {Link} from './link.js';      

var Search = React.createClass ({
	getInitialState:function() {
	    return {
	      isScrolled: false,
	    };
	},
	componentWillUnmount: function () {
    	if (this.userTypingTimer)
    	{
    		clearTimeout(this.userTypingTimer);
    	}
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
			<search className="search">
				<div className="searchTitle">search</div>          
		    	<input type="search" onChange={this.onQueryChange}
		            placeholder="i'm looking for..."/>
		    </search>
   		);
	}
});


export default Search;
