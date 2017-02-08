import React from 'react';
import lbry from '../lbry.js';
import lighthouse from '../lighthouse.js';
import {FileTile} from '../component/file-tile.js';
import {Link} from '../component/link.js';
import {ToolTip} from '../component/tooltip.js';
import {BusyMessage} from '../component/common.js';

var fetchResultsStyle = {
    color: '#888',
    textAlign: 'center',
    fontSize: '1.2em'
  };

var SearchActive = React.createClass({
  render: function() {
    return (
      <div style={fetchResultsStyle}>
        <BusyMessage message="Looking up the Dewey Decimals" />
      </div>
    );
  }
});

var searchNoResultsStyle = {
  textAlign: 'center'
}, searchNoResultsMessageStyle = {
  fontStyle: 'italic',
  marginRight: '5px'
};

var SearchNoResults = React.createClass({
  render: function() {
    return (
      <section style={searchNoResultsStyle}>
        <span style={searchNoResultsMessageStyle}>No one has checked anything in for {this.props.query} yet.</span>
        <Link label="Be the first" href="?publish" />
      </section>
    );
  }
});

var SearchResults = React.createClass({
  render: function() {
    var rows = [],
        seenNames = {}; //fix this when the search API returns claim IDs
    this.props.results.forEach(function({name, value}) {
      if (!seenNames[name]) {
        seenNames[name] = name;
        rows.push(
          <FileTile key={name} name={name} sdHash={value.sources.lbry_sd_hash} />
        );
      }
    });
    return (
      <div>{rows}</div>
    );
  }
});

