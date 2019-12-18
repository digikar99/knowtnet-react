import React from 'react';
import ReactHtmlParser from 'react-html-parser';
var serverData = require('./serverData.json');

class BrowseLinkBox extends React.Component{

    pingAndOpen(url){
        console.log(url);
        window.open(url);
    }
    shareLink(elt){
        
    }

    render(props){
        // console.log(this.props.remove);
        return (
            <div className="link-box">
              <div className="link-url">
                <a href={this.props.url} target="_blank">{this.props.title}</a>
              </div>
              <div className="link-theme">{this.props.theme}</div>
              <div className="link-level">{this.props.newbie ? "Newbie" : ""}</div>
              <br/>
              <div className="link-description"
                   onClick={(e)=>this.pingAndOpen(this.props.url)}
                   target="_blank">
                <div className="read-more">
                  <span className="read-more-text">
                    READ MORE
                  </span>
                </div>
                <div className="description-contents">
                  {ReactHtmlParser(this.props.description)}
                </div>
              </div>
              <div className="link-actions">
                <div className="link-action"
                     onClick={(e) => this.props.remove(this)}
                  >
                  IGNORE
                  <br/>
                  for now
                </div>
                <div className="link-action"
                     onClick={(e) => this.props.markAsKnownAndRemoveLink(this)}>
                  MARK
                  <br/>
                  as known
                </div>
                <div className="link-share">
                  <i className="material-icons-outlined link-share-icon"
                     onClick={this.shareLink(this.props.url)}>
                    share
                    <span className="link-share-tooltip">COPY LINK</span>
                  </i>
                </div>
              </div>
            </div>
        );
        
    }
}

class BrowseLinkBoxes extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            themeLinkIdListMap: serverData['theme-link-id-list-map']
        };
    }
    render(props){
        const removeMethod = this.props.remove;
        const markAsKnownAndRemoveLink = this.props.markAsKnownAndRemoveLink;
        return(
            <div id={this.props.id}>
              {this.props.links.map(function(link){
                  // console.log(link);
                  return (
                      <BrowseLinkBox id={link.id}
                                     url={link.url}
                                     title={link.title}
                                     description={link.description}
                                     newbie={link["newbie-p"]}
                                     key={link.id}
                                     theme={link.theme}
                                     remove={removeMethod}
                                     markAsKnownAndRemoveLink={markAsKnownAndRemoveLink}/>
                  );    
              })}
            </div>
        );
    }
}

export default BrowseLinkBoxes;
