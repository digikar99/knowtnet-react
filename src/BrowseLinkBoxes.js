import React from 'react';
import ReactHtmlParser from 'react-html-parser';
var serverData = require('./serverData.json');

class BrowseLinkBox extends React.Component{
    constructor(props){
        super(props);
        this.shareLink = this.shareLink.bind(this);
    }
    pingAndOpen(url){
        console.log(url);
        window.open(url);
    }
    shareLink(url){
        if (navigator.share){
            this.props.showLoader();
            navigator
                .share({
                    text: this.props.title,
                    url: this.props.url
                })
                .then(this.props.hideLoader)
                .catch((e)=>{
                    console.log(e);
                    this.props.hideLoader();
                });
        }else{
            navigator.clipboard
                .writeText(this.props.url)
                .then(()=>{}, (e)=>console.log(e));
        }
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
                     onClick={(e)=>this.shareLink(this.props.url)}>
                    share
                    <span className="link-share-tooltip">COPY LINK</span>
                  </i>
                </div>
              </div>
            </div>
        );
        
    }
}

class Loader extends React.Component{
    render(){
        return (
            this.props.displayLoader
                ? <div id="loader-background"><div id="loader"/></div>
                : null
        );   
    }
}

class BrowseLinkBoxes extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            themeLinkIdListMap: serverData['theme-link-id-list-map'],
            displayLoader: false
        };
        this.showLoader = this.showLoader.bind(this);
        this.hideLoader = this.hideLoader.bind(this);
    }
    showLoader() {
        this.setState({displayLoader: true});
    };
    hideLoader(){
        this.setState({displayLoader: false});
    }
    render(props){
        const removeMethod = this.props.remove;
        const markAsKnownAndRemoveLink = this.props.markAsKnownAndRemoveLink;
        const self=this;
        return(
            <div id={this.props.id}>
              <Loader displayLoader={this.state.displayLoader}/>
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
                                     markAsKnownAndRemoveLink={markAsKnownAndRemoveLink}
                                     showLoader={self.showLoader}
                                     hideLoader={self.hideLoader}/>
                  );    
              })}
            </div>
        );
    }
}

export default BrowseLinkBoxes;