var
  searchRowStyle = {
    // height: (24 * 7) + 'px',
    overflowY: 'hidden'
  },
  searchRowCompactStyle = {
    // height: '180px',
  },
  searchRowImgStyle = {
    maxWidth: '100%',
    maxHeight: (24 * 7) + 'px',
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  searchRowTitleStyle = {
    fontWeight: 'bold'
  },
  searchRowTitleCompactStyle = {
    fontSize: '1.25em',
    lineHeight: '1.15',
  },
  searchRowCostStyle = {
    float: 'right',
  },
  searchRowDescriptionStyle = {
    color : '#444',
    marginTop: '12px',
    fontSize: '0.9em'
  };


var SearchResultRow = React.createClass({
  getInitialState: function() {
    return {
      downloading: false,
      isHovered: false,
      cost: null,
      costIncludesData: null,
    }
  },
  handleMouseOver: function() {
    this.setState({
      isHovered: true,
    });
  },
  handleMouseOut: function() {
    this.setState({
      isHovered: false,
    });
  },
  componentWillMount: function() {
    if ('cost' in this.props) {
      this.setState({
        cost: this.props.cost,
        costIncludesData: this.props.costIncludesData,
      });
    } else {
      lbry.getCostInfoForName(this.props.name, ({cost, includesData}) => {
        this.setState({
          cost: cost,
          costIncludesData: includesData,
        });
      });
    }
  },
  render: function() {
    var obscureNsfw = !lbry.getClientSetting('showNsfw') && this.props.nsfw;
    if (!this.props.compact) {
      var style = searchRowStyle;
      var titleStyle = searchRowTitleStyle;
    } else {
      var style = Object.assign({}, searchRowStyle, searchRowCompactStyle);
      var titleStyle = Object.assign({}, searchRowTitleStyle, searchRowTitleCompactStyle);
    }

    return (
      <section className={ 'card ' + (obscureNsfw ? 'card-obscured ' : '') + (this.props.compact ? 'card-compact' : '')} onMouseEnter={this.handleMouseOver} onMouseLeave={this.handleMouseOut}>
        <div className="row-fluid card-content" style={style}>
          <div className="span3">
            <a href={'/?show=' + this.props.name}><Thumbnail src={this.props.imgUrl} alt={'Photo for ' + (this.props.title || this.props.name)} style={searchRowImgStyle} /></a>
          </div>
          <div className="span9">
            {this.state.cost !== null
              ? <span style={searchRowCostStyle}>
                  <CreditAmount amount={this.state.cost} isEstimate={!this.state.costIncludesData}/>
                </span>
              : null}
            <div className="meta"><a href={'/?show=' + this.props.name}>lbry://{this.props.name}</a></div>
            <h3 style={titleStyle}>
              <a href={'/?show=' + this.props.name}>
                <TruncatedText lines={3}>
                  {this.props.title}
                </TruncatedText>
              </a>
            </h3>
            <div>
              {this.props.mediaType == 'video' ? <WatchLink streamName={this.props.name} button="primary" /> : null}
              <DownloadLink streamName={this.props.name} button="text" />
            </div>
            <p style={searchRowDescriptionStyle}>
              <TruncatedText lines={3}>
                {this.props.description}
              </TruncatedText>
            </p>
          </div>
        </div>
        {
          !obscureNsfw || !this.state.isHovered ? null :
            <div className='card-overlay'>
              <p>
                This content is Not Safe For Work.
                To view adult content, please change your <Link href="?settings" label="Settings" />.
              </p>
            </div>
        }
      </section>
    );
  }
});

var featuredContentItemContainerStyle = {
  position: 'relative',
};

var FeaturedContentItem = React.createClass({
  resolveSearch: false,

  propTypes: {
    name: React.PropTypes.string,
  },

  getInitialState: function() {
    return {
      metadata: null,
      title: null,
      cost: null,
      overlayShowing: false,
    };
  },

  componentWillUnmount: function() {
    this.resolveSearch = false;
  },

  componentDidMount: function() {
    this._isMounted = true;

    lbry.resolveName(this.props.name, (metadata) => {
      if (!this._isMounted) {
        return;
      }

      this.setState({
        metadata: metadata,
        title: metadata && metadata.title ? metadata.title : ('lbry://' + this.props.name),
      });
    });
  },

  render: function() {
    if (this.state.metadata === null) {
      // Still waiting for metadata, skip render
      return null;
    }

    return (<div style={featuredContentItemContainerStyle}>
      <SearchResultRow name={this.props.name} title={this.state.title} imgUrl={this.state.metadata.thumbnail}
                 description={this.state.metadata.description} mediaType={lbry.getMediaType(this.state.metadata.content_type)}
                 nsfw={this.state.metadata.nsfw} compact />
    </div>);
  }
});

var featuredContentLegendStyle = {
  fontSize: '12px',
  color: '#aaa',
  verticalAlign: '15%',
};

var FeaturedContent = React.createClass({
  render: function() {
    const toolTipText = ('Community Content is a public space where anyone can share content with the ' +
                        'rest of the LBRY community. Bid on the names "one," "two," "three," "four" and ' +
                        '"five" to put your content here!');
    return (
      <div className="row-fluid">
        <div className="span6">
          <h3>Featured Content</h3>
          <FileTile name="coherence" />
          <FileTile name="itsadisaster" />
          <FileTile name="mikehill-blockbuster" />
          <FileTile name="bellflower" />
          <FileTile name="cinemasix" />

        </div>
        <div className="span6">
          <h3>
            Community Content
            <ToolTip label="What's this?" body={toolTipText} className="tooltip--header"/>
          </h3>
          <FileTile name="one" />
          <FileTile name="two" />
          <FileTile name="three" />
          <FileTile name="four" />
          <FileTile name="five" />
        </div>
      </div>
    );
  }
});

var DiscoverPage = React.createClass({
  userTypingTimer: null,

  componentDidUpdate: function() {
    if (this.props.query != this.state.query)
    {
      this.handleSearchChanged(this.props.query);
    }
  },

  componentWillReceiveProps: function(nextProps, nextState) {
    if (nextProps.query != nextState.query)
    {
      this.handleSearchChanged(nextProps.query);
    }
  },

  handleSearchChanged: function(query) {
    this.setState({
      searching: true,
      query: query,
    });

    lighthouse.search(query, this.searchCallback);
  },

  componentWillMount: function() {
    document.title = "Discover";
    if (this.props.query) {
      // Rendering with a query already typed
      this.handleSearchChanged(this.props.query);
    }
  },

  getInitialState: function() {
    return {
      results: [],
      query: this.props.query,
      searching: ('query' in this.props) && (this.props.query.length > 0)
    };
  },

  searchCallback: function(results) {
    if (this.state.searching) //could have canceled while results were pending, in which case nothing to do
    {
      this.setState({
        results: results,
        searching: false //multiple searches can be out, we're only done if we receive one we actually care about
      });
    }
  },

  render: function() {
    return (
      <main>
        { this.state.searching ? <SearchActive /> : null }
        { !this.state.searching && this.props.query && this.state.results.length ? <SearchResults results={this.state.results} /> : null }
        { !this.state.searching && this.props.query && !this.state.results.length ? <SearchNoResults query={this.props.query} /> : null }
        { !this.props.query && !this.state.searching ? <FeaturedContent /> : null }
      </main>
    );
  }
});

export default DiscoverPage;
